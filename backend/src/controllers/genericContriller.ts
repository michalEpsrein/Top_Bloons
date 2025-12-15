import { Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";

type CrudOptions = {
  folder: string;
  maxFileSizeMB?: number;
  maxStorageGB?: number;
  requiredFields?: string[]; // names expected in req.body
  defaultTags?: string[];
};

const DEFAULT_MAX_FILE_MB = 1.5;
const DEFAULT_MAX_STORAGE_GB = 2;

async function isStorageLimitExceededFor(maxStorageGB: number) {
  try {
    const usage = await cloudinary.api.usage();
    const bytesToGB = 1024 * 1024 * 1024;
    const usedStorageBytes = usage.usage?.storage?.bytes || 0;
    const usedStorageGB = usedStorageBytes / bytesToGB;
    console.log(
      `Cloudinary Storage: ${usedStorageGB.toFixed(2)} GB / ${maxStorageGB} GB`
    );
    return usedStorageGB >= maxStorageGB;
  } catch (error) {
    console.error("Failed to read Cloudinary usage, blocking upload:", error);
    return true;
  }
}

const extractPublicId = (req: Request | any): string | undefined => {
  return (
    req.params?.publicId ||
    req.params?.id ||
    req.query?.publicId ||
    req.query?.id ||
    req.body?.publicId ||
    undefined
  );
};

function sanitizeFolderName(name?: string) {
  if (!name) return undefined;
  return name.replace(/[^a-zA-Z0-9-_]/g, "_").slice(0, 128);
}

export function upload(opts: CrudOptions) {
  const MAX_FILE_SIZE_MB = opts.maxFileSizeMB ?? DEFAULT_MAX_FILE_MB;
  const MAX_STORAGE_LIMIT_GB = opts.maxStorageGB ?? DEFAULT_MAX_STORAGE_GB;

  return async (req: Request | any, res: Response) => {
    const file = req.files?.imageFile;
    const body = req.body || {};

    if (opts.requiredFields) {
      for (const f of opts.requiredFields) {
        if (!body[f])
          return res
            .status(400)
            .json({ message: `Missing required field: ${f}` });
      }
    }

    if (!file)
      return res.status(400).json({ message: "No image file provided." });
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024)
      return res
        .status(400)
        .json({ message: `File exceeds size limit (${MAX_FILE_SIZE_MB}MB).` });

    const limitExceeded = await isStorageLimitExceededFor(MAX_STORAGE_LIMIT_GB);
    if (limitExceeded)
      return res.status(403).json({ message: "Storage limit exceeded." });

    try {
      const fileToUpload = file.tempFilePath || file.data;
      const tags = [
        ...(opts.defaultTags || []),
        ...(body.category ? [body.category] : []),
      ];
      const context = { ...(body || {}) };

      const rawFolderSource = (body.folder ||
        body.owner ||
        body.uploader ||
        body.userId) as string | undefined;
      const senderPart = sanitizeFolderName(rawFolderSource);
      const targetFolder = senderPart
        ? `${opts.folder}/${senderPart}`
        : opts.folder;

      const uploadResult = await cloudinary.uploader.upload(fileToUpload, {
        folder: targetFolder,
        quality: "auto:low",
        width: 1000,
        crop: "limit",
        resource_type: "image",
        tags: tags.join(","),
        context,
      });

      const { public_id: publicId, secure_url: imageUrl } = uploadResult as any;
      return res.status(201).json({
        message: "Uploaded.",
        data: { publicId, imageUrl, context, folder: targetFolder },
      });
    } catch (error) {
      console.error("Upload error:", error);
      return res.status(500).json({ message: "Upload failed." });
    }
  };
}

export function getAll(opts: CrudOptions) {
  return async (req: Request, res: Response) => {
    try {
      const searchResult = await cloudinary.search
        .expression(`folder:${opts.folder}`)
        .with_field("context")
        .with_field("tags")
        .max_results(500)
        .execute();
      const items = (searchResult.resources || []).map((r: any) => ({
        id: r.public_id,
        url: r.secure_url,
        tags: r.tags,
        context: r.context,
      }));
      return res
        .status(200)
        .json({ message: "OK", count: items.length, items });
    } catch (error) {
      console.error("Search error:", error);
      return res.status(500).json({ message: "Failed to fetch items." });
    }
  };
}

export function get(opts: CrudOptions) {
  return async (req: Request | any, res: Response) => {
    const publicId = extractPublicId(req);
    if (!publicId) return res.status(400).json({ message: "Missing id" });

    try {
      const result = await cloudinary.api.resource(publicId, {
        resource_type: "image",
      });
      return res.status(200).json({ data: result });
    } catch (error: any) {
      console.error("Resource fetch error:", error);
      if (error.http_code === 404)
        return res.status(404).json({ message: "Not found" });
      return res.status(500).json({ message: "Failed to fetch resource" });
    }
  };
}

export function remove(opts: CrudOptions) {
  return async (req: Request | any, res: Response) => {
    const publicId = extractPublicId(req);
    if (!publicId) return res.status(400).json({ message: "Missing id" });

    try {
      const result = await cloudinary.uploader.destroy(publicId);
      if (result.result === "ok")
        return res.status(200).json({ message: "Deleted" });
      if (result.result === "not found")
        return res.status(404).json({ message: "Not found" });
      return res
        .status(500)
        .json({ message: `Delete failed: ${result.result}` });
    } catch (error) {
      console.error("Delete error:", error);
      return res.status(500).json({ message: "Failed to delete." });
    }
  };
}
