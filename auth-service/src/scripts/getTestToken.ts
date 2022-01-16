import { JWT } from "../utils";

(async () => {
  const authToken = new JWT("secret", "24h");
  const token = await authToken.signToken({ id: 1 });
  console.log(token);
})();
