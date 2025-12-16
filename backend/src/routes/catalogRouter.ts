import { Router } from "express";
import { fileUploadMiddleware } from "../middleware/fileUploadMiddleware";
import {
  uploadImage,
  getCatalog,
  getImage,
  deleteImage,
} from "../controllers/catalogController";

const router = Router();

router.post("/upload", fileUploadMiddleware, uploadImage);
router.get("/", getCatalog);
router.get("/getImage", getImage);
router.delete("/deleteImage", deleteImage);

export default router;
