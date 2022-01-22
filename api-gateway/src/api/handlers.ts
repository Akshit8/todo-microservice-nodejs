import { NextFunction, Request, Response } from "express";
import { APIError, NotFoundError } from "./error";

export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError());
};

export const serverErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // TODO
  if (err instanceof APIError) {
    res.status(err.status_code).send(err);
  }
};
