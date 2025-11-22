import multer from 'multer';
declare const upload: multer.Multer;
export declare const uploadSingleImage: (field: string) => import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
export declare const uploadMultipleImages: (field: string, maxCount?: number) => import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
export default upload;
//# sourceMappingURL=upload.d.ts.map