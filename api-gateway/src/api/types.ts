import { NextFunction, Request, Response, Router } from "express";

export type ExpressMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => void;

export interface ControllerInterface {
  buildControllerRoutes(router: Router, ...args: ExpressMiddleware[]): Router;
}
