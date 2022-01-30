import { sign } from "jsonwebtoken";
import { JWT } from "./AuthToken";

describe("TEST JWT implementation", () => {
  const authToken = new JWT("secret");

  let testToken: string;
  beforeAll(async () => {
    testToken = sign({ id: 1 }, "secret", { expiresIn: "24h" });
  });

  test("JWT verifyToken", async () => {
    const tokenPayload = await authToken.verifyToken(testToken);
    expect(tokenPayload).toBeDefined();
    expect(tokenPayload.id).toEqual(1);
  });
});
