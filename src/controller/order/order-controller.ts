import { IAuthRequest } from "../../middleware/auth-middleware";
import { Response } from "express";
import { KhaltiResponse, OrderData, OrderStatus, PaymentMethod, PaymentStatus, TransactionStatus, TransactionVerificationResponse } from "../../types/order-type";
import Payment from "../../database/models/payment-model";
import Order from "../../database/models/order-model";
import OrderDetails from "../../database/models/order-details";
import axios from "axios";
import Product from "../../database/models/product-model";
class ExtendedOrder extends Order{
    declare paymentId :string | null
}


class OrderController {
    static async createOrder(req:IAuthRequest, res:Response){
        try {
            const userId  = req.user?.id
            const{shippingAddress, phoneNumber, totalAmount, paymentDetails, items}:OrderData =req.body
            if(!shippingAddress || !phoneNumber || !totalAmount || ! paymentDetails || !paymentDetails.paymentMethod || items.length === 0){
                return res.status(400).json({
          message: "Please provide all required fields",
        });
            }
             // Create Payment row linked to order
        const paymentData = await Payment.create({
        // orderId: orderData.id,
        paymentMethod: paymentDetails.paymentMethod,
        // paymentStatus: paymentDetails.paymentStatus || "unpaid"
      });
       // Create Order
        const orderData = await Order.create({
        userId,
        phoneNumber,
        shippingAddress,
        totalAmount,
        paymentId :paymentData.id
      });
      // Create Order Details
      for (let i = 0; i < items.length; i++) {
        await OrderDetails.create({
        quantity: items[i].quantity,
         productId: items[i].productId,
          orderId: orderData.id
        });
      }
      if(paymentDetails.paymentMethod === PaymentMethod.KHALTI){
        const data = {
           return_url: "http://localhost:3000/success",
          website_url: "http://localhost:3000/",
          amount: Number(totalAmount) * 100,
          purchase_order_id: orderData.id,
          purchase_order_name: `order_${orderData.id}`
        }

        const response = await axios.post( "https://dev.khalti.com/api/v2/epayment/initiate/",data,{
            headers:{
                Authorization:`Key ${process.env.KHALTI_SECRET_KEY || "9f9810013367453bb58b3b799a68c658"}`,
                "Content-Type": "application/json",
            }
        })
        console.log(response)

        const khaltiData: KhaltiResponse  =  response.data
         await paymentData.update({ pidx: khaltiData.pidx });

  return res.status(200).json({
    message: "Khalti payment initiated",
    pidx: khaltiData.pidx,
    payment_url: khaltiData.payment_url,
  });
      }
        return res.status(201).json({
        message: "Order created successfully",
        orderId: orderData.id,
      });
        } catch (error :any) {
             console.error("Order Create Error:", error);
      return res.status(500).json({
        message: "Server error",
        error: error.message,
        stack: error.stack,
      });
        }
    }
 static async verfyTransaction(req: IAuthRequest, res: Response) {
  try {
    const { pidx } = req.body;

    if (!pidx) {
      return res.status(400).json({
        message: "Please provide pidx",
      });
    }

    const response = await axios.post(
      "https://dev.khalti.com/api/v2/epayment/lookup/",
      { pidx },
      {
        headers: {
          Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
        },
      }
    );

    const data: TransactionVerificationResponse = response.data;
    console.log(data, ":ans");

    if (data.status === TransactionStatus.COMPLETED) {
      await Payment.update(
        { paymentStatus: PaymentStatus.PAID },
        { where: { pidx } }
      );

      return res.status(200).json({
        message: "Payment verified successfully",
      });
    }

    return res.status(400).json({
      message: "Payment not verified",
    });
  } catch (error: any) {
    console.error("Verify Transaction Error:", error);

    return res.status(500).json({
      message: "Server error",
      error: error.message,
      stack: error.stack,
    });
  }
}
static async fetchOrder(req:IAuthRequest, res:Response){
    try {
        const userId = req.user?.id
        const Orders =  await Order.findAll({
            where:{
                userId
            },
            include:[
                {
                    model:Payment
                }
            ]
        })
        if(Orders.length > 0 ){
        res.status(200).json({
            message : 'orders data succesfully fetched ',
            data:Orders
        })
    }else{
        res.status(400).json({
            message:" you haven't order anything "
        })
    }
    } catch (error: any) {
      console.error("Order Create Error:", error);
      return res.status(500).json({
        message: "Server error",
        error: error.message,
        stack: error.stack,
      });
    }
  }

