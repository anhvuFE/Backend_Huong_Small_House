import axios from 'axios';
import crypto from 'crypto';
import env from './env';

export const sepayClient = axios.create({
  baseURL: env.sepay.endpoint,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': env.sepay.apiKey
  }
});

export const signSepayPayload = (payload: Record<string, unknown>): string => {
  const raw = JSON.stringify(payload);
  return crypto.createHmac('sha256', env.sepay.secret).update(raw).digest('hex');
};
