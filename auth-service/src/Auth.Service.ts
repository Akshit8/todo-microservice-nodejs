import { Context, Service as MoleculerService } from "moleculer";
import { Action, Service } from "moleculer-decorators";
import { createConnection } from "typeorm";
import { UserRepository } from "./repository";

@Service({
  name: "auth"
})
class AuthService extends MoleculerService {
  private userRepo: UserRepository;

  async started() {
    const connection = await createConnection();

    this.userRepo = connection.getCustomRepository(UserRepository);
  }

  async stoped() {}

  @Action()
  signUp({ params }: Context<{ username: string; email: string; password: string }>) {}

  @Action()
  login(ctx: Context) {}

  @Action()
  getUser(ctx: Context) {}
}

export default AuthService;
