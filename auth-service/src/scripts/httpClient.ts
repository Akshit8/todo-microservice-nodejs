import { HTTPClient } from "../utils";

(async () => {
  const p: Promise<{ timestamp: Date; statusCode: number }>[] = [];

  const client = new HTTPClient();

  p.push(client.get("https://jsonplaceholde.typicode.com/todos/1"));
  p.push(client.get("https://jsonplaceholde.typicode.com/todos/2"));

  const response = await Promise.all(p);

  response.forEach((res) => {
    console.log(res);
  });
})();
