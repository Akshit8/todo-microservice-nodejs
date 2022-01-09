import { Context, Service as MoleculerService } from "moleculer";
import { Action, Service } from "moleculer-decorators";

@Service({
  name: "auth"
})
class AuthService extends MoleculerService {
  @Action()
  test(ctx: Context): string {
    return "you have hit auth-service";
  }
}

export default AuthService;
