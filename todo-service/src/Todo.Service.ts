import {
  Context,
  Errors,
  LoggerInstance,
  Service as MoleculerService
} from "moleculer";
import { Action, Method, Service } from "moleculer-decorators";
import { Todo } from "./entity";
import { BaseInternalError, BaseServiceError } from "./errors";
import { TodoRepository } from "./repository";
import { AuthToken, DBConnectionManager, JWT } from "./utils";

export interface ServiceError {
  error_code: string;
  error_type: string;
  error_message: string;
}

export type ServiceData = { [key: string]: number | string | Todo | Todo[] };

export interface ServiceResponse {
  success: boolean;
  http_status_code: number;
  error?: ServiceError;
  data?: ServiceData;
}

interface ActionResponse {
  http_status_code: number;
  todo?: Todo;
  todos?: Todo[];
}

@Service({
  name: "todo",
  hooks: {
    before: {
      "*": ["authMiddleware"]
    },
    error: {
      "*": ["errorHandler"]
    },
    after: {
      "*": ["cleanResponse", "renderServiceResponse"]
    }
  }
})
class TodoService extends MoleculerService {
  public logger: LoggerInstance;
  private dbConnectionManager: DBConnectionManager;
  private todoRepo: TodoRepository;
  private authToken: AuthToken;

  // called always when broker is started
  async started() {
    this.logger = this.broker.logger;

    this.dbConnectionManager = new DBConnectionManager(this.logger);
    await this.dbConnectionManager.connect();

    this.todoRepo = new TodoRepository();
    this.authToken = new JWT("secret");
  }

  // called always when broker is stopped
  async stopped() {
    await this.dbConnectionManager.close();
  }

  @Method
  async authMiddleware(ctx: Context<{ token: string; owner?: number }>): Promise<void> {
    const tokenPayload = await this.authToken.verifyToken(ctx.params.token);
    ctx.params.owner = Number(tokenPayload.id);
  }

  @Method
  cleanResponse(ctx: Context, res: ActionResponse): ActionResponse {
    return res;
  }

  @Method
  renderServiceResponse(ctx: Context, res: ActionResponse): ServiceResponse {
    const data = { ...res } as ServiceData;
    // @ts-ignore
    delete data.http_status_code;

    return {
      success: true,
      http_status_code: res.http_status_code,
      data
    };
  }

  @Method
  errorHandler(
    ctx: Context,
    err: Error | BaseInternalError | BaseServiceError | Errors.MoleculerError
  ): ServiceResponse {
    if (err instanceof BaseInternalError || err instanceof Errors.MoleculerError) {
      this.logger.error(err);
      if (err instanceof BaseInternalError) {
        err = new Errors.MoleculerServerError(err.message);
      }

      // since rpc call, throw err
      throw err;
    }

    return this.renderServiceError(ctx, err as BaseServiceError);
  }

  @Method
  renderServiceError(ctx: Context, err: BaseServiceError): ServiceResponse {
    return {
      success: false,
      http_status_code: err.http_status_code,
      error: {
        error_code: err.internal_status_code,
        error_type: err.type,
        error_message: err.message
      }
    };
  }

  @Action({
    params: {
      actionItem: { type: "string" }
    }
  })
  async createTodo({
    params
  }: Context<{ actionItem: string; owner: number }>): Promise<ActionResponse> {
    const todo = await this.todoRepo.addNewTodo(params.actionItem, params.owner);
    return { http_status_code: 201, todo };
  }

  @Action({
    params: {
      id: { type: "number" }
    }
  })
  async getTodo({
    params
  }: Context<{ id: number; owner: number }>): Promise<ActionResponse> {
    const todo = await this.todoRepo.getTodoById(params.id, params.owner);
    return { http_status_code: 200, todo };
  }

  @Action()
  async getAllTodos({ params }: Context<{ owner: number }>): Promise<ActionResponse> {
    const todos = await this.todoRepo.getAllTodos(params.owner);
    return { http_status_code: 200, todos };
  }

  @Action({
    params: {
      id: { type: "number" },
      actionItem: { type: "string", nullable: true },
      completed: { type: "boolean", nullable: true }
    }
  })
  async updateTodo({
    params
  }: Context<{
    id: number;
    owner: number;
    actionItem?: string;
    completed?: boolean;
  }>): Promise<ActionResponse> {
    const todo = await this.todoRepo.updateTodo(params.id, params.owner, {
      actionItem: params.actionItem,
      completed: params.completed
    });
    return { http_status_code: 200, todo };
  }

  @Action({
    params: {
      id: { type: "number" }
    }
  })
  async deleteTodo({
    params
  }: Context<{ id: number; owner: number }>): Promise<ActionResponse> {
    await this.todoRepo.deleteTodo(params.id, params.owner);
    return { http_status_code: 200 };
  }
}

export default TodoService;
