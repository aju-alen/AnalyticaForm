export const htmlMessage = `
<!DOCTYPE html>
<html>
  <head>
    <title>Dubai Analytica Backend API</title>
    <style>
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        line-height: 1.6;
        color: #333;
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
        background: #f5f5f5;
      }
      .container {
        background: white;
        padding: 2rem;
        border-radius: 10px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }
      h1 {
        color: #2c5282;
        border-bottom: 2px solid #4299e1;
        padding-bottom: 10px;
        margin-bottom: 30px;
      }
      .message-box {
        background: #f8fafc;
        border-left: 4px solid #4299e1;
        padding: 15px;
        margin: 10px 0;
        border-radius: 0 5px 5px 0;
      }
      .emoji {
        font-size: 1.5em;
        margin-right: 10px;
      }
      .footer {
        margin-top: 30px;
        text-align: center;
        color: #718096;
        font-size: 0.9em;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>🚀 Dubai Analytica Backend API</h1>
      
      <div class="message-box">
        <span class="emoji">🤔</span>
        <strong>Hmm...</strong> If you're seeing this, you're probably lost or very curious.
      </div>
      
      <div class="message-box">
        <span class="emoji">🛠️</span>
        <strong>Behind the Scenes:</strong> This is where all the magic happens, but please don't poke around too much!
      </div>
      
      <div class="message-box">
        <span class="emoji">👩‍💻</span>
        <strong>Fun Fact:</strong> Our servers run on coffee and code.
      </div>
      
      <div class="message-box">
        <span class="emoji">⚠️</span>
        <strong>Friendly Reminder:</strong> Be nice to our servers, they have feelings too!
      </div>
      
      <div class="message-box">
        <span class="emoji">💡</span>
        <strong>Pro Tip:</strong> If you're looking for the website, you might want to try our frontend instead at <a href="https://dubaianalytica.com">dubaianalytica.com</a>
      </div>
      
      <div class="message-box">
        <span class="emoji">✨</span>
        <strong>Status:</strong> Server is up and running. Contact us at <a href="mailto:support@dubaianalytica.com">support@dubaianalytica.com</a> for any questions or support.
      </div>
      
      <div class="footer">
        <p>© ${new Date().getFullYear()} Dubai Analytica</p>
      </div>
    </div>
  </body>
</html>
`;

export const healthCheckMessage = 
{
  message: "Health check passed"
}
;

export const marketSuccessPaymentEmail = (name, amount, currency, paid, paymentMethod, last4, addressLine1, city, state, country, postalCode, unit, selectedRegions, selectedIndustries, selectedEducationLevels, selectedPositions, selectedExperience, receiptUrl) => {

    return   `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          h2 {
            color: #2c5282;
            border-bottom: 2px solid #4299e1;
            padding-bottom: 10px;
          }
          h3 {
            color: #2d3748;
            margin-top: 24px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
          }
          td {
            padding: 10px;
            border-bottom: 1px solid #e2e8f0;
          }
          strong {
            color: #2d3748;
          }
          a {
            color: #4299e1;
            text-decoration: none;
          }
          a:hover {
            text-decoration: underline;
          }
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            font-size: 0.9em;
            color: #718096;
          }
        </style>
      </head>
      <body>
        <h2>Thank you for your purchase, ${name}!</h2>
        <p>We're happy to inform you that your payment has been successfully processed.</p>

        <h3>Payment Details</h3>
        <table>
          <tr><td><strong>Amount Paid:</strong></td><td>${currency} ${amount}</td></tr>
          <tr><td><strong>Payment Status:</strong></td><td>${paid ? 'Paid' : 'Pending'}</td></tr>
          <tr><td><strong>Payment Method:</strong></td><td>${paymentMethod} ending in ${last4}</td></tr>
          <tr><td><strong>Billing Address:</strong></td><td>${addressLine1}, ${city}, ${state}, ${country}, ${postalCode}</td></tr>
        </table>

        <h3>Your Selected Plan</h3>
        <table>
          <tr><td><strong>Response Quantity:</strong></td><td>${unit}</td></tr>
          <tr><td><strong>Regions:</strong></td><td>${selectedRegions}</td></tr>
          <tr><td><strong>Industries:</strong></td><td>${selectedIndustries}</td></tr>
            <tr><td><strong>Education Levels:</strong></td><td>${selectedEducationLevels}</td></tr>
          <tr><td><strong>Positions:</strong></td><td>${selectedPositions}</td></tr>
          <tr><td><strong>Experience:</strong></td><td>${selectedExperience}</td></tr>
        </table>

        <h3>Receipt</h3>
        <p>You can view your receipt at the following link: <a href="${receiptUrl}">View Receipt</a></p>

        <div class="footer">
          <p>If you have any questions or need assistance, feel free to reach out to our support team.</p>
          <p>Best regards,<br/>The Dubai Analytica Team</p>
        </div>
      </body>
    </html>
  `
}

