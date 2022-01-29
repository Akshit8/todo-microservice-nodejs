import faker from "@faker-js/faker";
import { getRepository } from "typeorm";
import { DatabaseFactory } from "./DatabaseFactory";
import { User } from "../entity";

export class UserFactory extends DatabaseFactory<User> {
  private testPswd: string;

  constructor(testPswd: string) {
    super(getRepository(User));
    this.testPswd = testPswd;
  }

  async getModel(): Promise<User> {
    const user = new User();

    const firstName = faker.name.firstName();
    user.username = `${firstName}${faker.datatype.number()}`;
    user.email = `${faker.internet.email(firstName)}`;
    user.password = this.testPswd;

    return user;
  }
}
