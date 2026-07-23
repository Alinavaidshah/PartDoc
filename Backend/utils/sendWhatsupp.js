import twilio from 'twilio';

const sendWhatsAppMessage = async (to, messageBody) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromWhatsApp = process.env.TWILIO_WHATSAPP_FROM; // e.g., 'whatsapp:+14155238886'

  // Agar credentials env mein nahi hain, toh console block mein log karke return ho jaye
  if (!accountSid || !authToken) {
    console.log('⚠️ Twilio Credentials missing. WhatsApp Message Log:', messageBody);
    return;
  }

  const client = twilio(accountSid, authToken);

  try {
    const message = await client.messages.create({
      from: fromWhatsApp,
      body: messageBody,
      to: `whatsapp:${to}`,
    });
    console.log(`✉️ WhatsApp message sent: ${message.sid}`);
  } catch (error) {
    console.error(`❌ Failed to send WhatsApp message: ${error.message}`);
  }
};

export default sendWhatsAppMessage;