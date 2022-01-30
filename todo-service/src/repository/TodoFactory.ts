import faker from "@faker-js/faker";
import { getRepository } from "typeorm";
import { DatabaseFactory } from "./DatabaseFactory";
import { Todo } from "../entity";

export class TodoFactory extends DatabaseFactory<Todo> {
  owner: number | undefined;

  constructor(owner?: number) {
    super(getRepository(Todo));
    this.owner = owner;
  }

  async getModel(): Promise<Todo> {
    const todo = new Todo();

    todo.owner = this.owner || Math.floor(Math.random() * 100 + 1);
    todo.action_item = faker.lorem.sentence();

    return todo;
  }
}
