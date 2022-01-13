import { Context, Service as MoleculerService } from "moleculer";
import { Action, Service } from "moleculer-decorators";
import { Connection, createConnection } from "typeorm";
import { UserRepository } from "./repository";
import { AuthToken, JWT } from "./utils";

@Service({
  name: "auth"
})
class AuthService extends MoleculerService {
  private dbConnection: Connection;
  private userRepo: UserRepository;
  private authToken: AuthToken;

  async started() {
    this.dbConnection = await createConnection();

    this.userRepo = this.dbConnection.getCustomRepository(UserRepository);

    this.authToken = new JWT("asd", "asd");
  }

  async stoped() {
    this.dbConnection.close();
  }

  @Action()
  async signUp({
    params
  }: Context<{ username: string; email: string; password: string }>) {
    const user = await this.userRepo.saveNewUser(
      params.username,
      params.email,
      params.password
    );
    return user;
  }

  @Action()
  async login({ params }: Context<{ username: string; password: string }>) {
    const user = await this.userRepo.getUserByName(params.username);
    return user;
  }

  @Action()
  getUser(ctx: Context) {}
}

export default AuthService;
