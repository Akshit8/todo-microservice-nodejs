import { NextFunction, Request, Response, Router } from "express";
import { ExpressMiddleware } from "./middleware";

export class TodoControllerV1 {
  static buildControllerRoutes(
    router: Router,
    tokenMiddleware: ExpressMiddleware
  ): Router {
    const todoController = new TodoControllerV1();

    router.post("/", tokenMiddleware, todoController.create);
    router.get("/:id", tokenMiddleware, todoController.get);
    router.get("/", tokenMiddleware, todoController.getAll);
    router.patch("/:id", tokenMiddleware, todoController.update);
    router.delete("/:id", tokenMiddleware, todoController.delete);

    return router;
  }

  async create(req: Request, res: Response, next: NextFunction) {}

  async get(req: Request, res: Response, next: NextFunction) {}

  async getAll(req: Request, res: Response, next: NextFunction) {}

  async update(req: Request, res: Response, next: NextFunction) {}

  async delete(req: Request, res: Response, next: NextFunction) {}
}
