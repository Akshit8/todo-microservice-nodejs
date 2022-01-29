import { BcryptHasher, PasswordHasher } from "./Hasher";

describe("TEST BcryptHasher implementation", () => {
  let passwordHasher: PasswordHasher;
  let testHash: string;

  beforeAll(async () => {
    passwordHasher = new BcryptHasher();

    testHash = await passwordHasher.hashPassword("testpswd");
  });

  test("hashPassword - ok", async () => {
    const hashedPassword = await passwordHasher.hashPassword("pswd");

    expect(hashedPassword).toBeDefined();
  });

  test("checkPassword - ok", async () => {
    const check = await passwordHasher.checkPassword("testpswd", testHash);

    expect(check).toBeDefined();
    expect(check).toEqual(true);
  });
});
