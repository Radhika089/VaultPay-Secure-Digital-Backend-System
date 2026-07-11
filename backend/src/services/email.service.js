import dotenv from "dotenv";
dotenv.config();

import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false, // true only for port 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Verify connection
transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP Error:", error);
  } else {
    console.log("✅ Brevo SMTP Connected");
  }
});

// Generic send email
export const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"VaultPay" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });

    console.log("✅ Email sent:", info.messageId);
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
};

// Welcome email
export const sendRegistrationEmail = async (userEmail, name) => {
  const subject = "Welcome to VaultPay 🎉";

  const text = `Hi ${name},

Welcome to VaultPay!

Your account has been created successfully.

Thanks,
VaultPay Team`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto;">
      <h2>Welcome to VaultPay! 🎉</h2>

      <p>Hi <strong>${name}</strong>,</p>

      <p>Your account has been created successfully.</p>

      <p>We're excited to have you on board.</p>

      <br>

      <p>Thanks,<br><strong>VaultPay Team</strong></p>
    </div>
  `;

  await sendEmail(userEmail, subject, text, html);
};
