import faker from "@faker-js/faker";
import { mocked } from "jest-mock";
import { BrokerOptions, Errors, ServiceBroker } from "moleculer";
import path from "path";
import { ServiceResponse } from "./Auth.Service";
import { User } from "./entity";
import {
  BadRequestError,
  BaseInternalError,
  ServiceErrorCode,
  ServiceErrorTypes,
  ValidationError
} from "./errors";
import { UserRepository } from "./repository";
import { JWT } from "./utils";

// mocks
jest.mock("./utils");
jest.mock("./repository");

const moleculerTestConfig = {
  logger: false,
  errorHandler: (err: Error, info: any) => {
    if (err instanceof Errors.ValidationError) {
      const e = new ValidationError(err.data[0].message);

      return {
        success: false,
        http_status_code: e.http_status_code,
        error: {
          error_code: e.internal_status_code,
          error_type: e.type,
          error_message: e.message
        }
      };
    }

    throw err;
  }
} as BrokerOptions;

const getFakeUser = (): User => {
  const user = new User();
  user.id = Math.floor(Math.random() * 1000 + 1);
  user.username = faker.name.firstName();
  user.email = faker.internet.email(user.username);
  user.password = faker.random.alphaNumeric(8);
  user.createdAt = new Date();
  user.updatedAt = new Date();
  return user;
};

describe("TEST auth-service", () => {
  const broker = new ServiceBroker(moleculerTestConfig);

  broker.loadService(path.join(__dirname, "Auth.Service.ts"));

  beforeAll(async () => {
    await broker.start();
  });

  afterAll(async () => {
    await broker.stop();
  });

  test("Action signUp - ok", async () => {
    const user = getFakeUser();
    mocked(UserRepository.prototype.saveNewUser).mockResolvedValueOnce(user);

    const response = (await broker.call("auth.signUp", {
      ...user,
      confirmPassword: user.password
    })) as ServiceResponse;

    expect(response).toBeDefined();
    expect(response.http_status_code).toEqual(201);
    expect(response.success).toEqual(true);
    expect(response.data).toBeDefined();
    expect(response.data!.user).toEqual(user);
  });

  test("Action signUp - missing parameter", async () => {
    const response = (await broker.call("auth.signUp", {
      username: "username" // other params missing
    })) as ServiceResponse;

    expect(response).toBeDefined();
    expect(response.http_status_code).toEqual(422);
    expect(response.success).toEqual(false);
    expect(response.error).toBeDefined();
    expect(response.error!.error_code).toEqual(ServiceErrorCode.VALIDATION_ERROR);
    expect(response.error!.error_type).toEqual(ServiceErrorTypes.VALIDATION_ERROR);
  });

  test("Action signUp - incorrect confirm password", async () => {
    const user = getFakeUser();

    const response = (await broker.call("auth.signUp", {
      ...user,
      confirmPassword: "wrong"
    })) as ServiceResponse;

    expect(response).toBeDefined();
    expect(response.http_status_code).toEqual(422);
    expect(response.success).toEqual(false);
    expect(response.error).toBeDefined();
    expect(response.error!.error_code).toEqual(ServiceErrorCode.VALIDATION_ERROR);
    expect(response.error!.error_type).toEqual(ServiceErrorTypes.VALIDATION_ERROR);
  });

  test("Action signUp - user already exists", async () => {
    const user = getFakeUser();
    mocked(UserRepository.prototype.saveNewUser).mockRejectedValueOnce(
      new BadRequestError("user already exists")
    );

    const response = (await broker.call("auth.signUp", {
      ...user,
      confirmPassword: user.password
    })) as ServiceResponse;

    expect(response).toBeDefined();
    expect(response.http_status_code).toEqual(400);
    expect(response.success).toEqual(false);
    expect(response.error).toBeDefined();
    expect(response.error!.error_code).toEqual(ServiceErrorCode.BAD_REQUEST_ERROR);
    expect(response.error!.error_type).toEqual(ServiceErrorTypes.BAD_REQUEST_ERROR);
  });

  test("Action signUp - repository error", async () => {
    const user = getFakeUser();
    mocked(UserRepository.prototype.saveNewUser).mockRejectedValueOnce(
      new BaseInternalError("repository error", "repository error")
    );

    let err: Error | undefined;
    try {
      await broker.call("auth.signUp", {
        ...user,
        confirmPassword: user.password
      });
    } catch (e) {
      err = e as Error;
    }
    console.log(err);
    expect(err).toBeDefined();
    expect(err!.message).toEqual("repository error");
  });

  test("Action login - ok", async () => {
    const user = getFakeUser();

    mocked(UserRepository.prototype.loginUser).mockResolvedValueOnce(user);
    mocked(JWT.prototype.signToken).mockResolvedValueOnce("sample_token");

    const response = (await broker.call("auth.login", { ...user })) as ServiceResponse;

    expect(response).toBeDefined();
    expect(response.http_status_code).toEqual(200);
    expect(response.success).toEqual(true);
    expect(response.data).toBeDefined();
    expect(response.data!.token).toEqual("sample_token");
  });

  test("Action login - missing parameter", async () => {
    const response = (await broker.call("auth.login", {
      username: "username" // other params missing
    })) as ServiceResponse;

    expect(response).toBeDefined();
    expect(response.http_status_code).toEqual(422);
    expect(response.success).toEqual(false);
    expect(response.error).toBeDefined();
    expect(response.error!.error_code).toEqual(ServiceErrorCode.VALIDATION_ERROR);
    expect(response.error!.error_type).toEqual(ServiceErrorTypes.VALIDATION_ERROR);
  });

  test("Action login - short password", async () => {
    const response = (await broker.call("auth.login", {
      username: "username",
      password: "short"
    })) as ServiceResponse;

    expect(response).toBeDefined();
    expect(response.http_status_code).toEqual(422);
    expect(response.success).toEqual(false);
    expect(response.error).toBeDefined();
    expect(response.error!.error_code).toEqual(ServiceErrorCode.VALIDATION_ERROR);
    expect(response.error!.error_type).toEqual(ServiceErrorTypes.VALIDATION_ERROR);
  });

  test("Action login - user not found", async () => {
    mocked(UserRepository.prototype.loginUser).mockResolvedValueOnce(undefined);

    const response = (await broker.call("auth.login", {
      username: "username",
      password: "password123"
    })) as ServiceResponse;

    expect(response).toBeDefined();
    expect(response.http_status_code).toEqual(400);
    expect(response.success).toEqual(false);
    expect(response.error).toBeDefined();
    expect(response.error!.error_code).toEqual(ServiceErrorCode.BAD_REQUEST_ERROR);
    expect(response.error!.error_type).toEqual(ServiceErrorTypes.BAD_REQUEST_ERROR);
  });

  test("Action login - incorrect password", async () => {});

  test("Action login - repository error", async () => {});

  test("Action login - token signing error", async () => {});

  test("Action getUser - ok", async () => {});

  test("Action getUser - invalid token", async () => {});

  test("Action getUser - repository error", async () => {});
});
