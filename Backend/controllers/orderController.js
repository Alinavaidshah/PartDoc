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

    // Email Confirmation (Sirf COD aur Card ke liye)
    if (paymentMethod === 'COD' || paymentMethod === 'Card') {
      try {
        const itemsHtml = createdOrder.orderItems.map(item => `
          <li style="margin-bottom: 5px;">
            <b>${item.name}</b> - Qty: ${item.qty} - Rs ${item.price * item.qty}
          </li>
        `).join('');

        await sendEmail({
          email: shippingAddress.email,
          subject: 'Order Confirmed - PartDoc',
          html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
              <h2 style="color: #D8973C;">Shukriya! Aapka order place ho gaya hai.</h2>
              <p>Order ID: <b>#${createdOrder._id.toString().slice(-6).toUpperCase()}</b></p>
              <h3>Items ordered:</h3>
              <ul style="list-style-type: none; padding: 0;">${itemsHtml}</ul>
              <p><b>Total Amount: Rs ${createdOrder.totalPrice}</b></p>
              <p>Hum jald hi aapke order par kaam shuru karenge.</p>
            </div>
          `
        });
      } catch (emailErr) {
        console.error("Email sending failed:", emailErr.message);
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
      const message = `Salam! PartDoc se aapka order #${orderIdShort} ka status update hokar "${orderStatus}" ho gaya hai.`;
      try {
        await sendWhatsAppMessage(order.shippingAddress.phone, message);
      } catch (err) {
        console.error("WhatsApp notification failed:", err.message);
      }
    }

    // 2. Email Notification
    try {
      await sendEmail({
        email: order.shippingAddress.email,
        subject: `Order Update: ${orderStatus}`,
        html: `
          <div style="font-family: Arial, sans-serif;">
            <h2>Salam ${order.shippingAddress.fullName},</h2>
            <p>Aapke order ka status update kar diya gaya hai.</p>
            <p><strong>Order ID:</strong> #${orderIdShort}</p>
            <p><strong>New Status:</strong> ${orderStatus}</p>
            <p>Visit PartDoc for more details.</p>
          </div>
        `
      });
    } catch (err) {
      console.error("Email notification failed:", err.message);
    }

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};