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

// Transaction Success Email
export const sendTransactionEmail = async (
  userEmail,
  name,
  toAccount,
  amount,
) => {
  const subject = "Transaction Successful";

  const text = `
    Hi ${name},

    Your transaction was completed successfully.

    Amount: ₹${amount}
    Sent To: ${toAccount}

    Thank you for using VaultPay.

    - Team VaultPay
    `;

  const html = `
    <h2>Transaction Successful 🎉</h2>
    <p>Hi <strong>${name}</strong>,</p>
    <p>Your transaction has been completed successfully.</p>

    <ul>
      <li><strong>Amount:</strong> ₹${amount}</li>
      <li><strong>Sent To:</strong> ${toAccount}</li>
    </ul>

    <p>Thank you for using <strong>VaultPay</strong>.</p>
  `;

  await sendEmail(userEmail, subject, text, html);
};

// Transaction Failure Email
export const sendTransactionFailureEmail = async (
  userEmail,
  name,
  toAccount,
  amount,
) => {
  const subject = "Transaction Failed";

  const text = `
    Hi ${name},

    Unfortunately, your transaction could not be completed.

    Amount: ₹${amount}
    Recipient: ${toAccount}

    No money has been deducted from your account. Please try again later.

    - Team VaultPay
    `;

  const html = `
    <h2>Transaction Failed ❌</h2>
    <p>Hi <strong>${name}</strong>,</p>

    <p>Unfortunately, your transaction could not be completed.</p>

    <ul>
      <li><strong>Amount:</strong> ₹${amount}</li>
      <li><strong>Recipient:</strong> ${toAccount}</li>
    </ul>

    <p>No money has been deducted from your account. Please try again later.</p>

    <p>Thank you,<br><strong>Team VaultPay</strong></p>
  `;

  await sendEmail(userEmail, subject, text, html);
};
