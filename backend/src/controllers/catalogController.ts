import { Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";

const MAX_STORAGE_LIMIT_GB = 2;
const MAX_FILE_SIZE_MB = 1.5;
const CATALOG_FOLDER = "Top_Bloons_Catalog";

async function isStorageLimitExceeded(): Promise<boolean> {
  try {
    const usage = await cloudinary.api.usage();
    const bytesToGB = 1024 * 1024 * 1024;

    const usedStorageBytes = usage.usage?.storage?.bytes || 0;
    const usedStorageGB = usedStorageBytes / bytesToGB;

    console.log(
      `Current Storage Used: ${usedStorageGB.toFixed(
        2
      )} GB / ${MAX_STORAGE_LIMIT_GB} GB`
    );

    return usedStorageGB >= MAX_STORAGE_LIMIT_GB;
  } catch (error) {
    console.error(
      "Failed to retrieve Cloudinary usage data. Blocking upload to be safe.",
      (error as { message: string }).message
    );
    return true;
  }
}

export const uploadImage = async (req: Request | any, res: Response) => {
  // 1. בדיקת קובץ ונתונים נוספים
  const imageFile = req.files?.imageFile;
  const { category, description, price } = req.body;

  if (!imageFile) {
    return res.status(400).json({ message: "לא נבחר קובץ תמונה להעלאה." });
  }
  if (!category) {
    return res.status(400).json({ message: "נדרשת קטגוריה עבור הקטלוג." });
  }

  // 2. בדיקת גודל קובץ
  if (imageFile.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
    return res.status(400).json({
      message: `גודל הקובץ חורג מהמגבלה המותרת (${MAX_FILE_SIZE_MB}MB).`,
    });
  }

  // 3. בדיקת מכסת אחסון
  const limitExceeded = await isStorageLimitExceeded();
  if (limitExceeded) {
    return res.status(403).json({
      message:
        "שגיאה: הגעת למגבלת האחסון של הקטלוג. אנא מחקי תמונות ישנות לפני העלאת חדשות.",
    });
  }

  // 4. העלאה ל-Cloudinary עם נתוני קטלוג (Tags & Context)
  try {
    const fileToUpload = imageFile.tempFilePath || imageFile.data;
    const tagsArray = [category, "בלונים", "קטלוג"];

    const metadataContext = {
      description: description || "אין תיאור",
      price: price || "N/A",
      date_added: new Date().toISOString().split("T")[0],
    };

    const uploadResult = await cloudinary.uploader.upload(fileToUpload, {
      folder: CATALOG_FOLDER,
      quality: "auto:low",
      width: 1000,
      crop: "limit",
      resource_type: "image",
      tags: tagsArray.join(","),
      context: metadataContext,
    });

    const { public_id: publicId, secure_url: imageUrl } = uploadResult;

    return res.status(201).json({
      message: "התמונה הועלתה והקטלוג עודכן בהצלחה!",
      data: { publicId, imageUrl, category, context: metadataContext },
    });
  } catch (uploadError) {
    console.error("Cloudinary Upload Error:", uploadError);
    return res.status(500).json({ message: "כשל בהעלאה לשרת הענן." });
  }
};

export const getCatalog = async (req: Request, res: Response) => {
  try {
    const searchResult = await cloudinary.search
      .expression(`folder:${CATALOG_FOLDER}`)
      .with_field("context")
      .with_field("tags")
      .max_results(500)
      .execute();

    const catalogItems = searchResult.resources.map((resource: any) => ({
      publicId: resource.public_id,
      url: resource.secure_url,
      category: resource.tags ? resource.tags[0] : "ללא קטגוריה",
      metadata: resource.context || {},
    }));

    return res.status(200).json({
      message: "קטלוג נשלף בהצלחה.",
      count: catalogItems.length,
      catalog: catalogItems,
    });
  } catch (error) {
    console.error("Cloudinary Search Error:", error);
    return res.status(500).json({ message: "כשל בשליפת נתוני הקטלוג מהענן." });
  }
};

export const deleteImage = async (req: Request, res: Response) => {
  const { publicId } = req.params;

  if (!publicId) {
    return res.status(400).json({ message: "חסר publicId למחיקה." });
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result === "ok") {
      return res
        .status(200)
        .json({ message: `התמונה ${publicId} נמחקה בהצלחה.` });
    } else if (result.result === "not found") {
      return res
        .status(404)
        .json({ message: `התמונה ${publicId} לא נמצאה ב-Cloudinary.` });
    } else {
      return res
        .status(500)
        .json({ message: `כשל במחיקת התמונה: ${result.result}` });
    }
  } catch (error) {
    console.error("Cloudinary Deletion Error:", error);
    return res.status(500).json({ message: "כשל במחיקת התמונה." });
  }
};
