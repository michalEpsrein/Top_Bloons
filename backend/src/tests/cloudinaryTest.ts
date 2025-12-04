import { v2 as cloudinary } from "cloudinary";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../") });

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

async function testConnection() {
  console.log("Attempting to connect to Cloudinary...");

  try {
    const usage = await cloudinary.api.usage();

    if (usage && usage.plan) {
      console.log("✅ Success! Successfully connected to Cloudinary.");
      console.log(`Cloud Name: ${cloudinary.config().cloud_name}`);
      console.log(`Plan: ${usage.plan}`);

      if (usage.limit && usage.limit.storage) {
        console.log(`Storage Limit: ${usage.limit.storage}`);
      }

      console.log(
        "\nConnection is valid. You can now use Cloudinary services."
      );
    } else {
      console.log(
        "❌ Error: Connected, but failed to retrieve full usage data."
      );
    }
  } catch (error) {
    console.error("❌ Connection failed!");
    if (error instanceof Error) {
      console.error(`Details: ${error.message}`);
    } else {
      console.error(`Details: ${String(error)}`);
    }

    if (
      typeof error === "object" &&
      error !== null &&
      "http_code" in error &&
      (error as any).http_code === 401
    ) {
      console.error(
        "Tip: Check your API Key and API Secret. (Unauthorized 401)"
      );
    }
  }
}

testConnection();
