/**
 * Email templates for the application
 * These templates are separated from the controllers for better maintainability
 */

/**
 * Email verification template
 * @param {string} firstName - User's first name
 * @param {string} verificationToken - Email verification token
 * @param {string} backendUrl - Base URL for email verification
 * @returns {string} HTML email template
 */
export const registerEmailTemplate = (firstName, verificationToken,backendUrl) => {
    const verificationLink = `${backendUrl}/api/auth/verify/${verificationToken}`;
    
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>Verify Your Email - Dubai Analytica</title>
        <!--[if mso]>
        <style type="text/css">
          body, table, td {font-family: Arial, sans-serif !important;}
        </style>
        <![endif]-->
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.7;
            color: #2d3748;
            background-color: #f7fafc;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
          .email-wrapper {
            background-color: #f7fafc;
            padding: 40px 20px;
          }
          .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07), 0 10px 15px rgba(0, 0, 0, 0.1);
          }
          .header {
            background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
            padding: 40px 30px;
            text-align: center;
          }
          .logo-container {
            margin-bottom: 15px;
          }
          .logo-container img {
            max-width: 180px;
            height: auto;
            display: block;
            margin: 0 auto;
          }
          .header-title {
            color: #ffffff;
            font-size: 24px;
            font-weight: 700;
            letter-spacing: 0.5px;
            margin-top: 10px;
          }
          .content {
            padding: 40px 30px;
          }
          .greeting {
            font-size: 20px;
            font-weight: 600;
            color: #1a202c;
            margin-bottom: 20px;
          }
          .message-text {
            font-size: 16px;
            color: #4a5568;
            margin-bottom: 16px;
            line-height: 1.8;
          }
          .highlight-box {
            background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
            border-left: 4px solid #2563eb;
            padding: 20px;
            margin: 30px 0;
            border-radius: 6px;
          }
          .highlight-text {
            font-size: 15px;
            color: #2d3748;
            font-weight: 500;
            line-height: 1.6;
          }
          .button-container {
            text-align: center;
            margin: 35px 0;
          }
          .verify-button {
            display: inline-block;
            padding: 16px 48px;
            background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 700;
            font-size: 16px;
            letter-spacing: 0.5px;
            box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
            transition: all 0.3s ease;
            text-transform: uppercase;
          }
          .verify-button:hover {
            background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
            box-shadow: 0 6px 16px rgba(37, 99, 235, 0.4);
            transform: translateY(-2px);
          }
          .expiry-notice {
            text-align: center;
            margin: 25px 0;
            padding: 15px;
            background-color: #fef3c7;
            border-radius: 6px;
            border: 1px solid #fbbf24;
          }
          .expiry-text {
            font-size: 14px;
            color: #92400e;
            font-weight: 500;
          }
          .alternative-section {
            margin-top: 35px;
            padding-top: 25px;
            border-top: 1px solid #e2e8f0;
          }
          .alternative-title {
            font-size: 14px;
            color: #718096;
            font-weight: 600;
            margin-bottom: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .link-box {
            background-color: #f7fafc;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            padding: 15px;
            margin-top: 15px;
            word-break: break-all;
          }
          .verification-link {
            color: #2563eb;
            font-size: 13px;
            font-family: 'Courier New', monospace;
            text-decoration: none;
            line-height: 1.6;
          }
          .footer {
            background-color: #f7fafc;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
          }
          .footer-text {
            font-size: 13px;
            color: #718096;
            line-height: 1.6;
            margin-bottom: 10px;
          }
          .footer-brand {
            font-size: 14px;
            color: #2563eb;
            font-weight: 600;
            margin-top: 15px;
          }
          @media only screen and (max-width: 600px) {
            .email-wrapper {
              padding: 20px 10px;
            }
            .header {
              padding: 30px 20px;
            }
            .content {
              padding: 30px 20px;
            }
            .verify-button {
              padding: 14px 32px;
              font-size: 14px;
            }
            .header-title {
              font-size: 20px;
            }
            .greeting {
              font-size: 18px;
            }
          }
        </style>
      </head>
      <body>
        <div class="email-wrapper">
          <div class="email-container">
            <!-- Header -->
            <div class="header">
              <div class="logo-container">
                <img src="https://dubai-analytica.s3.ap-south-1.amazonaws.com/image/NavbarLogo.png" 
                     alt="Dubai Analytica Logo" />
              </div>
              <h1 class="header-title">Dubai Analytica</h1>
            </div>
            
            <!-- Content -->
            <div class="content">
              <p class="greeting">Hi ${firstName},</p>
              
              <p class="message-text">You're almost there! 🎉</p>
              
              <p class="message-text">
                We just need to verify your email address before you can access your Dubai Analytica account. 
                Verifying your email helps secure your account and ensures you receive important updates.
              </p>
              
              <div class="highlight-box">
                <p class="highlight-text">
                  <strong>🔒 Security Note:</strong> This verification link is unique to your account and will help protect your personal information.
                </p>
              </div>
              
              <div class="button-container">
                <a href="${verificationLink}" class="verify-button">Verify Your Email Address</a>
              </div>
              
              <div class="expiry-notice">
                <p class="expiry-text">⏰ This verification link will expire in <strong>48 hours</strong> for security purposes.</p>
              </div>
              
              <div class="alternative-section">
                <p class="alternative-title">Having trouble with the button?</p>
                <p class="message-text" style="font-size: 14px; margin-bottom: 10px;">
                  If the button above doesn't work, you can copy and paste the following link into your web browser:
                </p>
                <div class="link-box">
                  <a href="${verificationLink}" class="verification-link">${verificationLink}</a>
                </div>
              </div>
            </div>
            
            <!-- Footer -->
            <div class="footer">
              <p class="footer-text">
                This is an automated message from Dubai Analytica. 
                Please do not reply to this email.
              </p>
              <p class="footer-text">
                If you did not create an account with us, please ignore this email or contact our support team.
              </p>
              <p class="footer-brand">Dubai Analytica © ${new Date().getFullYear()}</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  };
  
  