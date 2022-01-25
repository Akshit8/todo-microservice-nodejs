import { NextFunction, Request, Response } from "express";
import { APIError, InternalServerError, NotFoundError } from "./error";
import { getAppLogger } from "../logger";

const logger = getAppLogger();

export const healthCheck = (req: Request, res: Response, next: NextFunction) => {
  res.send({ success: true, message: "ok" });
};

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
  logger.error(err);
  let e = err as APIError;
  if (!(err instanceof APIError)) {
    e = new InternalServerError();
  }
  res.status(e.status_code).send(e.message);
};
