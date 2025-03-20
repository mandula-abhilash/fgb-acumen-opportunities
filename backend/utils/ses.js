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
    const command = new SendEmailCommand({
      Source: process.env.SES_EMAIL_FROM,
      Destination: { ToAddresses: Array.isArray(to) ? to : [to] },
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

export const sendInterestNotification = async (opportunity, interestedUser) => {
  const adminEmails = process.env.ADMIN_EMAILS?.split(",") || [];
  const allRecipients = [opportunity.user_email, ...adminEmails];

  const subject = `Interest Shown in ${opportunity.site_name}`;
  const html = `
    <h2>New Interest in Site Opportunity</h2>
    <p>A user has shown interest in the following site:</p>
    <hr>
    <h3>Site Details:</h3>
    <ul>
      <li><strong>Site Name:</strong> ${opportunity.site_name}</li>
      <li><strong>Site Address:</strong> ${opportunity.site_address}</li>
      <li><strong>Developer:</strong> ${opportunity.developer_name}</li>
      <li><strong>Number of Plots:</strong> ${opportunity.plots}</li>
    </ul>
    <h3>Interested User Details:</h3>
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

  await sendEmail(allRecipients, subject, html);
};
