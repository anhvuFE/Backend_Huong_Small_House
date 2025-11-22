import { Router } from 'express';
import Joi from 'joi';
import { authenticate } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { changePassword, getProfile, updateProfile } from '../controllers/profile.controller';
import { uploadSingleImage } from '../middlewares/upload';

const router = Router();

const updateProfileSchema = Joi.object({
  name: Joi.string().optional(),
  avatar: Joi.string().uri().optional(),
  phone: Joi.string().optional(),
  address: Joi.string().optional()
});

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(6).required()
});

router.get('/', authenticate, getProfile);
router.put('/', authenticate, uploadSingleImage('avatar'), validate(updateProfileSchema), updateProfile);
router.put('/password', authenticate, validate(changePasswordSchema), changePassword);

export default router;
