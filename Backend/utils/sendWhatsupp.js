import twilio from 'twilio';

const sendWhatsAppMessage = async (to, messageBody) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromWhatsApp = process.env.TWILIO_WHATSAPP_FROM; // e.g., 'whatsapp:+14155238886'

  if (!to) return;

  // Auto format 03xx Pakistani numbers to +923xx for Twilio WhatsApp API
  let formattedTo = String(to).trim().replace(/\s+/g, '').replace(/-/g, '');
  if (formattedTo.startsWith('03')) {
    formattedTo = '+92' + formattedTo.slice(1);
  } else if (!formattedTo.startsWith('+')) {
    formattedTo = '+' + formattedTo;
  }

  // Agar credentials env mein nahi hain, toh console block mein log karke return ho jaye
  if (!accountSid || !authToken) {
    console.log(`⚠️ Twilio Credentials missing. WhatsApp Message Log for ${formattedTo}:`, messageBody);
    return;
  }

  const client = twilio(accountSid, authToken);

  try {
    const message = await client.messages.create({
      from: fromWhatsApp,
      body: messageBody,
      to: `whatsapp:${formattedTo}`,
    });
    console.log(`✉️ WhatsApp message successfully sent to ${formattedTo}: ${message.sid}`);
  } catch (error) {
    console.error(`❌ Failed to send WhatsApp message to ${formattedTo}: ${error.message}`);
  }
};

export default sendWhatsAppMessage;