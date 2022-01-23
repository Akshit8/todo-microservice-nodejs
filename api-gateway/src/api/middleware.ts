import { NextFunction, Request, Response } from "express";

export const tokenMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  req.body.token = token;
  next();
};

export const queryParamMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  for (const key in req.query) {
    req.body[key] = req.query[key];
  }
  next();
};

export const urlParamsMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  for (const key in req.params) {
    if (key === "id") {
      req.body.id = req.params.id;
    }
  }
  next();
};
