import express from 'express';
import { jwtVerify } from 'jose';

const { Request, Response, NextFunction } = express;

const JWT_SECRET = 'your-secret-key';

export async function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    req.user = payload;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Forbidden: Invalid token' });
  }
}
