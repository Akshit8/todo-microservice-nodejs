import { NextFunction, Request, Response, Router } from "express";
import { ExpressMiddleware } from "./middleware";

export class AuthControllerV1 {
  static buildControllerRoutes(
    router: Router,
    tokenMiddleware: ExpressMiddleware
  ): Router {
    const authController = new AuthControllerV1();

    router.post("/signup", authController.login);
    router.post("/login", authController.login);
    router.post("/user/:id", tokenMiddleware, authController.user);

    return router;
  }

  async signup(req: Request, res: Response, next: NextFunction) {}

  async login(req: Request, res: Response, next: NextFunction) {}

  async user(req: Request, res: Response, next: NextFunction) {}
}
