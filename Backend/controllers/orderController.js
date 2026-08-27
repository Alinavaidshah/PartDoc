import Order from '../models/Order.js';
import sendWhatsAppMessage from '../utils/sendWhatsupp.js';
import sendEmail from '../utils/sendEmail.js';

// 1. Add Order Items
export const addOrderItems = async (req, res) => {
  try {
    const orderData = req.body.data ? JSON.parse(req.body.data) : req.body;
    const { orderItems, shippingAddress, paymentMethod, totalPrice } = orderData;

    const initialStatus = (paymentMethod === 'JazzCash' || paymentMethod === 'EasyPaisa') 
      ? 'Pending Payment Verification' 
      : 'Order Received & Being Prepared';

    const receiptPath = req.file ? `/images/${req.file.filename}` : null;

    const order = new Order({
      orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
      orderStatus: initialStatus,
      isPaid: false,
      paymentResult: {
        transactionId: "pending",
        receiptImage: receiptPath
      }
    });

    const createdOrder = await order.save();

    // Email Confirmation (For all payment methods if email provided)
    if (shippingAddress?.email) {
      try {
        const itemsHtml = createdOrder.orderItems.map(item => `
          <li style="margin-bottom: 6px; padding: 6px; background: #f8fafc; border-radius: 6px;">
            <b>${item.name}</b> - Quantity: ${item.qty} - Rs ${item.price * item.qty}
          </li>
        `).join('');

        await sendEmail({
          email: shippingAddress.email,
          subject: 'Order Placed Successfully - Digi Dude',
          html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
              <h2 style="color: #4f46e5;">Thank you! Your order has been placed successfully.</h2>
              <p>Dear <b>${shippingAddress.fullName || 'Customer'}</b>,</p>
              <p>Your order has been received and is currently <b>Pending Confirmation</b>.</p>
              <p><b>Order ID:</b> #${createdOrder._id.toString().slice(-6).toUpperCase()}</p>
              <p><b>Order Status:</b> Pending</p>
              <h3 style="margin-top: 15px;">Ordered Items:</h3>
              <ul style="list-style-type: none; padding: 0;">${itemsHtml}</ul>
              <p style="font-size: 16px;"><b>Total Price: Rs ${createdOrder.totalPrice}</b></p>
              <p style="font-weight: bold; color: #4f46e5; margin-top: 20px;">Our team will contact you soon.</p>
            </div>
          `
        });
      } catch (emailErr) {
        console.error("Email sending failed:", emailErr.message);
      }
    }

    // WhatsApp Notification on Order Placement
    if (shippingAddress?.phone) {
      const orderIdShort = createdOrder._id.toString().slice(-6).toUpperCase();
      const whatsappMsg = `📌 *Digi Dude Order Placed Successfully!*\n\n*Order ID:* #${orderIdShort}\n*Customer Name:* ${shippingAddress.fullName || 'Customer'}\n*Total Price:* PKR ${createdOrder.totalPrice}\n*Payment Method:* ${paymentMethod}\n*Status:* Order Received & Being Prepared\n\nOur team will contact you soon.`;
      try {
        await sendWhatsAppMessage(shippingAddress.phone, whatsappMsg);
      } catch (waErr) {
        console.error("Order placement WhatsApp failed:", waErr.message);
      }
    }

    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. Get All Orders
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. Get Order By ID
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 4. Update Order Status (WhatsApp & Email Notifications included)
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, isPaid } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Update Data
    order.orderStatus = orderStatus || order.orderStatus;
    if (isPaid !== undefined) {
      order.isPaid = isPaid;
      order.paidAt = isPaid ? Date.now() : order.paidAt;
    }

    const updatedOrder = await order.save();
    const orderIdShort = updatedOrder._id.toString().slice(-6).toUpperCase();

    // 1. WhatsApp Notification
    if (order.shippingAddress?.phone) {
      const whatsappMsg = `📌 *Digi Dude Order Status Update*\n\n*Order ID:* #${orderIdShort}\n*Customer Name:* ${order.shippingAddress.fullName || 'Customer'}\n*Updated Status:* ${orderStatus}\n\nOur team will contact you soon.`;
      try {
        await sendWhatsAppMessage(order.shippingAddress.phone, whatsappMsg);
      } catch (err) {
        console.error("WhatsApp notification failed:", err.message);
      }
    }

    // 2. Email Notification (English)
    if (order.shippingAddress?.email) {
      try {
        await sendEmail({
          email: order.shippingAddress.email,
          subject: `Order Status Update - Digi Dude`,
          html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
              <h2 style="color: #4f46e5;">Order Status Update</h2>
              <p>Dear <b>${order.shippingAddress.fullName || 'Customer'}</b>,</p>
              <p>The status of your order <b>#${orderIdShort}</b> has been updated to: <b>${orderStatus}</b>.</p>
              <p>Thank you for shopping with Digi Dude!</p>
              <p style="font-weight: bold; color: #4f46e5; margin-top: 20px;">Our team will contact you soon.</p>
            </div>
          `
        });
      } catch (err) {
        console.error("Email notification failed:", err.message);
      }
    }

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};