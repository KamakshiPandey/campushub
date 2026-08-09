const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

// Transporter creation
const createTransporter = () => {
  if (process.env.SMTP_USER && process.env.SMTP_USER !== 'demo@campushub.com') {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  
  // Return dummy logger transporter if SMTP is unconfigured for demo
  return {
    sendMail: async (options) => {
      logger.info(`[DEMO EMAIL SENT] To: ${options.to} | Subject: "${options.subject}"`);
      return { messageId: 'demo-email-id' };
    },
  };
};

const sendWelcomeEmail = async (user) => {
  try {
    const transporter = createTransporter();
    const mailOptions = {
      from: `"${process.env.FROM_NAME || 'CampusHub'}" <${process.env.FROM_EMAIL || 'no-reply@campushub.com'}>`,
      to: user.email,
      subject: 'Welcome to CampusHub! 🎓',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #4f46e5;">Welcome to CampusHub, ${user.name}! 👋</h2>
          <p>We're excited to have you join our trusted campus community.</p>
          <p>With CampusHub, you can:</p>
          <ul>
            <li>🛒 Buy, sell, or rent textbooks, electronics, and dorm gear.</li>
            <li>🏠 Find verified, compatible campus roommates.</li>
            <li>💬 Chat in real-time with fellow students.</li>
            <li>⭐ Build trust with peer ratings and reviews.</li>
          </ul>
          <p style="margin-top: 20px; font-size: 12px; color: #64748b;">If you didn't create this account, please ignore this email.</p>
        </div>
      `,
    };
    await transporter.sendMail(mailOptions);
  } catch (error) {
    logger.error('Error sending welcome email:', error.message);
  }
};
const sendVerificationEmail = async (user, verificationToken) => {
  try {
    const transporter = createTransporter();
    const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;
    const mailOptions = {
      from: `"${process.env.FROM_NAME || 'CampusHub'}" <${process.env.FROM_EMAIL || 'no-reply@campushub.com'}>`,
      to: user.email,
      subject: 'Verify your CampusHub account ✅',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #4f46e5;">Verify your email, ${user.name} 🎓</h2>
          <p>Thanks for signing up on CampusHub! Please confirm this is really you by verifying your college email.</p>
          <p style="margin: 25px 0;">
            <a href="${verifyUrl}" style="background: #4f46e5; color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">
              Verify My Email
            </a>
          </p>
          <p style="font-size: 13px; color: #64748b;">Or paste this link into your browser:<br>${verifyUrl}</p>
          <p style="margin-top: 20px; font-size: 12px; color: #64748b;">This link expires in 24 hours. If you didn't create this account, please ignore this email.</p>
        </div>
      `,
    };
    await transporter.sendMail(mailOptions);
  } catch (error) {
    logger.error('Error sending verification email:', error.message);
  }
};

const sendNewMessageAlert = async (recipient, senderName, messagePreview) => {
  try {
    const transporter = createTransporter();
    const mailOptions = {
      from: `"${process.env.FROM_NAME || 'CampusHub'}" <${process.env.FROM_EMAIL || 'no-reply@campushub.com'}>`,
      to: recipient.email,
      subject: `New message from ${senderName} on CampusHub 💬`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h3 style="color: #4f46e5;">New Direct Message</h3>
          <p><strong>${senderName}</strong> sent you a message:</p>
          <blockquote style="background: #f8fafc; border-left: 4px solid #6366f1; padding: 10px 15px; margin: 15px 0;">
            "${messagePreview}"
          </blockquote>
          <p>Log in to CampusHub to reply!</p>
        </div>
      `,
    };
    await transporter.sendMail(mailOptions);
  } catch (error) {
    logger.error('Error sending message email alert:', error.message);
  }
};

const sendMilestoneAlert = async (seller, listing, viewCount) => {
  try {
    const transporter = createTransporter();
    const mailOptions = {
      from: `"${process.env.FROM_NAME || 'CampusHub'}" <${process.env.FROM_EMAIL || 'no-reply@campushub.com'}>`,
      to: seller.email,
      subject: `🎉 Milestone! Your item "${listing.title}" reached ${viewCount} views!`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #10b981;">Listing Views Milestone! 🎉</h2>
          <p>Hi ${seller.name},</p>
          <p>Great news! Your listing <strong>"${listing.title}"</strong> has just reached <strong>${viewCount} views</strong> on CampusHub!</p>
          <p>Keep your chat inbox open to respond quickly to potential campus buyers.</p>
        </div>
      `,
    };
    await transporter.sendMail(mailOptions);
  } catch (error) {
    logger.error('Error sending milestone email alert:', error.message);
  }
};

const sendPaymentSuccessfulEmail = async (buyer, listing, amount) => {
  try {
    const transporter = createTransporter();
    const mailOptions = {
      from: `"${process.env.FROM_NAME || 'CampusHub'}" <${process.env.FROM_EMAIL || 'no-reply@campushub.com'}>`,
      to: buyer.email,
      subject: `💳 Payment successful for "${listing.title}"!`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #10b981;">Payment Successful! 🎉</h2>
          <p>Hi ${buyer.name},</p>
          <p>Your payment of <strong>$${amount}</strong> for the listing <strong>"${listing.title}"</strong> has been successfully processed.</p>
          <p>You can now arrange pickup/exchange with the seller via chat.</p>
        </div>
      `,
    };
    await transporter.sendMail(mailOptions);
  } catch (error) {
    logger.error('Error sending payment successful email:', error.message);
  }
};

const sendItemSoldEmail = async (seller, listing, buyerName, amount) => {
  try {
    const transporter = createTransporter();
    const mailOptions = {
      from: `"${process.env.FROM_NAME || 'CampusHub'}" <${process.env.FROM_EMAIL || 'no-reply@campushub.com'}>`,
      to: seller.email,
      subject: `🎉 Your item "${listing.title}" has been sold!`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #4f46e5;">Your Item Has Sold! 💰</h2>
          <p>Hi ${seller.name},</p>
          <p>Congratulations! Your item <strong>"${listing.title}"</strong> has been sold to <strong>${buyerName}</strong> for <strong>$${amount}</strong>.</p>
          <p>Arrange exchange coordinates with the buyer via chat.</p>
        </div>
      `,
    };
    await transporter.sendMail(mailOptions);
  } catch (error) {
    logger.error('Error sending item sold email:', error.message);
  }
};

const sendItemNoLongerAvailableEmail = async (interestedUser, listing) => {
  try {
    const transporter = createTransporter();
    const mailOptions = {
      from: `"${process.env.FROM_NAME || 'CampusHub'}" <${process.env.FROM_EMAIL || 'no-reply@campushub.com'}>`,
      to: interestedUser.email,
      subject: `ℹ️ Notice: "${listing.title}" is no longer available`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h3 style="color: #64748b;">Listing Update</h3>
          <p>Hi ${interestedUser.name},</p>
          <p>This is to inform you that the item <strong>"${listing.title}"</strong> you were interested in has been sold and is no longer available.</p>
          <p>Explore other listings on CampusHub!</p>
        </div>
      `,
    };
    await transporter.sendMail(mailOptions);
  } catch (error) {
    logger.error('Error sending listing sold update email:', error.message);
  }
};

module.exports = {
  sendWelcomeEmail,
  sendVerificationEmail,
  sendNewMessageAlert,
  sendMilestoneAlert,
  sendPaymentSuccessfulEmail,
  sendItemSoldEmail,
  sendItemNoLongerAvailableEmail,
};
