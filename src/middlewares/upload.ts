import multer from 'multer';
import AppError from '../utils/appError';

const storage = multer.memoryStorage();

const fileFilter: multer.Options['fileFilter'] = (_req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new AppError('Only image uploads are allowed', 400));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024, files: 10 }
});

export const uploadSingleImage = (field: string) => upload.single(field);
export const uploadMultipleImages = (field: string, maxCount = 5) => upload.array(field, maxCount);

export default upload;
