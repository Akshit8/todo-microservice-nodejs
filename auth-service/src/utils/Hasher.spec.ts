import { BcryptHasher, PasswordHasher } from "./Hasher";

describe("TEST BcryptHasher implementation", () => {
  let passwordHasher: PasswordHasher;
  let testHash: string;

  beforeAll(async () => {
    passwordHasher = new BcryptHasher();

    testHash = await passwordHasher.hashPassword("asd");
  });

  test("hashPassword", async () => {
    const hashedPassword = await passwordHasher.hashPassword("pswd");

    expect(hashedPassword).toBeDefined();
  });

  test("checkPassword", async () => {
    const check = await passwordHasher.checkPassword("asd", testHash);

    expect(check).toBeDefined();
    expect(check).toEqual(true);
  });
});
