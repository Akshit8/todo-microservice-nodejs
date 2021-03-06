import { Router } from "express";
import { AuthControllerV1 } from "./auth.controller";
import { queryParamMiddleware, tokenMiddleware } from "./middleware";
import { TodoControllerV1 } from "./todo.controller";

const router = Router();

const authRouterV1 = AuthControllerV1.buildControllerRoutes();
const todoRouterV1 = TodoControllerV1.buildControllerRoutes();

router.use("/v1/auth", tokenMiddleware, queryParamMiddleware, authRouterV1);
router.use("/v1/todo", tokenMiddleware, queryParamMiddleware, todoRouterV1);

export default router;
