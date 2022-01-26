import faker from "@faker-js/faker";
import { mocked } from "jest-mock";
import { BrokerOptions, Errors, ServiceBroker } from "moleculer";
import path from "path";
import { ServiceResponse } from "./Auth.Service";
import { User } from "./entity";
import { ValidationError } from "./errors";
import { UserRepository } from "./repository";

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

  test("signUp - ok", async () => {
    const user = getFakeUser();
    mocked(UserRepository.prototype.saveNewUser).mockResolvedValueOnce(user);

    const response = (await broker.call("auth.signUp", {
      ...user,
      confirmPassword: user.password
    })) as ServiceResponse;

    console.log(response);

    expect(response).toBeDefined();
    expect(response.http_status_code).toEqual(201);
    expect(response.success).toEqual(true);
    expect(response.data).toBeDefined();
    expect(response.data!.user).toEqual(user);
  });
});
