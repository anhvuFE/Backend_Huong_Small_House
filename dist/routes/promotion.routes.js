"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const promotion_controller_1 = require("../controllers/promotion.controller");
const router = (0, express_1.Router)();
router.get('/', promotion_controller_1.listPromotions);
router.post('/', auth_1.authenticate, (0, auth_1.authorize)('admin'), promotion_controller_1.createPromotion);
router.get('/:code', promotion_controller_1.validatePromotion);
exports.default = router;
//# sourceMappingURL=promotion.routes.js.map