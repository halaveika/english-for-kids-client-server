import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import AuthMiddleware from '../middleware/AuthMiddleware';

const authRoute = Router();

authRoute.post('/login',
  async (req:Request, res:Response) => {
    try {
      const { login, password } = req.body;
      if (login !== 'admin') {
        return res.status(404).json({ message: `User ${login} not found ` });
      }
      if (password !== 'admin') {
        return res.status(400).json({ message: 'Invalid password' });
      }
      const token = jwt.sign({ id: 'admin' }, 'brest', { expiresIn: '1h' });
      return res.json({
        token,
        user: {
          id: login,
        },
      });
    } catch (e) {
      console.log(e);
      res.send({ message: `Server error${e}` });
    }
  });

interface IUserRequest {
    user: {
      id: string
  }
}

authRoute.get('/auth', AuthMiddleware,
  async (req:Request, res:Response) => {
    try {
      const userId: IUserRequest = req.body;
      if (userId.user.id !== 'admin') { throw new Error('bad userId'); }
      const token = jwt.sign({ id: userId.user.id }, 'admin', { expiresIn: '1h' });
      return res.json({
        token,
        user: {
          id: userId,
        },
      });
    } catch (e) {
      console.log(e);
      res.send({ message: e });
    }
  });

export default authRoute;