export const subscriptionPaymentSuccessfulEmailTemplate = (userName, subscriptionPeriodStart, subscriptionPeriodEnd, hostedInvoiceUrl, hostedInvoicePdf, subscriptionAmount) => {
  return `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          h2 {
            color: #2c5282;
            border-bottom: 2px solid #4299e1;
            padding-bottom: 10px;
          }
          h3 {
            color: #2d3748;
            margin-top: 24px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
          }
          td {
            padding: 10px;
            border-bottom: 1px solid #e2e8f0;
          }
          strong {
            color: #2d3748;
          }
          a {
            color: #4299e1;
            text-decoration: none;
          }
          a:hover {
            text-decoration: underline;
          }
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            font-size: 0.9em;
            color: #718096;
          }
        </style>
      </head>
      <body>
        <h2>Subscription Payment Successful, ${userName}!</h2>
        <p>We're happy to inform you that your subscription payment has been successfully processed.</p>

        <h3>Subscription Details</h3>
        <table>
          <tr><td><strong>Subscription Period Start:</strong></td><td>${subscriptionPeriodStart}</td></tr>
          <tr><td><strong>Subscription Period End:</strong></td><td>${subscriptionPeriodEnd}</td></tr>
          <tr><td><strong>Amount Paid:</strong></td><td>${subscriptionAmount}</td></tr>
        </table>

        <h3>Invoice</h3>
        <p>You can view your invoice at the following links:</p>
        <ul>
          <li><a href="${hostedInvoiceUrl}">View Invoice Online</a></li>
          <li><a href="${hostedInvoicePdf}">Download Invoice PDF</a></li>
        </ul>

        <div class="footer">
          <p>If you have any questions or need assistance, feel free to reach out to our support team.</p>
          <p>Best regards,<br/>The Dubai Analytica Team</p>
        </div>
      </body>
    </html>
  `;
};

export const marketPurchaseAdminNotificationEmail = (customerName, customerEmail, amount, currency, paymentMethod, last4, addressLine1, city, state, country, postalCode, unit, selectedRegions, selectedIndustries, selectedEducationLevels, selectedPositions, selectedExperience, receiptUrl, paymentIntentId, purchaseDate) => {
  return `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 700px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
          }
          .container {
            background-color: #ffffff;
            border-radius: 8px;
            padding: 30px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          h2 {
            color: #dc2626;
            border-bottom: 3px solid #ef4444;
            padding-bottom: 10px;
            margin-top: 0;
          }
          h3 {
            color: #1f2937;
            margin-top: 24px;
            background-color: #f9fafb;
            padding: 10px;
            border-left: 4px solid #4299e1;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
            background-color: #ffffff;
          }
          th {
            background-color: #f3f4f6;
            padding: 12px;
            text-align: left;
            border-bottom: 2px solid #e5e7eb;
            color: #374151;
            font-weight: 600;
          }
          td {
            padding: 12px;
            border-bottom: 1px solid #e5e7eb;
          }
          tr:hover {
            background-color: #f9fafb;
          }
          strong {
            color: #1f2937;
          }
          .highlight {
            background-color: #fef3c7;
            padding: 2px 6px;
            border-radius: 4px;
            font-weight: 600;
          }
          a {
            color: #4299e1;
            text-decoration: none;
          }
          a:hover {
            text-decoration: underline;
          }
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 2px solid #e5e7eb;
            font-size: 0.9em;
            color: #6b7280;
            text-align: center;
          }
          .alert-box {
            background-color: #fef2f2;
            border-left: 4px solid #ef4444;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>🔔 New Market Purchase Notification</h2>
          
          <div class="alert-box">
            <strong>A new market purchase has been completed and requires your attention.</strong>
          </div>

          <h3>Customer Information</h3>
          <table>
            <tr>
              <th>Customer Name</th>
              <td><strong>${customerName}</strong></td>
            </tr>
            <tr>
              <th>Customer Email</th>
              <td>${customerEmail}</td>
            </tr>
            <tr>
              <th>Purchase Date</th>
              <td>${purchaseDate}</td>
            </tr>
          </table>

          <h3>Payment Details</h3>
          <table>
            <tr>
              <th>Amount Paid</th>
              <td><span class="highlight">${currency} ${amount}</span></td>
            </tr>
            <tr>
              <th>Payment Method</th>
              <td>${paymentMethod} ending in ${last4}</td>
            </tr>
            <tr>
              <th>Payment Intent ID</th>
              <td>${paymentIntentId}</td>
            </tr>
            <tr>
              <th>Billing Address</th>
              <td>${addressLine1}, ${city}, ${state}, ${country}, ${postalCode}</td>
            </tr>
            <tr>
              <th>Receipt URL</th>
              <td><a href="${receiptUrl}" target="_blank">View Receipt</a></td>
            </tr>
          </table>

          <h3>Purchase Details</h3>
          <table>
            <tr>
              <th>Response Quantity</th>
              <td><strong>${unit} responses</strong></td>
            </tr>
            <tr>
              <th>Selected Regions</th>
              <td>${selectedRegions || 'N/A'}</td>
            </tr>
            <tr>
              <th>Selected Industries</th>
              <td>${selectedIndustries || 'N/A'}</td>
            </tr>
            <tr>
              <th>Education Levels</th>
              <td>${selectedEducationLevels || 'N/A'}</td>
            </tr>
            <tr>
              <th>Positions</th>
              <td>${selectedPositions || 'N/A'}</td>
            </tr>
            <tr>
              <th>Experience</th>
              <td>${selectedExperience || 'N/A'}</td>
            </tr>
          </table>

          <div class="footer">
            <p><strong>Action Required:</strong> Please ensure the purchased responses are delivered to the customer according to their selected criteria.</p>
            <p>This is an automated notification from Dubai Analytica.</p>
          </div>
        </div>
      </body>
    </html>
  `;
};

