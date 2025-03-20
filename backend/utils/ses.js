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

const generateSiteOwnerEmail = (opportunity, interestedUser) => {
  return `
    <h2>New Interest in Your Site</h2>
    <p>Someone has expressed interest in your site:</p>
    <hr>
    <h3>Site Details:</h3>
    <ul>
      <li><strong>Site Name:</strong> ${opportunity.site_name}</li>
      <li><strong>Site Address:</strong> ${opportunity.site_address}</li>
      <li><strong>Number of Plots:</strong> ${opportunity.plots}</li>
    </ul>
    <h3>Interested Party Details:</h3>
    <ul>
      <li><strong>Name:</strong> ${interestedUser.name}</li>
      <li><strong>Email:</strong> ${interestedUser.email}</li>
      <li><strong>Organization:</strong> ${
        interestedUser.organization || "Not specified"
      }</li>
    </ul>
    <p>Please follow up with the interested party at your earliest convenience.</p>
    <hr>
    <p><small>This is an automated message from FGB Acumen Opportunities Hub.</small></p>
  `;
};

const generateAdminEmail = (opportunity, interestedUser) => {
  return `
    <h2>New Site Interest Notification</h2>
    <p>A new interest has been registered in the following site:</p>
    <hr>
    <h3>Site Details:</h3>
    <ul>
      <li><strong>Site Name:</strong> ${opportunity.site_name}</li>
      <li><strong>Site Address:</strong> ${opportunity.site_address}</li>
      <li><strong>Developer:</strong> ${opportunity.developer_name}</li>
      <li><strong>Number of Plots:</strong> ${opportunity.plots}</li>
    </ul>
    <h3>Site Owner:</h3>
    <ul>
      <li><strong>Email:</strong> ${opportunity.user_email}</li>
    </ul>
    <h3>Interested Party Details:</h3>
    <ul>
      <li><strong>Name:</strong> ${interestedUser.name}</li>
      <li><strong>Email:</strong> ${interestedUser.email}</li>
      <li><strong>Organization:</strong> ${
        interestedUser.organization || "Not specified"
      }</li>
    </ul>
    <hr>
    <p><small>This is an automated message from FGB Acumen Opportunities Hub.</small></p>
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
