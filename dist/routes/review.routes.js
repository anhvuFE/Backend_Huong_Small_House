"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const review_controller_1 = require("../controllers/review.controller");
const router = (0, express_1.Router)({ mergeParams: true });
router.get('/:productId', review_controller_1.listReviews);
router.post('/', auth_1.authenticate, review_controller_1.createReview);
exports.default = router;
//# sourceMappingURL=review.routes.js.map