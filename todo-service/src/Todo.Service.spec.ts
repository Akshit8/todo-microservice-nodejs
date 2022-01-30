import faker from "@faker-js/faker";
import { mocked } from "jest-mock";
import { BrokerOptions, Errors, ServiceBroker } from "moleculer";
import path from "path";
import { Todo } from "./entity";
import {
  AuthenticationError,
  AuthTokenError,
  ServiceErrorCode,
  ServiceErrorTypes,
  ValidationError
} from "./errors";
import { TodoRepository } from "./repository";
import { ServiceResponse } from "./Todo.Service";
import { JWT } from "./utils";

// mocks
jest.mock("./utils");
jest.mock("./repository");

const moleculerTestConfig = {
  logger: false,
  errorHandler: (err: Error, info: any) => {
    if (err instanceof Errors.ValidationError) {
      const e = new ValidationError(err.data[0].message);

      return {
        success: false,
        http_status_code: e.http_status_code,
        error: {
          error_code: e.internal_status_code,
          error_type: e.type,
          error_message: e.message
        }
      };
    }

    throw err;
  }
} as BrokerOptions;

const getFakeTodo = (): Todo => {
  const todo = new Todo();

  todo.id = Math.floor(Math.random() * 1000 + 1);
  todo.owner = Math.floor(Math.random() * 1000 + 1);
  todo.action_item = faker.lorem.sentence();
  todo.completed = faker.datatype.boolean();
  todo.createdAt = faker.date.past();
  todo.updatedAt = faker.date.past();

  return todo;
};

describe("TEST todo-service", () => {
  const broker = new ServiceBroker(moleculerTestConfig);

  broker.loadService(path.join(__dirname, "Todo.Service.ts"));

  beforeAll(async () => {
    await broker.start();
  });

  afterAll(async () => {
    await broker.stop();
  });

  test("service action not found", async () => {
    let err: Errors.MoleculerError | undefined;
    try {
      await broker.call("todo.random");
    } catch (e) {
      err = e as Errors.MoleculerError;
    }

    expect(err).toBeDefined();
    expect(err).toBeInstanceOf(Errors.ServiceNotFoundError);
  });

  test("all actions access with invalid auth token", async () => {
    for (const action in broker.getLocalService("todo").actions) {
      mocked(JWT.prototype.verifyToken).mockRejectedValueOnce(
        new AuthenticationError("auth token error")
      );
      const response = (await broker.call(`todo.${action}`, {
        token: "randomtoken",
        actionItem: "random action item"
      })) as ServiceResponse;

      expect(response).toBeDefined();
      expect(response.http_status_code).toEqual(401);
      expect(response.error).toBeDefined();
      expect(response.error!.error_code).toEqual(ServiceErrorCode.AUTHENTICATION_ERROR);
      expect(response.error!.error_type).toEqual(
        ServiceErrorTypes.AUTHENTICATION_ERROR
      );
    }
  });

  test("all actions access with internal error for token verification", async () => {
    for (const action in broker.getLocalService("todo").actions) {
      mocked(JWT.prototype.verifyToken).mockRejectedValueOnce(
        new AuthTokenError("auth token error")
      );

      let err: Errors.MoleculerError | undefined;
      try {
        await broker.call(`todo.${action}`, { actionItem: "random action item" });
      } catch (e) {
        err = e as Errors.MoleculerError;
      }

      expect(err).toBeDefined();
      expect(err).toBeInstanceOf(Errors.MoleculerServerError);
      expect(err?.message).toEqual("auth token error");
    }
  });

  test("Action createTodo - ok", async () => {
    const testTodo = getFakeTodo();

    mocked(JWT.prototype.verifyToken).mockResolvedValueOnce({ id: testTodo.owner });
    mocked(TodoRepository.prototype.addNewTodo).mockResolvedValueOnce(testTodo);

    const response = (await broker.call("todo.createTodo", {
      actionItem: testTodo.action_item
    })) as ServiceResponse;

    expect(response).toBeDefined();
    expect(response.http_status_code).toEqual(201);
    expect(response.success).toEqual(true);
    expect(response.data).toBeDefined();
    expect(response.data!.todo).toEqual(testTodo);
  });

  test("Action createTodo - validation error", async () => {
    const response = (await broker.call("todo.createTodo")) as ServiceResponse;

    expect(response).toBeDefined();
    expect(response.http_status_code).toEqual(422);
    expect(response.success).toEqual(false);
    expect(response.error).toBeDefined();
    expect(response.error!.error_code).toEqual(ServiceErrorCode.VALIDATION_ERROR);
    expect(response.error!.error_type).toEqual(ServiceErrorTypes.VALIDATION_ERROR);
  });
});
