import { Errors } from "moleculer";
import { EntityRepository, Repository } from "typeorm";
import { User } from "../entity";
import { BcryptHasher, PasswordHasher } from "../utils";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  // any hasher that implements `PasswordHasher` can be injected here;
  private passwordHasher: PasswordHasher = new BcryptHasher();

  async saveNewUser(username: string, email: string, password: string): Promise<User> {
    const user = new User(username, email);
    user.password = await this.passwordHasher.hashPassword(password);

    const insertResult = await this.insert(user);

    const { id, createdAt, updatedAt } = insertResult.generatedMaps[0] as User;
    user.id = id;
    user.createdAt = createdAt;
    user.updatedAt = updatedAt;

    return user;
  }

  private async getUser(query: { [key: string]: string | number }): Promise<User> {
    const user = await this.findOne(query);
    if (!user) {
      // throw new Error("user not found");
      throw new Errors.ValidationError("user not found");
    }

    return user;
  }

  async loginUser(username: string, password: string): Promise<User | undefined> {
    const user = await this.getUser({ username });
    const isPasswordCorrect = await this.passwordHasher.checkPassword(
      password,
      user.password
    );
    if (isPasswordCorrect) {
      return user;
    }
    return undefined;
  }

  async getUserById(id: number): Promise<User> {
    return this.getUser({ id });
  }
}
