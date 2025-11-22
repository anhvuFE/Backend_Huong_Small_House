"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadMultipleImages = exports.uploadSingleImage = void 0;
const multer_1 = __importDefault(require("multer"));
const appError_1 = __importDefault(require("../utils/appError"));
const storage = multer_1.default.memoryStorage();
const fileFilter = (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    }
    else {
        cb(new appError_1.default('Only image uploads are allowed', 400));
    }
};
const upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024, files: 10 }
});
const uploadSingleImage = (field) => upload.single(field);
exports.uploadSingleImage = uploadSingleImage;
const uploadMultipleImages = (field, maxCount = 5) => upload.array(field, maxCount);
exports.uploadMultipleImages = uploadMultipleImages;
exports.default = upload;
//# sourceMappingURL=upload.js.map