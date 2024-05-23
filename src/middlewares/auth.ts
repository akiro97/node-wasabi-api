import { Request } from 'express';
import jwt from 'jsonwebtoken';
import { decodeToken } from './handlerToken';

export const getUserIDFromToken = async (req: Request) => {
    try {
      const authorization = req.headers["authorization"]!;
      jwt.verify(authorization, process.env.APP_SECRET!);
      const getDecodeToken = decodeToken(authorization);
      return getDecodeToken?._id;
    } catch (err: any) {
      console.log("err: ", err);
      throw new Error(err);
    }
  };