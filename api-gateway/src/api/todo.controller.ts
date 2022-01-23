import { NextFunction, Request, Response, Router } from "express";
import { ServiceBroker } from "moleculer";
import { urlParamsMiddleware } from "./middleware";
import { ServiceResponse } from "./types";
import { renderAPIResponse } from "./utils";
import { broker } from "../broker";

export class TodoControllerV1 {
  private broker: ServiceBroker;

  constructor(broker: ServiceBroker) {
    this.broker = broker;
  }

  static buildControllerRoutes(): Router {
    const todoController = new TodoControllerV1(broker);

    const router = Router();

    router.post("/", todoController.create);
    router.get("/:id", urlParamsMiddleware, todoController.get);
    router.get("/", todoController.getAll);
    router.patch("/:id", todoController.update);
    router.delete("/:id", todoController.delete);

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
