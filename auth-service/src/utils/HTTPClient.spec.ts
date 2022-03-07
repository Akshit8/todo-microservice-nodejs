import { AxiosRequestConfig } from "axios";
import HTTPClient from "./HTTPClient";

interface RequestInterface {
  name?: string;
  method: string;
  url: string;
  data?: any;
  requestConfig?: AxiosRequestConfig;
}

interface ResponseInterface {
  statusCode: number;
  timestamp: Date;
}

describe("TEST HTTPClient", () => {
  let client: HTTPClient;

  beforeAll(() => {
    client = new HTTPClient();
  });

  test("OK", async () => {
    expect(client).toBeDefined();

    const p: Promise<ResponseInterface>[] = [];

    const requests: RequestInterface[] = [
      {
        method: "GET",
        url: "https://jsonplaceholder.typicode.com/todos/1"
      },
      {
        method: "GET",
        url: "https://jsonplaceholder.typicode.com/todos/2"
      },
      {
        method: "POST",
        url: "https://jsonplaceholder.typicode.com/todos",
        data: {
          title: "foo",
          completed: false,
          userId: 1
        },
        requestConfig: {
          headers: {
            "Content-Type": "application/json"
          }
        }
      },
      {
        method: "POST",
        url: "https://jsonplaceholder.typicode.com/todos",
        data: {
          title: "bar",
          completed: false,
          userId: 1
        },
        requestConfig: {
          headers: {
            "Content-Type": "application/json"
          }
        }
      }
    ];

    const expectedResponse: ResponseInterface[] = [
      {
        statusCode: 200,
        timestamp: new Date()
      },
      {
        statusCode: 200,
        timestamp: new Date()
      },
      {
        statusCode: 201,
        timestamp: new Date()
      },
      {
        statusCode: 201,
        timestamp: new Date()
      }
    ];

    requests.forEach((request) => {
      if (request.method === "GET") {
        p.push(client.get(request.url, request.requestConfig));
      } else {
        p.push(client.post(request.url, request.data, request.requestConfig));
      }
    });

    const responses = await Promise.all(p);

    for (let i = 0; i < responses.length; i++) {
      expect(responses[i].statusCode).toEqual(expectedResponse[i].statusCode);
    }
  });

  test("ERROR", async () => {
    expect(client).toBeDefined();

    const p: Promise<ResponseInterface>[] = [];

    const requests: RequestInterface[] = [
      {
        name: "incorrect url",
        method: "GET",
        url: "https://jsonplaceholde.typicode.com/todos/1"
      },
      {
        name: "404 error",
        method: "GET",
        url: "https://jsonplaceholder.typicode.com/todos/2234234"
      },
      {
        name: "incorrect url",
        method: "POST",
        url: "https://jsonplaceholde.typicode.com/todos",
        data: {
          title: "foo",
          completed: false,
          userId: 1
        },
        requestConfig: {
          headers: {
            "Content-Type": "application/json"
          }
        }
      }
    ];

    const expectedResponse: ResponseInterface[] = [
      {
        statusCode: 822,
        timestamp: new Date()
      },
      {
        statusCode: 404,
        timestamp: new Date()
      },
      {
        statusCode: 822,
        timestamp: new Date()
      }
    ];

    requests.forEach((request) => {
      if (request.method === "GET") {
        p.push(client.get(request.url, request.requestConfig));
      } else {
        p.push(client.post(request.url, request.data, request.requestConfig));
      }
    });

    const responses = await Promise.all(p);

    for (let i = 0; i < responses.length; i++) {
      expect(responses[i].statusCode).toEqual(expectedResponse[i].statusCode);
    }
  });
});