  static async fetchOrderDetails(req:IAuthRequest, res:Response){
    try {
        const orderId  =  req.params.id
        const orderdetails =  await OrderDetails.findAll({
            where:{
                orderId
            },
            include:[{
                model:Product
            }]
        })

      if(orderdetails.length > 0 ){
        res.status(200).json({
            message : 'orders data succesfully fetched ',
            data:orderdetails 
        })
    }else{
        res.status(400).json({
            message:" you haven't order anything "
        })
    }
    } catch (error: any) {
      console.error("Order Create Error:", error);
      return res.status(500).json({
        message: "Server error",
        error: error.message,
        stack: error.stack,
      });
    }
  }
static async cancleOrder(req: IAuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { id: orderId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const order = await Order.findOne({
      where: { id: orderId, userId },
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }


    if (
      order.orderStatus === OrderStatus.ONTHEWAY ||
      order.orderStatus === OrderStatus.PENDING
    ) {
      return res.status(400).json({
        message: "Order cannot be cancelled at this stage",
      });
    }

    //  Correct field name
    await order.update({
      orderStatus: OrderStatus.CANCELED,
    });

    return res.status(200).json({
      message: "Order cancelled successfully",
    });
  } catch (error: any) {
    console.error("Cancel Order Error:", error);

    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
}

static async changeOrderStatus(req: IAuthRequest, res: Response) {
  try {
    const orderId = req.params.id;
    const orderStatus: OrderStatus = req.body.orderStatus;

    // Validate body
    if (!orderStatus) {
      return res.status(400).json({ message: "orderStatus is required" });
    }

    // Validate enum value (IMPORTANT!)
    if (!Object.values(OrderStatus).includes(orderStatus)) {
      return res.status(400).json({ message: "Invalid orderStatus value" });
    }

    // Update order
   await Order.update(
      { orderStatus },
      { where: { id: orderId } }
    );

  
    return res.status(200).json({
      message: "Order status updated successfully",
      orderId,
      orderStatus
    });

  } catch (error: any) {
    console.error("Order Status Update Error:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
      stack: error.stack,
    });
  }
}
static async changePaymentStatus(req: IAuthRequest, res: Response) {
  try {
    const orderId = req.params.id;
    console.log("orderId from params:", req.params.id);

    const paymentStatus: PaymentStatus = req.body.paymentStatus;

    console.log(paymentStatus, ": status");

    if (!paymentStatus) {
      return res.status(400).json({ message: "paymentStatus is required" });
    }

    if (!Object.values(PaymentStatus).includes(paymentStatus)) {
      return res.status(400).json({ message: "Invalid paymentStatus value" });
    }

   const order = await Order.findOne({
    where: { id: orderId }
});
 

    console.log("orders Fetch :" , order)
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const extendedOrder = order as ExtendedOrder;

    if (!extendedOrder.paymentId) {
      return res.status(400).json({
        message: "Order has no payment record",
      });
    }

    const [updated] = await Payment.update(
      { paymentStatus },
      { where: { id: extendedOrder.paymentId } }
    );

    if (updated === 0) {
      return res.status(404).json({
        message: "Payment record not found",
      });
    }

    return res.status(200).json({
      message: `Payment status of order ${orderId} updated successfully`,
      orderId,
      paymentStatus,
    });

  } catch (error: any) {
    console.error("Payment Status Update Error:", error);

    return res.status(500).json({
      message: "Server error",
      error: error.message,
      stack: error.stack,
    });
  }
}

static async deleteOrder(req:IAuthRequest, res:Response){
    try {
        const orderId =  req.params.id
        const order =  await Order.findByPk(orderId)
        if(!order){
            return res.status(400).json({message:"Order not found"})
        }
   
    // Convert safely
    const extendedOrder = order as ExtendedOrder;

    // 2. Delete related OrderDetails first
    await OrderDetails.destroy({
      where: { orderId }
    });

    // 3. Delete Payment if paymentId exists
    if (extendedOrder.paymentId) {
      await Payment.destroy({
        where: { id: extendedOrder.paymentId }
      });
    }

    // 4. Delete the main order last
    await Order.destroy({
      where: { id: orderId }
    });

    return res.status(200).json({
      message: "Order deleted successfully"
    });

  } catch (error: any) {
    console.error("Delete Order Error:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
      stack: error.stack,
    });
  }
}
}


export default OrderController