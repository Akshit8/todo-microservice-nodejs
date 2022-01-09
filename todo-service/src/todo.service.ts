import { Context, Service as MoleculerService } from "moleculer";
import { Action, Service } from "moleculer-decorators";

@Service({
  name: "todo-service"
})
class TodoService extends MoleculerService {
  @Action()
  test(ctx: Context) {
    return "you have hit todo service";
  }
}

export default TodoService;
