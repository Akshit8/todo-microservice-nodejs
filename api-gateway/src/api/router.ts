import { Router } from "express";
import { AuthControllerV1 } from "./auth.controller";
import { TokenMiddleware } from "./middleware";
import { TodoControllerV1 } from "./todo.controller";

const router = Router();

const authRouterV1 = AuthControllerV1.buildControllerRoutes(router, TokenMiddleware);
const todoRouterV1 = TodoControllerV1.buildControllerRoutes(router, TokenMiddleware);

router.use("/v1/auth", authRouterV1);
router.use("/v1/todo", todoRouterV1);

export default router;
