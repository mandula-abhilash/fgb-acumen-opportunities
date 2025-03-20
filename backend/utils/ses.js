import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const sesClient = new SESClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

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

const emailStyles = `
  <style>
    /* Reset styles */
    body, table, td, div, p, a { font-family: Arial, sans-serif; line-height: 1.5; }
    
    /* Responsive container */
    .container {
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #ffffff;
    }
    
    /* Header styles */
    .header {
      background-color: #F09C00;
      color: white;
      padding: 20px;
      text-align: center;
      border-radius: 8px 8px 0 0;
    }
    
    .header h2 {
      margin: 0;
      font-size: 24px;
      color: white;
    }
    
    /* Content styles */
    .content {
      padding: 20px;
      background-color: #f8f9fa;
      border-radius: 0 0 8px 8px;
    }
    
    /* Section styles */
    .section {
      background-color: white;
      padding: 15px;
      margin-bottom: 15px;
      border-radius: 6px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }
    
    .section-title {
      color: #F09C00;
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 10px;
      border-bottom: 2px solid #F09C00;
      padding-bottom: 5px;
    }
    
    /* List styles */
    .info-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    
    .info-list li {
      padding: 8px 0;
      border-bottom: 1px solid #eee;
    }
    
    .info-list li:last-child {
      border-bottom: none;
    }
    
    /* Label styles */
    .label {
      font-weight: bold;
      color: #555;
      margin-right: 5px;
    }
    
    /* Footer styles */
    .footer {
      text-align: center;
      padding-top: 20px;
      color: #666;
      font-size: 12px;
    }
    
    /* Responsive design */
    @media screen and (max-width: 600px) {
      .container { width: 100% !important; padding: 10px !important; }
      .header { padding: 15px !important; }
      .content { padding: 15px !important; }
      .section { padding: 10px !important; }
    }
  </style>
`;

const generateSiteOwnerEmail = (opportunity, interestedUser) => {
  return `
    ${emailStyles}
    <div class="container">
      <div class="header">
        <h2>New Interest in Your Site</h2>
      </div>
      
      <div class="content">
        <div class="section">
          <div class="section-title">Site Details</div>
          <ul class="info-list">
            <li><span class="label">Site Name:</span> ${
              opportunity.site_name
            }</li>
            <li><span class="label">Site Address:</span> ${
              opportunity.site_address
            }</li>
            <li><span class="label">Number of Plots:</span> ${
              opportunity.plots
            }</li>
          </ul>
        </div>

        <div class="section">
          <div class="section-title">Interested Party Details</div>
          <ul class="info-list">
            <li><span class="label">Name:</span> ${interestedUser.name}</li>
            <li><span class="label">Email:</span> ${interestedUser.email}</li>
            <li><span class="label">Organization:</span> ${
              interestedUser.organization || "Not specified"
            }</li>
          </ul>
        </div>

        <div class="section">
          <p style="margin: 0;">Please follow up with the interested party at your earliest convenience.</p>
        </div>

        <div class="footer">
          <p>This is an automated message from FGB Acumen Opportunities Hub.</p>
        </div>
      </div>
    </div>
  `;
};

const generateAdminEmail = (opportunity, interestedUser) => {
  return `
    ${emailStyles}
    <div class="container">
      <div class="header">
        <h2>New Site Interest Notification</h2>
      </div>
      
      <div class="content">
        <div class="section">
          <div class="section-title">Site Details</div>
          <ul class="info-list">
            <li><span class="label">Site Name:</span> ${
              opportunity.site_name
            }</li>
            <li><span class="label">Site Address:</span> ${
              opportunity.site_address
            }</li>
            <li><span class="label">Developer:</span> ${
              opportunity.developer_name
            }</li>
            <li><span class="label">Number of Plots:</span> ${
              opportunity.plots
            }</li>
          </ul>
        </div>

        <div class="section">
          <div class="section-title">Site Owner Details</div>
          <ul class="info-list">
            <li><span class="label">Name:</span> ${
              opportunity.owner?.name || "Not specified"
            }</li>
            <li><span class="label">Email:</span> ${opportunity.user_email}</li>
          </ul>
        </div>

        <div class="section">
          <div class="section-title">Interested Party Details</div>
          <ul class="info-list">
            <li><span class="label">Name:</span> ${interestedUser.name}</li>
            <li><span class="label">Email:</span> ${interestedUser.email}</li>
            <li><span class="label">Organization:</span> ${
              interestedUser.organization || "Not specified"
            }</li>
          </ul>
        </div>

        <div class="footer">
          <p>This is an automated message from FGB Acumen Opportunities Hub.</p>
        </div>
      </div>
    </div>
  `;
};

export const sendInterestNotification = async (opportunity, interestedUser) => {
  const adminEmails = process.env.ADMIN_EMAILS?.split(",")
    .map((email) => email.trim())
    .filter((email) => email && email !== opportunity.user_email); // Remove site owner from admin list if they're an admin

  // Send email to site owner
  const ownerSubject = `Interest Shown in ${opportunity.site_name}`;
  const ownerHtml = generateSiteOwnerEmail(opportunity, interestedUser);
  await sendEmail(opportunity.user_email, ownerSubject, ownerHtml);

  // Send email to admins if there are any valid admin emails
  if (adminEmails.length > 0) {
    const adminSubject = `[Admin] New Interest - ${opportunity.site_name}`;
    const adminHtml = generateAdminEmail(opportunity, interestedUser);
    await sendEmail(adminEmails, adminSubject, adminHtml);
  }
};
