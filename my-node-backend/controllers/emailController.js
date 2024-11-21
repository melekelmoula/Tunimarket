//my-node-backend\controllers\emailController.js
const nodemailer = require('nodemailer');
require('dotenv').config();

// Create a reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // SMTP host
  port: 465,             // SMTP port
  secure: true,          // Use TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }
});

// Controller function to send order code email
const sendOrderCodeEmail = async (req, res) => {
  const { email, code } = req.body; // Extract email and code from the request body

  if (!email || !code) {
    return res.status(400).json({ message: "Email and code are required." });
  }

  // Setup email data
  const mailOptions = {
    from: process.env.EMAIL_USER,          // Sender address
    to: email,                             // Recipient email
    subject: 'Your Order Code',            // Subject line
    text: `Thank you for your order! Your order code is: ${code}`, // Plain text body
  };

  try {
    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    res.status(200).json({ message: 'Email successfully sent!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send email.', error: error.message });
  }
};

module.exports = { sendOrderCodeEmail };
