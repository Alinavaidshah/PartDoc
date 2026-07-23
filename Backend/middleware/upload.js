import multer from 'multer';
import path from 'path';
import fs from 'fs';

// 1. Folder check: Agar public/images folder nahi hai, toh automatic bana dega
const uploadDir = 'public/images/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 2. Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Unique filename banane ke liye timestamp aur original name ka combo
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${uniqueSuffix}-${file.originalname.replace(/\s+/g, '-')}`);
  }
});

// 3. File Type Validation (Sirf images allow hongi)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only images (jpg, jpeg, png, webp) are allowed!'));
  }
};

// 4. Multer Instance Export
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});