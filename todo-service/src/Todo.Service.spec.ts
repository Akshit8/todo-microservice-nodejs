import faker from "@faker-js/faker";
import { mocked } from "jest-mock";
import { BrokerOptions, Errors, ServiceBroker } from "moleculer";
import path from "path";
import { Todo } from "./entity";
import {
  AuthenticationError,
  AuthTokenError,
  ORMError,
  ResourceNotFoundError,
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

  test("Action createTodo - ok", async () => {
    const testTodo = getFakeTodo();

    mocked(JWT.prototype.verifyToken).mockResolvedValueOnce({ id: testTodo.owner });
    mocked(TodoRepository.prototype.addNewTodo).mockResolvedValueOnce(testTodo);

    const response = (await broker.call("todo.createTodo", {
      token: "test-token",
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

  test("Action createTodo - invalid token", async () => {
    const testTodo = getFakeTodo();

    mocked(JWT.prototype.verifyToken).mockRejectedValueOnce(
      new AuthenticationError("invalid token")
    );

    const response = (await broker.call("todo.createTodo", {
      token: "test-token",
      actionItem: testTodo.action_item
    })) as ServiceResponse;

    expect(response).toBeDefined();
    expect(response.http_status_code).toEqual(401);
    expect(response.success).toEqual(false);
    expect(response.error).toBeDefined();
    expect(response.error!.error_code).toEqual(ServiceErrorCode.AUTHENTICATION_ERROR);
    expect(response.error!.error_type).toEqual(ServiceErrorTypes.AUTHENTICATION_ERROR);
  });

  test("Action createTodo - token error", async () => {
    const testTodo = getFakeTodo();

    mocked(JWT.prototype.verifyToken).mockRejectedValueOnce(
      new AuthTokenError("token error")
    );

    let err: Error | undefined;
    try {
      await broker.call("todo.createTodo", {
        token: "test-token",
        actionItem: testTodo.action_item
      });
    } catch (e) {
      err = e as Error;
    }

    expect(err).toBeDefined();
    expect(err).toBeInstanceOf(Errors.MoleculerServerError);
    expect(err!.message).toEqual("token error");
  });

  test("Action createTodo - repository error", async () => {
    const testTodo = getFakeTodo();

    mocked(JWT.prototype.verifyToken).mockResolvedValueOnce({ id: testTodo.owner });
    mocked(TodoRepository.prototype.addNewTodo).mockRejectedValueOnce(
      new ORMError("repository error")
    );

    let err: Error | undefined;
    try {
      await broker.call("todo.createTodo", {
        token: "test-token",
        actionItem: testTodo.action_item
      });
    } catch (e) {
      err = e as Error;
    }

    expect(err).toBeDefined();
    expect(err).toBeInstanceOf(Errors.MoleculerServerError);
    expect(err!.message).toEqual("repository error");
  });

  test("Action getTodo - ok", async () => {
    const testTodo = getFakeTodo();

    mocked(JWT.prototype.verifyToken).mockResolvedValueOnce({ id: testTodo.owner });
    mocked(TodoRepository.prototype.getTodoById).mockResolvedValueOnce(testTodo);

    const response = (await broker.call("todo.getTodo", {
      id: testTodo.id
    })) as ServiceResponse;

    expect(response).toBeDefined();
    expect(response.http_status_code).toEqual(200);
    expect(response.success).toEqual(true);
    expect(response.data).toBeDefined();
    expect(response.data!.todo).toEqual(testTodo);
  });

  test("Action getTodo - validation error", async () => {
    const response = (await broker.call("todo.getTodo")) as ServiceResponse;

    expect(response).toBeDefined();
    expect(response.http_status_code).toEqual(422);
    expect(response.success).toEqual(false);
    expect(response.error).toBeDefined();
    expect(response.error!.error_code).toEqual(ServiceErrorCode.VALIDATION_ERROR);
    expect(response.error!.error_type).toEqual(ServiceErrorTypes.VALIDATION_ERROR);
  });

  test("Action getTodo - todo not found", async () => {
    mocked(JWT.prototype.verifyToken).mockResolvedValueOnce({ id: 1 });
    mocked(TodoRepository.prototype.getTodoById).mockRejectedValueOnce(
      new ResourceNotFoundError("todo not found")
    );

    const response = (await broker.call("todo.getTodo", { id: 1 })) as ServiceResponse;

    expect(response).toBeDefined();
    expect(response.http_status_code).toEqual(404);
    expect(response.success).toEqual(false);
    expect(response.error).toBeDefined();
    expect(response.error!.error_code).toEqual(
      ServiceErrorCode.RESOURCE_NOT_FOUND_ERROR
    );
    expect(response.error!.error_type).toEqual(
      ServiceErrorTypes.RESOURCE_NOT_FOUND_ERROR
    );
  });

  test("Action getTodo - repsoitory error", async () => {
    mocked(JWT.prototype.verifyToken).mockResolvedValueOnce({ id: 1 });
    mocked(TodoRepository.prototype.getTodoById).mockRejectedValueOnce(
      new ORMError("repository error")
    );

    let err: Error | undefined;
    try {
      await broker.call("todo.getTodo", { id: 1 });
    } catch (e) {
      err = e as Error;
    }

    expect(err).toBeDefined();
    expect(err).toBeInstanceOf(Errors.MoleculerServerError);
    expect(err!.message).toEqual("repository error");
  });

  test("Action getAllTodod - ok", async () => {
    const testUsers = [getFakeTodo(), getFakeTodo()];

    mocked(JWT.prototype.verifyToken).mockResolvedValueOnce({ id: 1 });
    mocked(TodoRepository.prototype.getAllTodos).mockResolvedValueOnce(testUsers);

    const response = (await broker.call("todo.getAllTodos")) as ServiceResponse;

    expect(response).toBeDefined();
    expect(response.http_status_code).toEqual(200);
    expect(response.success).toEqual(true);
    expect(response.data).toBeDefined();
    expect((response.data!.todos as Todo[]).length).toEqual(2);
    expect(response.data!.todos).toEqual(testUsers);
  });

  test("Action getAllTodod - repository error", async () => {
    mocked(JWT.prototype.verifyToken).mockResolvedValueOnce({ id: 1 });
    mocked(TodoRepository.prototype.getAllTodos).mockRejectedValueOnce(
      new ORMError("repository error")
    );

    let err: Error | undefined;
    try {
      await broker.call("todo.getAllTodos");
    } catch (e) {
      err = e as Error;
    }

    expect(err).toBeDefined();
    expect(err).toBeInstanceOf(Errors.MoleculerServerError);
    expect(err!.message).toEqual("repository error");
  });

  test("Action updateTodo - ok", async () => {
    const testTodo = getFakeTodo();

    mocked(JWT.prototype.verifyToken).mockResolvedValueOnce({ id: testTodo.owner });
    mocked(TodoRepository.prototype.updateTodo).mockResolvedValueOnce(testTodo);

    const response = (await broker.call("todo.updateTodo", {
      id: testTodo.id,
      actionItem: testTodo.action_item
    })) as ServiceResponse;

    expect(response).toBeDefined();
    expect(response.http_status_code).toEqual(200);
    expect(response.success).toEqual(true);
    expect(response.data).toBeDefined();
    expect(response.data!.todo).toEqual(testTodo);
  });

  test("Action updateTodo - validation error", async () => {
    const response = (await broker.call("todo.updateTodo")) as ServiceResponse;

    expect(response).toBeDefined();
    expect(response.http_status_code).toEqual(422);
    expect(response.success).toEqual(false);
    expect(response.error).toBeDefined();
    expect(response.error!.error_code).toEqual(ServiceErrorCode.VALIDATION_ERROR);
    expect(response.error!.error_type).toEqual(ServiceErrorTypes.VALIDATION_ERROR);
  });

  test("Action updateTodo - todo not found", async () => {
    mocked(JWT.prototype.verifyToken).mockResolvedValueOnce({ id: 1 });
    mocked(TodoRepository.prototype.updateTodo).mockRejectedValueOnce(
      new ResourceNotFoundError("todo not found")
    );

    const response = (await broker.call("todo.updateTodo", {
      id: 1,
      actionItem: "test"
    })) as ServiceResponse;

    expect(response).toBeDefined();
    expect(response.http_status_code).toEqual(404);
    expect(response.success).toEqual(false);
    expect(response.error).toBeDefined();
    expect(response.error!.error_code).toEqual(
      ServiceErrorCode.RESOURCE_NOT_FOUND_ERROR
    );
    expect(response.error!.error_type).toEqual(
      ServiceErrorTypes.RESOURCE_NOT_FOUND_ERROR
    );
  });

  test("Action updateTodo - repository error", async () => {
    mocked(JWT.prototype.verifyToken).mockResolvedValueOnce({ id: 1 });
    mocked(TodoRepository.prototype.updateTodo).mockRejectedValueOnce(
      new ORMError("repository error")
    );

    let err: Error | undefined;
    try {
      await broker.call("todo.updateTodo", {
        id: 1,
        actionItem: "test"
      });
    } catch (e) {
      err = e as Error;
    }

    expect(err).toBeDefined();
    expect(err).toBeInstanceOf(Errors.MoleculerServerError);
    expect(err!.message).toEqual("repository error");
  });

  test("Action deleteTodo - ok", async () => {
    mocked(JWT.prototype.verifyToken).mockResolvedValueOnce({ id: 1 });
    mocked(TodoRepository.prototype.deleteTodo).mockResolvedValueOnce();

    const response = (await broker.call("todo.deleteTodo", {
      id: 1
    })) as ServiceResponse;

    expect(response).toBeDefined();
    expect(response.http_status_code).toEqual(200);
    expect(response.success).toEqual(true);
  });

  test("Action deleteTodo - repository error", async () => {
    mocked(JWT.prototype.verifyToken).mockResolvedValueOnce({ id: 1 });
    mocked(TodoRepository.prototype.deleteTodo).mockRejectedValueOnce(
      new ORMError("repository error")
    );

    let err: Error | undefined;
    try {
      await broker.call("todo.deleteTodo", { id: 1 });
    } catch (e) {
      err = e as Error;
    }

    expect(err).toBeDefined();
    expect(err).toBeInstanceOf(Errors.MoleculerServerError);
    expect(err!.message).toEqual("repository error");
  });
});
