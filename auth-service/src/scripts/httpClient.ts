import { HTTPClient } from "../utils";

(async () => {
  const start = Date.now();

  const p: Promise<{ timestamp: Date; statusCode: number }>[] = [];

  const client = new HTTPClient();

  p.push(
    client.get("https://jsonplaceholde.typicode.com/todos/1", {
      headers: { test: "test" }
    })
  );
  p.push(client.get("https://jsonplaceholde.typicode.com/todos/2"));
  p.push(client.get("https://jsonplaceholder.typicode.com/todos/3"));
  p.push(client.get("https://jsonplaceholder.typicode.com/todos/4"));
  p.push(client.get("https://jsonplaceholder.typicode.com/todos/5"));
  p.push(client.get("https://jsonplaceholder.typicode.com/todos/6"));

  const response = await Promise.all(p);

  response.forEach((res) => {
    console.log(res);
  });

  console.log("Time taken:", (Date.now() - start) / 1000, "seconds");
})();
