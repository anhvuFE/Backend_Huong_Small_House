export interface UploadedImage {
    url: string;
    publicId: string;
}
export declare const uploadImageBuffer: (file: Express.Multer.File, folderSuffix?: string) => Promise<UploadedImage>;
export declare const uploadImagesBuffer: (files: Express.Multer.File[], folderSuffix?: string) => Promise<UploadedImage[]>;
//# sourceMappingURL=cloudinaryUpload.d.ts.map