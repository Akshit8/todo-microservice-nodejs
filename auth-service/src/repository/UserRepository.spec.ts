import faker from "@faker-js/faker";
import { mocked } from "jest-mock";
import { Connection, createConnection } from "typeorm";
import { UserFactory } from "./UserFactory";
import { UserRepository } from "./UserRepository";
import ormconfig from "../../ormconfig";
import { User } from "../entity";
import {
  BadRequestError,
  InternalErrorTypes,
  PasswordHashingError,
  ResourceNotFoundError,
  ServiceErrorTypes
} from "../errors";
import { BcryptHasher } from "../utils";

jest.mock("../utils");

const getFakeUser = (): User => {
  const user = new User();
  user.username = faker.name.firstName();
  user.email = faker.internet.email(user.username);
  user.password = faker.random.alphaNumeric(8);
  return user;
};

describe("Test UserRepository", () => {
  let connection: Connection;
  let userRepo: UserRepository;
  let userFactory: UserFactory;

  beforeAll(async () => {
    connection = await createConnection(ormconfig);

    if (await connection.showMigrations()) {
      await connection.runMigrations();
    }

    userRepo = new UserRepository();
    userFactory = new UserFactory("testpswd");

    await userFactory.addModels(3);
  });

  afterAll(async () => {
    await userFactory.deleteModels();

    await connection.close();
  });

  test("saveNewUser - ok", async () => {
    const testUser = getFakeUser();

    mocked(BcryptHasher.prototype.hashPassword).mockResolvedValueOnce("hashedpswd");

    const user = await userRepo.saveNewUser(
      testUser.username,
      testUser.email,
      testUser.password
    );

    expect(user).toBeDefined();
    expect(user).toBeInstanceOf(User);
    expect(user.id).toBeDefined();
    expect(user.createdAt).toBeDefined();
    expect(user.updatedAt).toBeDefined();
    expect(user.password).toEqual("hashedpswd");
  });

  test("saveNewUser - hashing error", async () => {
    const testUser = getFakeUser();

    mocked(BcryptHasher.prototype.hashPassword).mockRejectedValueOnce(
      new PasswordHashingError("password hashing error")
    );

    let err: Error | undefined;
    try {
      await userRepo.saveNewUser(testUser.username, testUser.email, testUser.password);
    } catch (e) {
      err = e as Error;
    }

    expect(err).toBeDefined();
    expect(err).toBeInstanceOf(PasswordHashingError);
    expect(err!.name).toEqual(InternalErrorTypes.PASSWORD_HASHING_ERROR);
    expect(err!.message).toEqual("password hashing error");
  });

  test("saveNewUser - duplicate user", async () => {
    let err: Error | undefined;
    try {
      await userRepo.saveNewUser(
        userFactory.models[0].username,
        userFactory.models[0].email,
        userFactory.models[0].password
      );
    } catch (e) {
      err = e as Error;
    }

    expect(err).toBeDefined();
    expect(err).toBeInstanceOf(BadRequestError);
    expect(err!.name).toEqual(ServiceErrorTypes.BAD_REQUEST_ERROR);
  });

  test("loginUser - ok", async () => {
    const testUser = userFactory.models[0];

    mocked(BcryptHasher.prototype.checkPassword).mockResolvedValueOnce(true);

    const user = await userRepo.loginUser(testUser.username, testUser.password);

    expect(user).toBeDefined();
    expect(user).toBeInstanceOf(User);
    expect(user!.id).toEqual(testUser.id);
  });

  test("loginUser - user not found", async () => {
    let err: Error | undefined;
    try {
      await userRepo.loginUser("user", "randompswd");
    } catch (e) {
      err = e as Error;
    }

    expect(err).toBeDefined();
    expect(err).toBeInstanceOf(ResourceNotFoundError);
    expect(err!.name).toEqual(ServiceErrorTypes.RESOURCE_NOT_FOUND_ERROR);
  });

  test("loginUser - password mismatch", async () => {
    const testUser = userFactory.models[0];

    mocked(BcryptHasher.prototype.checkPassword).mockResolvedValueOnce(false);

    const user = await userRepo.loginUser(testUser.username, "randompswd");

    expect(user).toBeUndefined();
  });

  test("loginUser - password checking error", async () => {
    const testUser = userFactory.models[0];

    mocked(BcryptHasher.prototype.checkPassword).mockRejectedValueOnce(
      new PasswordHashingError("password hashing error")
    );

    let err: Error | undefined;
    try {
      await userRepo.loginUser(testUser.username, "randompswd");
    } catch (e) {
      err = e as Error;
    }

    expect(err).toBeDefined();
    expect(err).toBeInstanceOf(PasswordHashingError);
    expect(err!.name).toEqual(InternalErrorTypes.PASSWORD_HASHING_ERROR);
    expect(err!.message).toEqual("password hashing error");
  });

  test("getUserById - ok", async () => {
    const testUser = userFactory.models[0];

    const user = await userRepo.getUserById(testUser.id);

    expect(user).toBeDefined();
    expect(user).toBeInstanceOf(User);
    expect(user!.id).toEqual(testUser.id);
  });

  test("getUserById - user not found", async () => {
    let err: Error | undefined;
    try {
      await userRepo.getUserById(-1);
    } catch (e) {
      err = e as Error;
    }

    expect(err).toBeDefined();
    expect(err).toBeInstanceOf(ResourceNotFoundError);
    expect(err!.name).toEqual(ServiceErrorTypes.RESOURCE_NOT_FOUND_ERROR);
  });
});
