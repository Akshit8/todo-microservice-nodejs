import { NextFunction, Request, Response, Router } from "express";
import { urlParamsMiddleware } from "./middleware";
import { ServiceResponse } from "./types";
import { catchAsync, renderAPIResponse } from "./utils";
import { getServiceBroker } from "../moleculer/broker";

const broker = getServiceBroker();

export class TodoControllerV1 {
  static buildControllerRoutes(): Router {
    const todoController = new TodoControllerV1();

    const router = Router();

    router.post("/", catchAsync(todoController.create));
    router.get("/:id", urlParamsMiddleware, catchAsync(todoController.get));
    router.get("/", catchAsync(todoController.getAll));
    router.patch("/:id", urlParamsMiddleware, catchAsync(todoController.update));
    router.delete("/:id", urlParamsMiddleware, catchAsync(todoController.delete));

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
