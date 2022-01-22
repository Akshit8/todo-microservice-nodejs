import { NextFunction, Request, Response, Router } from "express";

export type ExpressMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => void;

export type ExpressHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

export interface ControllerInterface {
  buildControllerRoutes(router: Router, ...args: ExpressMiddleware[]): Router;
}

export interface ServiceError {
  error_code: string;
  error_type: string;
  error_message: string;
}

export type ServiceData = Object;

export interface ServiceResponse {
  success: boolean;
  http_status_code: number;
  error?: ServiceError;
  data?: ServiceData;
}
