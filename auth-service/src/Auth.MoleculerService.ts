import { Context, Service as MoleculerService } from "moleculer";
import { Action, Service } from "moleculer-decorators";
import { createConnection } from "typeorm";
import { User } from "./entity";

@Service({
  name: "auth"
})
class AuthService extends MoleculerService {
  async started() {
    const connection = await createConnection();

    const repo = connection.getRepository(User);

    const user = new User();

    user.email = "admin@mail.com";
    user.username = "adminn";
    user.password = "admin";

    await repo.save(user);
  }

  async stoped() {}

  @Action()
  signUp(ctx: Context) {}

  @Action()
  login(ctx: Context) {}

  @Action()
  getUser(ctx: Context) {}
}

export default AuthService;
