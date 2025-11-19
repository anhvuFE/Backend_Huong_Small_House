"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const product_controller_1 = require("../controllers/product.controller");
const router = (0, express_1.Router)();
router.get('/', product_controller_1.listProducts);
router.get('/categories/all', product_controller_1.listCategories);
router.post('/categories', auth_1.authenticate, (0, auth_1.authorize)('admin'), product_controller_1.createCategory);
router.post('/', auth_1.authenticate, (0, auth_1.authorize)('admin'), product_controller_1.createProduct);
router.get('/:productId', product_controller_1.getProduct);
router.put('/:productId', auth_1.authenticate, (0, auth_1.authorize)('admin'), product_controller_1.updateProduct);
router.delete('/:productId', auth_1.authenticate, (0, auth_1.authorize)('admin'), product_controller_1.deleteProduct);
exports.default = router;
//# sourceMappingURL=product.routes.js.map