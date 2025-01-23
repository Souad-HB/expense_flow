import { userRouter } from "./user-routes.js";
import { accountRouter } from "./account-routes.js";
import { Router } from "express";

const router = Router();

router.use("/users", userRouter);
router.use("/accounts", accountRouter);

export default router;
