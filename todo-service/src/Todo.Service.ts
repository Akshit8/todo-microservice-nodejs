import {
  Context,
  Errors,
  LoggerInstance,
  Service as MoleculerService
} from "moleculer";
import { Action, Method, Service } from "moleculer-decorators";
import { Connection, createConnection } from "typeorm";
import { Todo } from "./entity";
import { BaseInternalError, BaseServiceError, ValidationError } from "./errors";
import { TodoRepository } from "./repository";
import { AuthToken, JWT } from "./utils";

interface ServiceError {
  error_code: string;
  error_type: string;
  error_message: string;
}

type ServiceData = string | number | Object;

interface ServiceResponse {
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
  private dbConnection: Connection;
  private todoRepo: TodoRepository;
  private authToken: AuthToken;
  public logger: LoggerInstance;

  async started() {
    this.dbConnection = await createConnection();
    this.todoRepo = this.dbConnection.getCustomRepository(TodoRepository);
    this.authToken = new JWT("secret");
    this.logger = this.broker.logger;
  }

  async stopped() {
    if (this.dbConnection) {
      await this.dbConnection.close();
    }
  }

  @Method
  async authMiddleware(ctx: Context<{ token: string; id: number }>): Promise<void> {
    const tokenPayload = await this.authToken.verifyToken(ctx.params.token);
    ctx.params.id = Number(tokenPayload.id);
  }

  @Method
  cleanResponse(ctx: Context, res: ActionResponse): ActionResponse {
    return res;
  }

  @Method
  renderServiceResponse(ctx: Context, res: ActionResponse): ServiceResponse {
    return {
      success: true,
      ...res
    };
  }

  @Method
  errorHandler(
    ctx: Context,
    err: Error | BaseInternalError | BaseServiceError | Errors.MoleculerError
  ): ServiceResponse {
    if (err instanceof Errors.ValidationError) {
      err = new ValidationError();
    }

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

  @Action()
  async addTodo({ params }: Context<{}>): Promise<ActionResponse> {
    return { http_status_code: 200 };
  }

  @Action()
  async getTodo({ params }: Context<{}>): Promise<ActionResponse> {
    return { http_status_code: 200 };
  }

  @Action()
  async getAllTodos({ params }: Context<{}>): Promise<ActionResponse> {
    return { http_status_code: 200 };
  }

  @Action()
  async updateTodo({ params }: Context<{}>): Promise<ActionResponse> {
    return { http_status_code: 200 };
  }

  @Action()
  async deleteTodo({ params }: Context<{}>): Promise<ActionResponse> {
    return { http_status_code: 200 };
  }
}

export default TodoService;
