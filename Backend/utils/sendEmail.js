import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_PORT == 465, 
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false
    },
  });

  const mailOptions = {
    from: `"Digi Dude Support" <${process.env.EMAIL_USER || 'digidude.online@gmail.com'}>`, 
    to: options.email,
    subject: options.subject,
    html: options.html, 
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;