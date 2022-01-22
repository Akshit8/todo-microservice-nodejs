import { NextFunction, Request, Response, Router } from "express";
import { ExpressMiddleware, ServiceResponse } from "./types";
import { catchAsync, renderAPIResponse } from "./utils";
import { broker } from "../broker";

export class AuthControllerV1 {
  static buildControllerRoutes(tokenMiddleware: ExpressMiddleware): Router {
    const authController = new AuthControllerV1();

    const router = Router();

    router.post("/signup", catchAsync(authController.signup));
    router.post("/login", catchAsync(authController.login));
    router.get("/user", tokenMiddleware, catchAsync(authController.user));

    return router;
  }

  async signup(req: Request, res: Response, next: NextFunction) {
    const response = (await broker.call("auth.signUp", {
      ...req.body
    })) as ServiceResponse;
    renderAPIResponse(response, res);
  }

  async login(req: Request, res: Response, next: NextFunction) {
    const response = (await broker.call("auth.login", {
      ...req.body
    })) as ServiceResponse;
    renderAPIResponse(response, res);
  }

  async user(req: Request, res: Response, next: NextFunction) {
    const response = (await broker.call("auth.getUser", {
      ...req.body
    })) as ServiceResponse;
    renderAPIResponse(response, res);
  }
}
