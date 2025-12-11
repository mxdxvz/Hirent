const nodemailer = require('nodemailer');

// Validate required environment variables
const validateEmailConfig = () => {
  const requiredVars = ['EMAIL_HOST', 'EMAIL_PORT', 'EMAIL_USER', 'EMAIL_PASSWORD'];
  const missing = requiredVars.filter(v => !process.env[v]);
  
  if (missing.length > 0) {
    console.warn(`[EMAIL SERVICE] Missing environment variables: ${missing.join(', ')}`);
    return false;
  }
  return true;
};

// Create transporter
const createTransporter = () => {
  if (!validateEmailConfig()) {
    console.error('[EMAIL SERVICE] Email configuration incomplete. Email sending will fail.');
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

const transporter = createTransporter();

/**
 * Send owner email verification email
 * @param {string} email - Owner's email address
 * @param {string} verificationToken - JWT token for verification
 * @param {string} ownerName - Owner's name
 * @returns {Promise<boolean>} - Success status
 */
const sendOwnerVerificationEmail = async (email, verificationToken, ownerName = 'Owner') => {
  try {
    if (!transporter) {
      console.error('[EMAIL SERVICE] Transporter not configured. Cannot send email.');
      return false;
    }

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const verificationLink = `${frontendUrl}/verify-email?token=${verificationToken}`;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #7A1CA9 0%, #9D4EDD 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .header h1 { margin: 0; font-size: 28px; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .greeting { font-size: 16px; margin-bottom: 20px; }
            .message { font-size: 14px; color: #555; margin-bottom: 30px; line-height: 1.8; }
            .button-container { text-align: center; margin: 30px 0; }
            .verify-button {
              display: inline-block;
              background: linear-gradient(135deg, #7A1CA9 0%, #9D4EDD 100%);
              color: white;
              padding: 14px 40px;
              text-decoration: none;
              border-radius: 6px;
              font-weight: 600;
              font-size: 16px;
              transition: transform 0.2s;
            }
            .verify-button:hover { transform: scale(1.05); }
            .link-section { margin: 20px 0; padding: 15px; background: white; border-left: 4px solid #7A1CA9; }
            .link-section p { margin: 5px 0; font-size: 13px; }
            .link-section a { color: #7A1CA9; text-decoration: none; word-break: break-all; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #999; text-align: center; }
            .warning { background: #fff3cd; border: 1px solid #ffc107; padding: 12px; border-radius: 4px; margin: 20px 0; font-size: 13px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Verify Your Hirent Account</h1>
            </div>
            <div class="content">
              <div class="greeting">
                Hi ${ownerName},
              </div>
              <div class="message">
                <p>Thank you for completing your owner setup on Hirent! To activate your account and start listing items, please verify your email address by clicking the button below.</p>
                <p>This verification link will expire in <strong>24 hours</strong>.</p>
              </div>
              <div class="button-container">
                <a href="${verificationLink}" class="verify-button">Verify Email Address</a>
              </div>
              <div class="link-section">
                <p><strong>Or copy and paste this link in your browser:</strong></p>
                <a href="${verificationLink}">${verificationLink}</a>
              </div>
              <div class="warning">
                <strong>⚠️ Security Notice:</strong> If you did not create this account, please ignore this email. Do not share this link with anyone.
              </div>
              <div class="message" style="margin-top: 30px; font-size: 13px; color: #999;">
                <p>This is an automated message. Please do not reply to this email.</p>
              </div>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Hirent. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verify Your Hirent Owner Account',
      html: htmlContent,
      text: `Hi ${ownerName},\n\nPlease verify your email by visiting: ${verificationLink}\n\nThis link expires in 24 hours.\n\nHirent Team`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('[EMAIL SERVICE] Verification email sent successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error('[EMAIL SERVICE] Error sending verification email:', error.message);
    return false;
  }
};

/**
 * Send welcome email to new owner
 * @param {string} email - Owner's email address
 * @param {string} ownerName - Owner's name
 * @returns {Promise<boolean>} - Success status
 */
const sendWelcomeEmail = async (email, ownerName = 'Owner') => {
  try {
    if (!transporter) {
      console.error('[EMAIL SERVICE] Transporter not configured. Cannot send email.');
      return false;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #7A1CA9 0%, #9D4EDD 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .header h1 { margin: 0; font-size: 28px; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .greeting { font-size: 16px; margin-bottom: 20px; }
            .message { font-size: 14px; color: #555; margin-bottom: 20px; line-height: 1.8; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #999; text-align: center; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Hirent!</h1>
            </div>
            <div class="content">
              <div class="greeting">
                Hi ${ownerName},
              </div>
              <div class="message">
                <p>Welcome to the Hirent community! Your owner account has been successfully created and verified.</p>
                <p>You can now start listing your items and earning money by renting them out to our community of renters.</p>
                <p><strong>Next steps:</strong></p>
                <ul>
                  <li>Complete your profile with payment details</li>
                  <li>Add your first item listing</li>
                  <li>Set your rental rates and availability</li>
                  <li>Start accepting bookings!</li>
                </ul>
              </div>
              <div class="message" style="margin-top: 30px; font-size: 13px; color: #999;">
                <p>If you have any questions, please contact our support team.</p>
              </div>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Hirent. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Welcome to Hirent - Your Account is Ready!',
      html: htmlContent,
      text: `Hi ${ownerName},\n\nWelcome to Hirent! Your account is ready to use. Start listing your items today!\n\nHirent Team`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('[EMAIL SERVICE] Welcome email sent successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error('[EMAIL SERVICE] Error sending welcome email:', error.message);
    return false;
  }
};

module.exports = {
  sendOwnerVerificationEmail,
  sendWelcomeEmail,
};
