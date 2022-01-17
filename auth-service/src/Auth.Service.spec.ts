import { ServiceBroker } from "moleculer";
import path from "path";

describe("TEST auth", () => {
  const broker = new ServiceBroker({ logger: false });

  broker.loadService(path.join(__dirname, "Auth.Service.ts"));

  beforeAll(async () => {
    await broker.start();
  });

  beforeEach(async () => {});

  afterAll(async () => {
    await broker.stop();
  });

  test("sample", async () => {
    const res: any = await broker.call("auth.signUp", {
      username: "asdsdf",
      email: "asdadasd@mail.com",
      password: "asdasds",
      confirmPassword: "asdasds"
    });

    expect(res).toBeDefined();
    expect(res.http_status_code).toEqual(201);
  });
});
