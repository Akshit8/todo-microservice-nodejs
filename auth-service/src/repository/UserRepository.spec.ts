import { Connection, createConnection } from "typeorm";
import { UserRepository } from "./UserRepository";
import ormconfig from "../../ormconfig";
import { User } from "../entity";

describe("Test UserRepository", () => {
  let connection: Connection;
  let userRepo: UserRepository;
  let testUser: User;
  // let testUser: User[];

  beforeAll(async () => {
    connection = await createConnection(ormconfig);

    userRepo = new UserRepository();

    testUser = await userRepo.saveNewUser("test", "test@mail.com", "testpswd");
  });

  afterAll(async () => {
    // TODO: delete all entities created
    await userRepo.remove(testUser);
    await userRepo.delete({ username: "akshit8231231" });

    await connection.close();
  });

  test("saveUser", async () => {
    const user = await userRepo.saveNewUser(
      "akshit8231231",
      "aksh123123it8@mail.com",
      "asdasd"
    );

    expect(user).toBeDefined();
    expect(user).toBeInstanceOf(User);
    expect(user.password).not.toEqual("asdasd");
  });

  test("loginUser", async () => {
    const user = await userRepo.loginUser(testUser.username, "testpswd");

    expect(user).toBeDefined();
    expect(user).toBeInstanceOf(User);
  });

  test("getUserById", async () => {
    const user = await userRepo.getUserById(testUser.id);

    expect(user).toBeDefined();
    expect(user).toBeInstanceOf(User);
  });
});
