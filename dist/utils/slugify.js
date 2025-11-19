"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const slugify = (text) => text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
exports.default = slugify;
//# sourceMappingURL=slugify.js.map