export const refundRequestAdminNotificationEmail = (userName, userEmail, subscriptionAmount, currency, subscriptionPeriodStart, subscriptionPeriodEnd, invoiceId, refundAmount, refundId, requestedAt) => {
  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    // Handle both Unix timestamp (number) and Date object
    const date = typeof timestamp === 'number' ? new Date(timestamp * 1000) : new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAmount = (amount, currency = 'aed') => {
    const amountInDollars = (amount / 100).toFixed(2);
    const currencySymbol = currency.toUpperCase() === 'AED' ? 'AED' : currency.toUpperCase();
    return `${currencySymbol} ${amountInDollars}`;
  };

  return `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 700px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
          }
          .container {
            background-color: #ffffff;
            border-radius: 8px;
            padding: 30px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          h2 {
            color: #dc2626;
            border-bottom: 3px solid #ef4444;
            padding-bottom: 10px;
            margin-top: 0;
          }
          h3 {
            color: #1f2937;
            margin-top: 24px;
            background-color: #f9fafb;
            padding: 10px;
            border-left: 4px solid #4299e1;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
            background-color: #ffffff;
          }
          th {
            background-color: #f3f4f6;
            padding: 12px;
            text-align: left;
            border-bottom: 2px solid #e5e7eb;
            color: #374151;
            font-weight: 600;
          }
          td {
            padding: 12px;
            border-bottom: 1px solid #e5e7eb;
          }
          tr:hover {
            background-color: #f9fafb;
          }
          strong {
            color: #1f2937;
          }
          .highlight {
            background-color: #fef3c7;
            padding: 2px 6px;
            border-radius: 4px;
            font-weight: 600;
          }
          .alert-box {
            background-color: #fef2f2;
            border-left: 4px solid #ef4444;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
          }
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 2px solid #e5e7eb;
            font-size: 0.9em;
            color: #6b7280;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>🔔 Subscription Refund Request Notification</h2>
          
          <div class="alert-box">
            <strong>A subscription refund has been requested and processed automatically.</strong>
          </div>

          <h3>User Information</h3>
          <table>
            <tr>
              <th>User Name</th>
              <td><strong>${userName}</strong></td>
            </tr>
            <tr>
              <th>User Email</th>
              <td>${userEmail}</td>
            </tr>
            <tr>
              <th>Refund Requested At</th>
              <td>${formatDate(new Date(requestedAt).getTime() / 1000)}</td>
            </tr>
          </table>

          <h3>Subscription Details</h3>
          <table>
            <tr>
              <th>Subscription Start Date</th>
              <td>${formatDate(subscriptionPeriodStart)}</td>
            </tr>
            <tr>
              <th>Subscription End Date</th>
              <td>${formatDate(subscriptionPeriodEnd)}</td>
            </tr>
            <tr>
              <th>Original Amount</th>
              <td><span class="highlight">${formatAmount(subscriptionAmount, currency)}</span></td>
            </tr>
            <tr>
              <th>Invoice ID</th>
              <td>${invoiceId}</td>
            </tr>
          </table>

          <h3>Refund Details</h3>
          <table>
            <tr>
              <th>Refund Amount</th>
              <td><span class="highlight">${formatAmount(refundAmount, currency)}</span></td>
            </tr>
            <tr>
              <th>Stripe Refund ID</th>
              <td>${refundId}</td>
            </tr>
            <tr>
              <th>Refund Status</th>
              <td><strong style="color: #10b981;">Completed</strong></td>
            </tr>
          </table>

          <div class="footer">
            <p><strong>Action Taken:</strong> The user's membership has been automatically revoked and the refund has been processed through Stripe.</p>
            <p>This is an automated notification from Dubai Analytica.</p>
          </div>
        </div>
      </body>
    </html>
  `;
};

