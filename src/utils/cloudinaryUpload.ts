import cloudinary from '../config/cloudinary';
import env from '../config/env';
import AppError from './appError';

export interface UploadedImage {
  url: string;
  publicId: string;
}

const resolveFolder = (suffix?: string): string | undefined => {
  if (suffix && env.cloudinary.folder) {
    return `${env.cloudinary.folder}/${suffix}`;
  }
  return env.cloudinary.folder || suffix || undefined;
};

export const uploadImageBuffer = async (
  file: Express.Multer.File,
  folderSuffix?: string
): Promise<UploadedImage> =>
  new Promise((resolve, reject) => {
    const folder = resolveFolder(folderSuffix);
    const stream = cloudinary.uploader.upload_stream(
      {
        folder
      },
      (error, result) => {
        if (error || !result) {
          reject(new AppError('Upload ảnh thất bại', 500));
          return;
        }
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );

    stream.end(file.buffer);
  });

export const uploadImagesBuffer = async (
  files: Express.Multer.File[],
  folderSuffix?: string
): Promise<UploadedImage[]> => Promise.all(files.map((file) => uploadImageBuffer(file, folderSuffix)));
