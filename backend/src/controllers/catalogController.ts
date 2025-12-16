import { upload, getAll, get, remove } from "./genericContriller";

const BALLOON_CATALOG_OPTIONS = {
  folder: "Top_Bloons_Catalog",
  maxFileSizeMB: 10,
  maxStorageGB: 5,
  requiredFields: ["category"],
  defaultTags: ["בלונים", "קטלוג"],
};

export const uploadImage = upload(BALLOON_CATALOG_OPTIONS);
export const getCatalog = getAll(BALLOON_CATALOG_OPTIONS);
export const getImage = get(BALLOON_CATALOG_OPTIONS);
export const deleteImage = remove(BALLOON_CATALOG_OPTIONS);
