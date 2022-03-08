import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import Pqueue from "p-queue";

const MAX_HTTP_CLIENT_RETRIES = 3;
const HTTP_CLIENT_SLEEP_TIME = 1000;
const HTTP_CLIENT_ERROR_CODE = 822;

interface ClientOptions {
  requestTimeout: number;
  maxConcurrentRequests: number;
}

interface ClientLogger {
  info(...data: any[]): void;
  error(...data: any[]): void;
}

export class HTTPClient {
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

    this.logger.info(
      `Making request to ${config.url} at ${timestamp.toISOString()}
      with method: ${config.method}
      with headers: ${JSON.stringify(config.headers) || null}
      with data: ${JSON.stringify(config.data) || null}`
    );

    while (retriesCount > 0) {
      try {
        const response = await this.axiosInstance.request(config);

        this.logger.info(
          `Request to ${config.url} at ${timestamp.toISOString()} succeeded 
          response status: ${response.status}
          response body`,
          response.data
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

        this.logger.info(
          `Request to ${config.url} failed, retrying ${retriesCount} more times`
        );

        await sleep(HTTP_CLIENT_SLEEP_TIME);
      }
    }

    if (err) {
      const requestConfig = err.config;

      if (err.response) {
        this.logger.error(
          `
          Request ${requestConfig.url} at ${timestamp.toISOString()} failed
          Destination server returned error: 
          response status: ${err.response.status} 
          response body:`,
          err.response.data
        );
      } else {
        this.logger.error(
          `Request ${requestConfig.url} at ${timestamp.toISOString()} failed
          Error: ${err.message}`
        );
      }
    }

    return {
      timestamp,
      statusCode: err?.response?.status || HTTP_CLIENT_ERROR_CODE
    };
  }

  async get(url: string, requestConfig?: AxiosRequestConfig): Promise<any> {
    return this.queue.add(() => this.request({ url, ...requestConfig, method: "GET" }));
  }

  async post(
    url: string,
    data?: any,
    requestConfig?: AxiosRequestConfig
  ): Promise<any> {
    return this.queue.add(() =>
      this.request({ url, data, ...requestConfig, method: "POST" })
    );
  }
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
