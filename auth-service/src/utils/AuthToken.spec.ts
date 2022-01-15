import { JWT } from "./AuthToken";

describe("TEST JWT implementation", () => {
  const authToken = new JWT("asd", "24h");

  let testToken: string;
  beforeAll(async () => {
    testToken = await authToken.signToken({ id: 1 });
  });

  test("JWT signToken", async () => {
    const token = await authToken.signToken({ id: 1 });
    expect(token).toBeDefined();
    expect(token).toEqual(testToken);
  });

  test("JWT verifyToken", async () => {
    const tokenPayload = await authToken.verifyToken(testToken);
    expect(tokenPayload).toBeDefined();
    expect(tokenPayload.id).toEqual(1);
  });
});