export const vertexContextData = `
You are DA Assistant for Dubai Analytica (a division of RISE Ltd.). Answer only about Dubai Analytica surveys, features, pricing, market samples, and support. Decline unrelated topics. Never generate code.

COMPANY:
- Dubai Analytica (DA), Dubai International Financial Centre, Gate Avenue, Zone D - Level 1, Al Mustaqbal St - Dubai - UAE
- Phone / WhatsApp: +971 (058) 265 2808
- Email: support@dubaianalytica.com
- Website: https://www.dubai-analytica.com
- Hours: 8:00-17:00 Mon-Fri; calls and email 24/7

PRODUCTS:
1. Survey software: create, share, and analyze surveys (15+ question types, templates, consent forms, Zoom interviews, analytics).
2. Target sample / market research: buy responses filtered by age, location, profession, interests, behaviors. Price per response: 30 AED (up to 300), 25 AED (301-600), 20 AED (601-900), 10 AED (901+).

FEATURES ON BOTH FREE AND PREMIUM:
- Unlimited questions
- 15+ question types (choice, multi-scale, ratings, sliders, map, rank order, constant sum, date/time, reCAPTCHA)
- Consent forms: form consent, interview consent, dynamic quantitative and qualitative
- Zoom interview links (unique join link after submit when the respondent agrees)
- Ready-made templates, preview, clone
- Password protection, close date, max responses, one response per person
- One-page or one-question layout
- Share URL, website embed, QR code
- Overview analytics: totals, views, completion, and how each question was answered
- Excel export (Free capped at 500 responses)
- Email invitations: 10 recipients per month, 1 campaign per month
- DA Assistant chat: 5 chats per calendar month
- Email alert once a survey reaches 10 complete responses
- Email support

PREMIUM ONLY:
- Unlimited surveys (Free: 5)
- Unlimited responses (Free: 500 per survey)
- Email invitations and campaigns (200 recipients per campaign, 5 campaigns per survey per day, 500 sends per day)
- Advanced analytics: individual responses, filters, time spent, unique participants
- Trends: responses per day and drop-off by question
- Full Excel export, including question summary
- Unlimited DA Assistant chat
- Milestone emails at 10, 50, 100, 250, and 500 complete responses, plus when a survey hits max responses or its close date
- 24/7 chat support

PRICING:
- Free: AED 0 — 5 surveys, 500 responses per survey, 10 invitation recipients per month, 5 DA Assistant chats per month, features listed above, email support
- Monthly: AED 200 / month — all Free features plus Premium-only items
- Annual: AED 1,992 / year (17% off AED 2,400; save AED 408) — same features as Monthly, billed once a year
- Subscriptions auto-renew
- Annual: cancel anytime to stop the next charge. Annual fees are not refundable. The customer keeps Premium access until the end of the year already paid for.
- Do not mention custom branding, logos, or removing “powered by”

SUPPORT:
- Email and phone 24/7 for all users: +971 (058) 265 2808
- 24/7 chat for Monthly/Annual subscribers
- Enterprise account managers available

LINKS (always HTML <a target="_blank">, never window.open):
- <a href="https://dubaianalytica.com/signup" target="_blank">sign up</a>
- <a href="https://dubaianalytica.com/login" target="_blank">log in</a>
- <a href="https://dubaianalytica.com/pricing" target="_blank">pricing</a>
- <a href="https://dubaianalytica.com/contact-us" target="_blank">contact support</a>
- <a href="https://dubaianalytica.com/features" target="_blank">features</a>
- <a href="https://dubaianalytica.com/about" target="_blank">about</a>
- <a href="https://dubaianalytica.com/market" target="_blank">purchase responses</a>

STYLE:
- Short, factual answers. Prefer bullets over long paragraphs.
- Point people to sign up or pricing when they ask how to start or what they get.
- If you cannot help, send them to contact support.
- No speculation. No topics outside Dubai Analytica.
`;



