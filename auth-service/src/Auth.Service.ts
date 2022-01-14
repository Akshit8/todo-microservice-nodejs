import { Context, LoggerInstance, Service as MoleculerService } from "moleculer";
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
  public logger: LoggerInstance;

  // called always when broker is started
  async started() {
    this.dbConnection = await createConnection();

    this.userRepo = this.dbConnection.getCustomRepository(UserRepository);

    this.authToken = new JWT("asdz", "1h");

    this.logger = this.broker.logger;
  }

  // called always when broker is stopped
  async stopped() {
    if (this.dbConnection) {
      await this.dbConnection.close();
    }
  }

  @Action({
    params: {
      username: { type: "string" },
      email: { type: "email" },
      password: { type: "string", min: 6 }
    }
  })
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

  @Action({
    params: {
      username: { type: "string" },
      password: { type: "string", min: 6 }
    }
  })
  async login({ params }: Context<{ username: string; password: string }>) {
    const user = await this.userRepo.loginUser(params.username, params.password);
    if (!user) {
      throw new Error("invalid login");
    }
    const token = await this.authToken.signToken({ id: user.id });
    return token;
  }

  @Action({
    params: {
      id: { type: "number", integer: true, positive: true }
    }
  })
  async getUser({ params }: Context<{ id: number }>) {
    const user = await this.userRepo.getUserById(params.id);
    return user;
  }
}

export default AuthService;
