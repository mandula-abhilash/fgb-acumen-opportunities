import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import dotenv from "dotenv";

dotenv.config();

const sesClient = new SESClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Email styles using table-based layout for better email client compatibility
const emailStyles = `
  <style type="text/css">
    /* Client-specific styles */
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; }

    /* Reset styles */
    img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    table { border-collapse: collapse !important; }
    body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; }

    /* iOS blue links */
    a[x-apple-data-detectors] {
      color: inherit !important;
      text-decoration: none !important;
      font-size: inherit !important;
      font-family: inherit !important;
      font-weight: inherit !important;
      line-height: inherit !important;
    }

    /* Custom styles */
    .container {
      background-color: #ffffff;
      padding: 20px;
      max-width: 600px;
      margin: 0 auto;
    }

    .header {
      background-color: #F09C00;
      padding: 20px;
      border-radius: 8px 8px 0 0;
      text-align: center;
    }

    .header h2 {
      color: #ffffff;
      font-family: Arial, sans-serif;
      font-size: 24px;
      font-weight: bold;
      margin: 0;
      line-height: 1.4;
    }

    .content {
      background-color: #f8f9fa;
      padding: 20px;
      border-radius: 0 0 8px 8px;
    }

    .section {
      background-color: #ffffff;
      padding: 15px;
      margin-bottom: 15px;
      border-radius: 6px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }

    .section-title {
      color: #F09C00;
      font-family: Arial, sans-serif;
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 10px;
      padding-bottom: 5px;
      border-bottom: 2px solid #F09C00;
    }

    .info-list {
      list-style-type: none;
      padding: 0;
      margin: 0;
    }

    .info-list li {
      padding: 8px 0;
      border-bottom: 1px solid #eeeeee;
      font-family: Arial, sans-serif;
      font-size: 14px;
      line-height: 1.6;
    }

    .info-list li:last-child {
      border-bottom: none;
    }

    .label {
      font-weight: bold;
      color: #555555;
      margin-right: 5px;
    }

    .footer {
      text-align: center;
      padding-top: 20px;
      color: #666666;
      font-family: Arial, sans-serif;
      font-size: 12px;
    }

    /* Mobile styles */
    @media screen and (max-width: 600px) {
      .container {
        width: 100% !important;
        padding: 10px !important;
      }
      .header {
        padding: 15px !important;
      }
      .content {
        padding: 15px !important;
      }
      .section {
        padding: 10px !important;
      }
    }
  </style>
`;

const formatDate = (date) => {
  if (!date) return "Not specified";
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const generateAdminNotificationEmail = (site, user) => {
  const paymentStatus = site.is_paid ? "Paid" : "Pending Payment";

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      ${emailStyles}
    </head>
    <body style="margin: 0; padding: 0; background-color: #f8f9fa;">
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td align="center" style="padding: 20px 0;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" class="container">
              <tr>
                <td class="header">
                  <h2>New Assisted Site Submission</h2>
                </td>
              </tr>
              <tr>
                <td class="content">
                  <div class="section">
                    <div class="section-title">Site Details</div>
                    <ul class="info-list">
                      <li><span class="label">Site Name:</span> ${
                        site.site_name
                      }</li>
                      <li><span class="label">Site Address:</span> ${
                        site.site_address
                      }</li>
                      <li><span class="label">Custom Address:</span> ${
                        site.custom_site_address
                      }</li>
                      <li><span class="label">Opportunity Type:</span> ${
                        site.opportunity_type
                      }</li>
                      <li><span class="label">Number of Plots:</span> ${
                        site.plots
                      }</li>
                      <li><span class="label">Status:</span> ${site.status}</li>
                      <li><span class="label">Payment Status:</span> ${paymentStatus}</li>
                    </ul>
                  </div>

                  <div class="section">
                    <div class="section-title">Contact Information</div>
                    <ul class="info-list">
                      <li><span class="label">Contact Email:</span> ${
                        site.contact_email
                      }</li>
                      <li><span class="label">Contact Phone:</span> ${
                        site.contact_phone || "Not provided"
                      }</li>
                      <li><span class="label">Queries Contact:</span> ${
                        site.queries_contact_name
                      }</li>
                    </ul>
                  </div>

                  <div class="section">
                    <div class="section-title">Response Details</div>
                    <ul class="info-list">
                      <li><span class="label">Initial EOI Date:</span> ${formatDate(
                        site.initial_eoi_date
                      )}</li>
                      <li><span class="label">Bid Submission Date:</span> ${formatDate(
                        site.bid_submission_date
                      )}</li>
                      <li><span class="label">Manage Bids Process:</span> ${
                        site.manage_bids_process ? "Yes" : "No"
                      }</li>
                    </ul>
                  </div>

                  <div class="section">
                    <div class="section-title">Submitter Details</div>
                    <ul class="info-list">
                      <li><span class="label">Name:</span> ${user.name}</li>
                      <li><span class="label">Email:</span> ${user.email}</li>
                      <li><span class="label">Business Name:</span> ${
                        user.businessName || "Not specified"
                      }</li>
                    </ul>
                  </div>

                  <div class="footer">
                    <p>This is an automated message from FGB Acumen Opportunities Hub.</p>
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};

export const sendEmail = async (to, subject, html) => {
  try {
    // Filter out any invalid email addresses
    const validEmails = Array.isArray(to)
      ? to.filter((email) => email && email.includes("@"))
      : [to].filter((email) => email && email.includes("@"));

    if (validEmails.length === 0) {
      throw new Error("No valid email addresses provided");
    }

    const command = new SendEmailCommand({
      Source: process.env.SES_EMAIL_FROM,
      Destination: { ToAddresses: validEmails },
      Message: {
        Subject: { Data: subject },
        Body: { Html: { Data: html } },
      },
    });
    await sesClient.send(command);
  } catch (error) {
    console.error("Email sending error:", error);
    throw new Error("Failed to send email.");
  }
};

export const sendAdminNotifications = async (site, user) => {
  const adminEmails = process.env.ADMIN_EMAILS?.split(",").map((email) =>
    email.trim()
  );

  if (!adminEmails?.length) {
    console.warn("No admin emails configured");
    return;
  }

  const subject = `New Assisted Site Submission: ${site.site_name}`;
  const html = generateAdminNotificationEmail(site, user);

  // Send individual emails to each admin
  for (const adminEmail of adminEmails) {
    if (adminEmail) {
      try {
        await sendEmail(adminEmail, subject, html);
      } catch (error) {
        console.error(`Failed to send notification to ${adminEmail}:`, error);
      }
    }
  }
};
