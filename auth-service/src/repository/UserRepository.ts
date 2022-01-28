import { getRepository, QueryFailedError, Repository, TypeORMError } from "typeorm";
import { User } from "../entity";
import { BadRequestError, ORMError, ResourceNotFoundError } from "../errors";
import { BcryptHasher, PasswordHasher } from "../utils";

// Using composition instead of inheritance
// gives abstraction to decouple the code while testing other layers
// without mocking the typeorm
export class UserRepository {
  // any hasher that implements `PasswordHasher` can be injected here;
  private passwordHasher: PasswordHasher;
  private repo: Repository<User>;

  constructor() {
    this.passwordHasher = new BcryptHasher();
    this.repo = getRepository(User);
  }

  async saveNewUser(username: string, email: string, password: string): Promise<User> {
    const user = new User(username, email);
    user.password = await this.passwordHasher.hashPassword(password);

    let insertResult;
    try {
      insertResult = await this.repo.insert(user);
    } catch (e) {
      // wrap custom error
      // TODO: check if EntityNotFoundError is thrown
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
    let user: User | undefined;
    try {
      user = await this.repo.findOne(query);
    } catch (err) {
      if (err instanceof TypeORMError) {
        throw new ORMError(err.message);
      }
      throw new ORMError("unknown error occured while getting user");
    }

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
