require('dotenv').config();
const nodemailer = require('nodemailer');

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
const sendOrderEmail = async (req, res) => {
  const { email, subject, message, attachment } = req.body;

  if (!email || !subject || !message) {
    return res.status(400).json({ message: "Email, subject, and message are required." });
  }

  let attachments = [];

  // Check if there's an attachment
  if (attachment) {
    try {
      // Decode base64 attachment if provided
      const pdfBuffer = Buffer.from(attachment.split(',')[1], 'base64');
      
      // Add attachment to the email
      attachments.push({
        filename: 'order_invoice.pdf',
        content: pdfBuffer,
        encoding: 'base64',
      });
    } catch (error) {
      return res.status(400).json({ message: "Error processing the attachment.", error: error.message });
    }
  }

  // Setup email data
  const mailOptions = {
    from: process.env.EMAIL_USER,    // Sender address
    to: email,                       // Recipient email
    subject: subject,                // Dynamic subject line
    text: message,                   // Use the message content as the email body
    attachments: attachments,        // Attachments array (empty if no attachment)
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

module.exports = { sendOrderEmail };
