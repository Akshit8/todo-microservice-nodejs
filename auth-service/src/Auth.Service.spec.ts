import { ServiceBroker } from "moleculer";
import { getCustomRepository } from "typeorm";
import path from "path";
import { User } from "./entity";

jest.mock("typeorm", () => {
  return {
    ...jest.requireActual("typeorm")
  };
});

const mockedGetCustomRepository = getCustomRepository as jest.Mock<
  typeof getCustomRepository
>;

describe("TEST auth", () => {
  const broker = new ServiceBroker({ logger: false });

  broker.loadService(path.join(__dirname, "Auth.Service.ts"));

  beforeAll(async () => {
    await broker.start();
  });

  afterAll(async () => {
    await broker.stop();
  });

  test("sample", async () => {
    const user = new User();
    user.id = 1;
    user.username = "asd";
    user.email = "asdsda";
    user.password = "asdsd";
    user.createdAt = new Date();
    user.updatedAt = new Date();

    const userRepo: any = {
      saveNewUser: jest.fn().mockResolvedValue(user)
    };

    mockedGetCustomRepository.mockReturnValueOnce(userRepo);

    const res: any = await broker.call("auth.signUp", {
      username: "asdsdf",
      email: "asdadasd@mail.com",
      password: "asdasds",
      confirmPassword: "asdasds"
    });

    console.log("res:", res);
  });
});
