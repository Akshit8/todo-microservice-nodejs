import { NextFunction, Request, Response, Router } from "express";
import { ServiceBroker } from "moleculer";
import { ExpressMiddleware } from "./types";
import { getServiceBroker } from "../broker";

export class AuthControllerV1 {
  private broker: ServiceBroker;

  constructor(broker: ServiceBroker) {
    this.broker = broker;
  }

  static buildControllerRoutes(
    router: Router,
    tokenMiddleware: ExpressMiddleware
  ): Router {
    const authController = new AuthControllerV1(getServiceBroker());

    router.post("/signup", authController.login);
    router.post("/login", authController.login);
    router.post("/user/:id", tokenMiddleware, authController.user);

    return router;
  }

  async signup(req: Request, res: Response, next: NextFunction) {}

  async login(req: Request, res: Response, next: NextFunction) {}

  async user(req: Request, res: Response, next: NextFunction) {}
}
