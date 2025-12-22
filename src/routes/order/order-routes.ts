import express, { Router } from "express";
import AuthMiddleWare, { UserRole } from "../../middleware/auth-middleware";
import OrderController from "../../controller/order/order-controller";

const router: Router = express.Router();

// CUSTOMER
router.post("/order", AuthMiddleWare.isLogedIn, OrderController.createOrder);
router.post("/order/verify", AuthMiddleWare.isLogedIn, OrderController.verfyTransaction);
router.get("/order", AuthMiddleWare.isLogedIn, OrderController.fetchOrder);
router.get(
  "/order/:id",
  AuthMiddleWare.isLogedIn,
  AuthMiddleWare.restrictTo(UserRole.CUSTOMER),
  OrderController.fetchOrderDetails
);

// cancel order
router.patch(
  "/order/:id/cancel",
  AuthMiddleWare.isLogedIn,
  AuthMiddleWare.restrictTo(UserRole.CUSTOMER),
  OrderController.cancleOrder
);

// ADMIN
router.patch(
  "/order/:id/status",
  AuthMiddleWare.isLogedIn,
  AuthMiddleWare.restrictTo(UserRole.ADMIN),
  OrderController.changeOrderStatus
);

router.delete(
  "/order/:id",
  AuthMiddleWare.isLogedIn,
  AuthMiddleWare.restrictTo(UserRole.ADMIN),
  OrderController.deleteOrder
);

router.patch(
  "/order/payment/:id/status",
  AuthMiddleWare.isLogedIn,
  AuthMiddleWare.restrictTo(UserRole.ADMIN),
  OrderController.changePaymentStatus
);


export default router;
