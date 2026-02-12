import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export const signAccessToken = (payload) =>
  jwt.sign(payload, env.jwtAccessSecret, { expiresIn: env.jwtAccessTtl });

export const verifyAccessToken = (token) => jwt.verify(token, env.jwtAccessSecret);
