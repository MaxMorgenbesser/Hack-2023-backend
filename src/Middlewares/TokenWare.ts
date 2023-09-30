import { Request, Response } from 'express';

import jwt from 'jsonwebtoken';
import { UserContext, UserContextProvider } from '../utils/user-context';

export const TokenWare = UserContextProvider(
  async (req: Request, res: Response, next: Function) => {
    const token = req.headers.authorization;
    if (!token) {
      res.status(401).send({ success: false, message: 'Unauthorized access' });
      return;
    }
    const jwtKey = process.env.JWT_SECRET as string;
    const user = jwt.verify(token, jwtKey);
    if (user) {
      UserContext.set(user);
      next();
    } else {
      res.status(401).send({ success: false, error: 'Unauthorized access' });
      return;
    }
  }
);
