import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendMail = async (to, subject, html, text) => {
  try {
    const info = await transporter.sendMail({
      from: `"IndriyaX Dev" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text: text || "Please view this email in an HTML-compatible client.",
      html,
    });

    console.log(`📧 Email sent to ${to}`);
    
    // --- THE MAGIC PART ---
    // This generates a URL you can click to see the email in your browser
    console.log("🔗 Preview URL: %s", nodemailer.getTestMessageUrl(info)); 

  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
};

export default sendMail;