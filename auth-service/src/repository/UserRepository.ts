import { EntityRepository, Repository } from "typeorm";
import { User } from "../entity";
import { BcryptHasher, PasswordHasher } from "../utils";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  constructor(private passwordHasher: PasswordHasher) {
    super();
    passwordHasher = new BcryptHasher();
  }

  async saveNewUser(username: string, email: string, password: string): Promise<User> {
    const user = new User(username, email);
    user.password = await this.passwordHasher.hashPassword(password);

    // use this.insert()
    await this.save(user);

    return user;
  }

  async getUserByName(username: string): Promise<User> {
    const user = await this.findOne({ username });
    if (!user) {
      throw new Error("user not found");
    }

    return user;
  }
}
