import { ServiceBroker } from "moleculer";
import { mocked } from "ts-jest/utils";
import { getCustomRepository } from "typeorm";
import path from "path";
import { User } from "./entity";

jest.mock("typeorm");

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

    const userRepo = {
      saveNewUser: jest.fn().mockResolvedValueOnce(user)
    };

    // mocked(createConnection).mockReturnValueOnce();
    mocked(getCustomRepository).mockReturnValueOnce(userRepo);

    const res: any = await broker.call("auth.signUp", {
      username: "asdsdf",
      email: "asdadasd@mail.com",
      password: "asdasds",
      confirmPassword: "asdasds"
    });

    expect(getCustomRepository).toHaveBeenCalledTimes(1);
    expect(getCustomRepository).toBeCalledWith(userRepo);

    expect(userRepo.saveNewUser).toBeCalledTimes(1);

    expect(res).toBeDefined();
    expect(res.http_status_code).toEqual(201);
  });
});
