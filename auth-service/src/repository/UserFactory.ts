import faker from "@faker-js/faker";
import { DatabaseFactory } from "./DatabaseFactory";
import { User } from "../entity";
import { BcryptHasher, PasswordHasher } from "../utils";
import { UserRepository } from ".";

export class UserFactory extends DatabaseFactory<User, UserRepository> {
  private passwordHasher: PasswordHasher;
  public testPswd: string;

  constructor(userRepositoy: UserRepository, testPswd: string) {
    super(userRepositoy);
    this.passwordHasher = new BcryptHasher();
    this.testPswd = testPswd;
  }

  async getModel(): Promise<User> {
    const user = new User();

    const firstName = faker.name.firstName();
    user.username = `${firstName}${faker.datatype.number()}`;
    user.email = `${faker.internet.email(firstName)}`;
    user.password = await this.passwordHasher.hashPassword(this.testPswd);

    return user;
  }
}
