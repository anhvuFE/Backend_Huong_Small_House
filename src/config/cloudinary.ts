import { v2 as cloudinary } from 'cloudinary';
import env from './env';

if (env.cloudinary.url) {
  cloudinary.config(env.cloudinary.url);
}

export default cloudinary;
