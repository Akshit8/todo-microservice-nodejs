import cors from "cors";
import express, { Express } from "express";
import { notFoundHandler, serverErrorHandler } from "./handlers";
import router from "./router";

export const createExpressApp = (): Express => {
  const app = express();

  app.use(cors());

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(router);

  app.use(notFoundHandler);

  app.use(serverErrorHandler);

  return app;
};
