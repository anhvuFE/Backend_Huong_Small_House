"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImagesBuffer = exports.uploadImageBuffer = void 0;
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const env_1 = __importDefault(require("../config/env"));
const appError_1 = __importDefault(require("./appError"));
const resolveFolder = (suffix) => {
    if (suffix && env_1.default.cloudinary.folder) {
        return `${env_1.default.cloudinary.folder}/${suffix}`;
    }
    return env_1.default.cloudinary.folder || suffix || undefined;
};
const uploadImageBuffer = async (file, folderSuffix) => new Promise((resolve, reject) => {
    const folder = resolveFolder(folderSuffix);
    const stream = cloudinary_1.default.uploader.upload_stream({
        folder
    }, (error, result) => {
        if (error || !result) {
            reject(new appError_1.default('Upload ảnh thất bại', 500));
            return;
        }
        resolve({ url: result.secure_url, publicId: result.public_id });
    });
    stream.end(file.buffer);
});
exports.uploadImageBuffer = uploadImageBuffer;
const uploadImagesBuffer = async (files, folderSuffix) => Promise.all(files.map((file) => (0, exports.uploadImageBuffer)(file, folderSuffix)));
exports.uploadImagesBuffer = uploadImagesBuffer;
//# sourceMappingURL=cloudinaryUpload.js.map