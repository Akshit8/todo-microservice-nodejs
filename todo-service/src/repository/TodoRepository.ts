import { Repository, TypeORMError } from "typeorm";
import { Todo } from "../entity";
import { ORMError, ResourceNotFoundError } from "../errors";

export class TodoRepository extends Repository<Todo> {
  async addNewTodo(actionItem: string, owner: number): Promise<Todo> {
    let todo = new Todo(actionItem, owner);

    try {
      todo = await this.save(todo);
    } catch (err) {
      if (err instanceof TypeORMError) {
        throw new ORMError(err.message);
      }
      throw new ORMError("unknown error occured while saving todo");
    }

    return todo;
  }

  async getTodoById(id: number, owner: number): Promise<Todo> {
    let todo: Todo | undefined;
    try {
      todo = await this.findOne({ id, owner });
    } catch (err) {
      if (err instanceof TypeORMError) {
        throw new ORMError(err.message);
      }
      throw new ORMError("unknown error occured while getting todo");
    }

    if (!todo) {
      throw new ResourceNotFoundError("todo not found");
    }

    return todo;
  }

  async getAllTodos(owner: number): Promise<Todo[]> {
    let todos: Todo[];
    try {
      todos = await this.find({ owner });
    } catch (err) {
      if (err instanceof TypeORMError) {
        throw new ORMError(err.message);
      }
      throw new ORMError("unknown error occured while fetching todos");
    }

    return todos;
  }

  async updateTodo(
    id: number,
    owner: number,
    updates: { actionItem?: string; complete?: boolean }
  ): Promise<Todo> {
    let todo = await this.getTodoById(id, owner);

    todo.action_item = updates.actionItem || todo.action_item;
    todo.completed = updates.complete || todo.completed;

    try {
      todo = await this.save(todo);
    } catch (err) {
      if (err instanceof TypeORMError) {
        throw new ORMError(err.message);
      }
      throw new ORMError("unknown error occured while saving todo");
    }

    return todo;
  }

  async deleteTodo(id: number, owner: number): Promise<void> {
    try {
      await this.delete({ id, owner });
    } catch (err) {
      if (err instanceof TypeORMError) {
        throw new ORMError(err.message);
      }
      throw new ORMError("unknown error occured while deleting todos");
    }
  }
}
