import HTTPClient from "./HTTPClient";

describe("TEST HTTPClient", () => {
  let client: HTTPClient;

  beforeAll(() => {
    client = new HTTPClient();
  });

  test("OK", () => {
    expect(client).toBeDefined();
  });

  test("ERROR", () => {});
});
