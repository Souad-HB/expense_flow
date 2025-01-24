import { userRouter } from "./user-routes.js";
import { accountRouter } from "./account-routes.js";
import { transactionRouter } from "./transaction-routes.js";
import { categoryRouter } from "./category-routes.js";
import { Router } from "express";

const router = Router();

router.use("/users", userRouter);
router.use("/accounts", accountRouter);
router.use("/transactions", transactionRouter);
router.use("/categories", categoryRouter);

export default router;
