import {
  Context,
  Errors,
  LoggerInstance,
  Service as MoleculerService
} from "moleculer";
import { Action, Method, Service } from "moleculer-decorators";
import { User } from "./entity";
import {
  BadRequestError,
  BaseInternalError,
  BaseServiceError,
  ValidationError
} from "./errors";
import { UserRepository } from "./repository";
import { AuthToken, DBConnectionManager, JWT } from "./utils";

export interface ServiceError {
  error_code: string;
  error_type: string;
  error_message: string;
}

type ServiceData = { [key: string]: number | string | User };

export interface ServiceResponse {
  success: boolean;
  http_status_code: number;
  error?: ServiceError;
  data?: ServiceData;
}

interface ActionResponse {
  http_status_code: number;
  user?: User;
  token?: string;
}

@Service({
  name: "auth",
  hooks: {
    before: {
      getUser: "authMiddleware"
    },
    error: {
      "*": "errorHandler"
    },
    after: {
      "*": ["cleanResponse", "renderServiceResponse"]
    }
  }
})
class AuthService extends MoleculerService {
  public logger: LoggerInstance;
  private dbConnectionManager: DBConnectionManager;
  private userRepo: UserRepository;
  private authToken: AuthToken;

  // called always when broker is started
  async started() {
    this.logger = this.broker.logger;

    this.dbConnectionManager = new DBConnectionManager(this.logger);
    await this.dbConnectionManager.connect();

    this.userRepo = new UserRepository();
    this.authToken = new JWT("secret", "24h");
  }

  // called always when broker is stopped
  async stopped() {
    await this.dbConnectionManager.close();
  }

  @Method
  async authMiddleware(ctx: Context<{ token: string; id: number }>): Promise<void> {
    const tokenPayload = await this.authToken.verifyToken(ctx.params.token);
    ctx.params.id = Number(tokenPayload.id);
  }

  @Method
  cleanResponse(ctx: Context, res: ActionResponse): ActionResponse {
    if (res.user) {
      // @ts-ignore
      delete res.user.password;
    }

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
      username: { type: "string" },
      email: { type: "email" },
      password: { type: "string", min: 6 },
      confirmPassword: { type: "string", min: 6 }
    }
  })
  async signUp({
    params
  }: Context<{
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  }>): Promise<ActionResponse> {
    if (params.password !== params.confirmPassword) {
      throw new ValidationError("confirmation password invalid");
    }

    const user = await this.userRepo.saveNewUser(
      params.username,
      params.email,
      params.password
    );
    return { http_status_code: 201, user };
  }

  @Action({
    params: {
      username: { type: "string" },
      password: { type: "string", min: 6 }
    }
  })
  async login({
    params
  }: Context<{ username: string; password: string }>): Promise<ActionResponse> {
    const user = await this.userRepo.loginUser(params.username, params.password);
    if (!user) {
      throw new BadRequestError("invalid username or password");
    }
    const token = await this.authToken.signToken({ id: user.id });
    return { http_status_code: 200, token };
  }

  @Action()
  async getUser({ params }: Context<{ id: number }>): Promise<ActionResponse> {
    const user = await this.userRepo.getUserById(params.id);
    return { http_status_code: 200, user };
  }
}

export default AuthService;
