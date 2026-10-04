import multer from "multer";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { apiError } from "../utils/apiError.js";
import { projectRoot } from "../config/env.js";

const uploadDirectory = path.join(projectRoot, ".tmp", "uploads");
fs.mkdirSync(uploadDirectory, { recursive: true });

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadDirectory),
    filename: (_req, file, cb) => {
      const extension = path.extname(file.originalname).toLowerCase();
      cb(null, `${crypto.randomUUID()}${extension}`);
    },
});

export const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024, files: 1 },
    fileFilter: (_req, file, cb) => {
      if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.mimetype)) {
        return cb(new apiError(400, "Upload a JPEG, PNG, WebP, or GIF image"));
      }
      cb(null, true);
    },
});
