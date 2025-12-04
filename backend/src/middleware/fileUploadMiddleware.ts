import fileUpload from "express-fileupload";

const fileUploadConfig = {
  limits: { fileSize: 5 * 1024 * 1024 },
  useTempFiles: true,
  tempFileDir: "/tmp/",
};

export const fileUploadMiddleware = fileUpload(fileUploadConfig);
