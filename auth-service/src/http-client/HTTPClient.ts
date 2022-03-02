import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse
} from "axios";
import Pqueue from "p-queue";

const REQUEST_RETRY_LIMIT = 3;

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

  async request(p: Promise<AxiosResponse<any, any>>): Promise<any> {
    let requestCounter = REQUEST_RETRY_LIMIT;
    let err: AxiosError = null;

    while (requestCounter > 0) {
      try {
        const response = await p;
        return response;
      } catch (e) {
        err = e as AxiosError;

        if (err.request || err.message) {
          requestCounter--;
          continue;
        }

        if (err.response) {
          break;
        }
      }
    }

    this.logger.error(`HTTPClient error for request: ${err.config}`);

    if (err.response) {
      this.logger.error(`HTTPClient: ${err.response.status} ${err.response.data}`);
    } else if (err.request) {
      this.logger.error(`HTTPClient: ${err.request}`);
    } else {
      this.logger.error(`HTTPClient: ${err.message}`);
    }

    return {
      status: 500
    };
  }

  async get(url: string, requestConfig?: AxiosRequestConfig) {
    return this.queue.add(() => this.axiosInstance.get(url, requestConfig));
  }

  async post(url: string, data?: any, requestConfig?: AxiosRequestConfig) {
    return this.queue.add(() => this.axiosInstance.post(url, data, requestConfig));
  }
}

export default HTTPClient;
