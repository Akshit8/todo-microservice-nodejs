import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import Pqueue from "p-queue";

const MAX_HTTP_CLIENT_RETRIES = 3;
const HTTP_CLIENT_SLEEP_TIME = 1000;
const HTTP_CLEINT_ERROR_CODE = 822;

interface ClientOptions {
  requestTimeout: number;
  maxConcurrentRequests: number;
}

interface ClientLogger {
  info(message: string): void;
  error(message: string): void;
}

class HTTPClient {
  axiosInstance: AxiosInstance;

  private logger: ClientLogger;

  private queue: Pqueue;

  constructor(logger?: ClientLogger, options?: ClientOptions) {
    const { requestTimeout = 5000, maxConcurrentRequests = 4 } = options || {};

    this.axiosInstance = axios.create({ timeout: requestTimeout });

    this.logger = logger || console;

    this.queue = new Pqueue({ concurrency: maxConcurrentRequests });
  }

  async request(config: AxiosRequestConfig): Promise<any> {
    let retriesCount = MAX_HTTP_CLIENT_RETRIES;
    let err: AxiosError | undefined;

    const timestamp = new Date();

    while (retriesCount > 0) {
      this.logger.info(`Requesting ${config.url} retries left: ${retriesCount}`);

      try {
        const response = await this.axiosInstance.request(config);

        this.logger.info(
          `Request ${config.url} succeeded with status code ${response.status}`
        );

        return {
          timestamp,
          statusCode: response.status
        };
      } catch (e) {
        err = e as AxiosError;

        if (err.response) {
          if (err.response.status < 500) {
            break;
          }
        }

        retriesCount--;

        await sleep(HTTP_CLIENT_SLEEP_TIME);
      }
    }

    if (err) {
      const requestConfig = err.config;

      this.logger.error(`Request ${requestConfig.url} failed`);

      if (err.response) {
        this.logger.error(
          `Response error: 
          ${err.response.status} 
          ${err.response.statusText}
          ${err.response.data}`
        );
      } else {
        this.logger.error(`Request error: ${err.message}`);
      }
    }

    return {
      timestamp,
      statusCode: err?.response?.status || HTTP_CLEINT_ERROR_CODE
    };
  }

  async get(url: string, requestConfig?: AxiosRequestConfig) {
    return this.queue.add(() => this.request({ url, ...requestConfig, method: "GET" }));
  }

  async post(url: string, data?: any, requestConfig?: AxiosRequestConfig) {
    return this.queue.add(() =>
      this.request({ url, data, ...requestConfig, method: "POST" })
    );
  }
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default HTTPClient;
