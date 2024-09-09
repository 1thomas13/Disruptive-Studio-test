import { Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { IUser } from '../models';

export const authenticateUser = (roles: string[]) => {
  return (req: any, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET!, (err: any, user: any) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid token' });
      }

      req.user = user

      if (user && roles.includes((user as JwtPayload).role)) {
        return next();
      }

      return res.status(403).json({ message: 'Access denied' });
    });
  };
};
