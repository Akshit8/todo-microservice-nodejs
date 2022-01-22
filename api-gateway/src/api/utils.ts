import { NextFunction, Request, Response } from "express";
import { ExpressHandler, ServiceResponse } from "./types";

export const catchAsync = (fn: ExpressHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};

export const renderAPIResponse = (response: ServiceResponse, res: Response): void => {
  if (response.success) {
    res.status(response.http_status_code);
    res.send({ ...response.data });
  } else {
    res.status(response.http_status_code);
    res.send(response.error);
  }
  return;
};
