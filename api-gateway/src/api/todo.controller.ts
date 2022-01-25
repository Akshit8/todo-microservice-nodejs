import { NextFunction, Request, Response, Router } from "express";
import { urlParamsMiddleware } from "./middleware";
import { ServiceResponse } from "./types";
import { renderAPIResponse } from "./utils";
import { getServiceBroker } from "../moleculer/broker";

const broker = getServiceBroker();

export class TodoControllerV1 {
  static buildControllerRoutes(): Router {
    const todoController = new TodoControllerV1();

    const router = Router();

    router.post("/", todoController.create);
    router.get("/:id", urlParamsMiddleware, todoController.get);
    router.get("/", todoController.getAll);
    router.patch("/:id", urlParamsMiddleware, todoController.update);
    router.delete("/:id", urlParamsMiddleware, todoController.delete);

    return router;
  }

  async create(req: Request, res: Response, next: NextFunction) {
    const response = (await broker.call("todo.createTodo", {
      ...req.body
    })) as ServiceResponse;
    renderAPIResponse(response, res);
  }

  async get(req: Request, res: Response, next: NextFunction) {
    const response = (await broker.call("todo.getTodo", {
      ...req.body
    })) as ServiceResponse;
    renderAPIResponse(response, res);
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    const response = (await broker.call("todo.getAllTodos", {
      ...req.body
    })) as ServiceResponse;
    renderAPIResponse(response, res);
  }

  async update(req: Request, res: Response, next: NextFunction) {
    const response = (await broker.call("todo.updateTodo", {
      ...req.body
    })) as ServiceResponse;
    renderAPIResponse(response, res);
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    const response = (await broker.call("todo.deleteTodo", {
      ...req.body
    })) as ServiceResponse;
    renderAPIResponse(response, res);
  }
}
