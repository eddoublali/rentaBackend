import multer from "multer";
import path from "path";
import fs from "fs";
import os from "os";

// Use different upload directories for different environments
const uploadDir = process.env.NODE_ENV === 'production' 
  ? path.join(os.tmpdir(), "uploads")  // Use /tmp for Vercel/serverless
  : path.join(process.cwd(), "uploads"); // Use project root for development

// Ensure uploads directory exists
const ensureUploadDir = () => {
  try {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
      console.log(`Created upload directory: ${uploadDir}`);
    }
  } catch (error) {
    console.error("Error creating upload directory:", error);
    throw error;
  }
};

// Create directory on startup
ensureUploadDir();

// Storage config
const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    // Ensure directory exists at request time too
    ensureUploadDir();
    cb(null, uploadDir);
  },
  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}-${file.fieldname}${ext}`;
    cb(null, uniqueName);
  },
});

// Export multer middleware
export const upload = multer({ 
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Add basic file type validation if needed
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});