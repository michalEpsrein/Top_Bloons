import express from "express";
import * as dotenv from "dotenv";
import * as path from "path";
import { v2 as cloudinary } from "cloudinary";

import catalogRouter from "./routes/catalogRouter";

dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

const app = express();
const PORT = process.env.PORT || 4000;

try {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  console.log("Cloudinary configuration loaded successfully.");
} catch (error) {
  console.error("❌ Cloudinary configuration failed! Check .env variables.");
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/catalog", catalogRouter);

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
