import { EntityRepository, QueryFailedError, Repository } from "typeorm";
import { User } from "../entity";
import { BadRequestError, ORMError, ResourceNotFoundError } from "../errors";
import { BcryptHasher, PasswordHasher } from "../utils";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  // any hasher that implements `PasswordHasher` can be injected here;
  private passwordHasher: PasswordHasher = new BcryptHasher();

  async saveNewUser(username: string, email: string, password: string): Promise<User> {
    const user = new User(username, email);
    user.password = await this.passwordHasher.hashPassword(password);

    let insertResult;
    try {
      insertResult = await this.insert(user);
    } catch (e) {
      // wrap custom error
      if (e instanceof QueryFailedError) {
        throw new BadRequestError("username or email already registered");
      } else if (e instanceof Error) {
        throw new ORMError(e.message);
      }
      throw new ORMError("unexpected orm error");
    }

    const { id, createdAt, updatedAt } = insertResult.generatedMaps[0] as User;
    user.id = id;
    user.createdAt = createdAt;
    user.updatedAt = updatedAt;

    return user;
  }

  private async getUser(query: { [key: string]: string | number }): Promise<User> {
    const user = await this.findOne(query);
    if (!user) {
      // wrap around custom error
      throw new ResourceNotFoundError("user not found");
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
