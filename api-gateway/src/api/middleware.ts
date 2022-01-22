import { NextFunction, Request, Response } from "express";

export type ExpressMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => void;

export const TokenMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.header("Authorization")?.replace("Bearer", "");
  req.body.token = token;
  next();
};
