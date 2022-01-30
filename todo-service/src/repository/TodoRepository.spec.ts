import faker from "@faker-js/faker";
import { Connection, createConnection } from "typeorm";
import { TodoFactory } from "./TodoFactory";
import ormconfig from "../../ormconfig";
import { Todo } from "../entity";
import { ResourceNotFoundError, ServiceErrorTypes } from "../errors";
import { TodoRepository } from ".";

const getFakeTodo = (): Todo => {
  const todo = new Todo();
  todo.owner = Math.floor(Math.random() * 100 + 1);
  todo.action_item = faker.lorem.sentence();
  return todo;
};

describe("Test UserRepository", () => {
  let connection: Connection;
  let todoRepo: TodoRepository;
  let todoFactory: TodoFactory;

  beforeAll(async () => {
    connection = await createConnection(ormconfig);

    if (await connection.showMigrations()) {
      await connection.runMigrations();
    }

    todoRepo = new TodoRepository();
    todoFactory = new TodoFactory();

    await todoFactory.addModels(3);
  });

  afterAll(async () => {
    await todoFactory.deleteModels();

    await connection.close();
  });

  test("addNewTodo - ok", async () => {
    const testTodo = getFakeTodo();

    const todo = await todoRepo.addNewTodo(testTodo.action_item, testTodo.owner);

    expect(todo).toBeDefined();
    expect(todo.id).toBeDefined();
    expect(todo.action_item).toEqual(testTodo.action_item);
    expect(todo.owner).toEqual(testTodo.owner);
    expect(todo.createdAt).toBeDefined();
    expect(todo.updatedAt).toBeDefined();
  });

  test("getTodoById - ok", async () => {
    const testTodo = todoFactory.models[0];

    const todo = await todoRepo.getTodoById(testTodo.id, testTodo.owner);

    expect(todo).toBeDefined();
    expect(todo).toEqual(testTodo);
  });

  test("getTodoById - not found", async () => {
    let err: Error | undefined;
    try {
      await todoRepo.getTodoById(
        Math.floor(Math.random() * 100 + 1),
        Math.floor(Math.random() * 100 + 1)
      );
    } catch (e) {
      err = e as Error;
    }

    expect(err).toBeDefined();
    expect(err).toBeInstanceOf(ResourceNotFoundError);
    expect(err!.name).toEqual(ServiceErrorTypes.RESOURCE_NOT_FOUND_ERROR);
  });

  test("getAllTodos - 3 todos found", async () => {
    const tf = new TodoFactory(108);

    await tf.addModels(3);

    const todos = await todoRepo.getAllTodos(108);

    expect(todos).toBeDefined();
    expect(todos).toHaveLength(tf.models.length);
    expect(todos[0].owner).toEqual(108);

    await tf.deleteModels();
  });

  test("getAllTodos - no todos found", async () => {
    const todos = await todoRepo.getAllTodos(108);

    expect(todos).toBeDefined();
    expect(todos).toHaveLength(0);
  });

  test("updateTodo - ok", async () => {
    const testTodo = todoFactory.models[0];

    const todo = await todoRepo.updateTodo(testTodo.id, testTodo.owner, {
      actionItem: "new action item",
      completed: true
    });

    expect(todo).toBeDefined();
    expect(todo.id).toEqual(testTodo.id);
    expect(todo.action_item).toEqual("new action item");
    expect(todo.owner).toEqual(testTodo.owner);
    expect(todo.action_item).not.toEqual(testTodo.action_item);
    expect(todo.completed).not.toEqual(testTodo.completed);
  });

  test("updateTodo - ok(update action_item only)", async () => {
    const testTodo = todoFactory.models[1];

    const todo = await todoRepo.updateTodo(testTodo.id, testTodo.owner, {
      actionItem: "new action item"
    });

    expect(todo).toBeDefined();
    expect(todo.id).toEqual(testTodo.id);
    expect(todo.action_item).toEqual("new action item");
    expect(todo.owner).toEqual(testTodo.owner);
    expect(todo.action_item).not.toEqual(testTodo.action_item);
  });

  test("updateTodo - ok(update completed only)", async () => {
    const testTodo = todoFactory.models[2];

    const todo = await todoRepo.updateTodo(testTodo.id, testTodo.owner, {
      completed: true
    });

    expect(todo).toBeDefined();
    expect(todo.id).toEqual(testTodo.id);
    expect(todo.action_item).toEqual(testTodo.action_item);
    expect(todo.owner).toEqual(testTodo.owner);
    expect(todo.completed).not.toEqual(testTodo.completed);
  });

  test("updateTodo - not found", async () => {
    let err: Error | undefined;
    try {
      await todoRepo.updateTodo(
        Math.floor(Math.random() * 100 + 1),
        Math.floor(Math.random() * 100 + 1),
        {
          actionItem: "new action item"
        }
      );
    } catch (e) {
      err = e as Error;
    }

    expect(err).toBeDefined();
    expect(err).toBeInstanceOf(ResourceNotFoundError);
    expect(err!.name).toEqual(ServiceErrorTypes.RESOURCE_NOT_FOUND_ERROR);
  });

  test("deleteTodo - ok", async () => {
    const testTodo = todoFactory.models[0];

    todoFactory.models = todoFactory.models.slice(1);

    await todoRepo.deleteTodo(testTodo.id, testTodo.owner);

    let err: Error | undefined;
    try {
      await todoRepo.getTodoById(testTodo.id, testTodo.owner);
    } catch (e) {
      err = e as Error;
    }
    expect(err).toBeDefined();
    expect(err).toBeInstanceOf(ResourceNotFoundError);
    expect(err!.name).toEqual(ServiceErrorTypes.RESOURCE_NOT_FOUND_ERROR);
  });
});
