import { Router } from "express";
import {
  createOrder,
  deleteOrder,
  listOne,
  listOrders,
} from "../controller/order";
import { checkCookie, isStaffAuthenticated } from "../helpers/auth";
import { ROLES } from "../types";

const router = Router();

router.get(
  "/orders",
  isStaffAuthenticated(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  listOrders
);
router.get(
  "/orders/:id",
  isStaffAuthenticated(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  listOne
);
router.post("/order", checkCookie, createOrder);
router.delete("/order", checkCookie, deleteOrder);

export { router as ordersRouter };
