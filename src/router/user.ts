import { Router } from "express";
import { findYourOrders, loginUser, registerUser } from "../controller/user";
import { checkCookie } from "../helpers/auth";

const router = Router();
router.post("/login", loginUser);
router.post("/register", registerUser);
router.get("/user_orders", checkCookie, findYourOrders);
export { router as userRouter };
