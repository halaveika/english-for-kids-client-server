import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

export interface IGetUserAuthInfoRequest extends JwtPayload {
  user: string,
}

const AuthMiddleware = (req:Request, res:Response, next:NextFunction) => {
  if (req.method === 'OPTIONS') {
    return next()!;
  }

  try {
    const token = req.headers.authorization!.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Auth error token' });
    }
    const decoded = jwt.verify(token, 'brest');
    req.body = decoded;
    next();
  } catch (e) {
    console.log(e);
    return res.status(401)!.json({ message: `Auth error${e}` });
  }
};

export default AuthMiddleware;
