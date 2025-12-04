import { Router } from "express";
import { fileUploadMiddleware } from "../middleware/fileUploadMiddleware";
import {
  uploadImage,
  getCatalog,
  deleteImage,
} from "../controllers/catalogController";

const router = Router();

router.post("/upload", fileUploadMiddleware, uploadImage);

router.get("/", getCatalog);
router.delete("/delete/:publicId", deleteImage);

export default router;
