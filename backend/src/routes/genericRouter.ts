import { Router } from "express";
import { upload, getAll, get, remove } from "../controllers/genericContriller";
import { fileUploadMiddleware } from "../middleware/fileUploadMiddleware";

const router = Router();

const opts = { folder: "Top_Bloons_Catalog" };
const createHandler = upload(opts);
const readAllHandler = getAll(opts);
const readOneHandler = get(opts);
const deleteHandler = remove(opts);

router.post("/", fileUploadMiddleware, createHandler);
router.get("/", readAllHandler);
router.get("/:publicId", readOneHandler);
router.delete("/", deleteHandler); 
router.delete("/:publicId", deleteHandler);

export default router;
