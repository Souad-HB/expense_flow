import { userRouter } from "./user-routes.js";
import { Router } from "express";

const router = Router();

router.use("/users", userRouter);

export default router;
