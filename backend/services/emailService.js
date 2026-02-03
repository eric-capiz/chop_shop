const { Resend } = require("resend");
const { format } = require("date-fns");

const resend = new Resend(process.env.RESEND_API_KEY);

// Sender: display name + address. Change the address below if your domain is different; it must be verified in Resend.
const FROM_EMAIL = "Chop Shop <bookings@chopshop.com>";
const CHOP_SHOP_PHONE = "915-257-1446";

function formatStatus(status) {
  const map = {
    pending: "Pending",
    confirmed: "Confirmed",
    cancelled: "Cancelled",
    rejected: "Rejected",
    "reschedule-pending": "Reschedule Pending",
    "reschedule-confirmed": "Reschedule Confirmed",
    "reschedule-rejected": "Reschedule Rejected",
    completed: "Completed",
    "no-show": "No-Show",
  };
  return map[status] || status;
}

/**
 * Build subject and HTML body for the single dynamic appointment email.
 * @param {Object} data - { barberName, barberEmail, userName, userEmail, serviceName, date, timeSlot, status, notes, recipientRole }
 */
function buildAppointmentEmail(data) {
  const {
    barberName,
    barberEmail,
    userName,
    userEmail,
    serviceName,
    date,
    timeSlot,
    status,
    notes = null,
    recipientRole,
  } = data;

  const statusDisplay = formatStatus(status);
  const dateDisplay = date ? format(new Date(date), "EEEE, MMMM d, yyyy") : "";
  const timeDisplay =
    timeSlot && timeSlot.start && timeSlot.end
      ? `${format(new Date(timeSlot.start), "h:mm a")} – ${format(
          new Date(timeSlot.end),
          "h:mm a"
        )}`
      : "";

  const showNotes =
    (status === "rejected" || status === "reschedule-rejected") && notes;

  const generalNote =
    recipientRole === "barber"
      ? "Please log in to update the appointment status."
      : "If you need to make any changes, please do so through the website.";

  const subject = `Appointment Info: ${statusDisplay}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="font-family: sans-serif; line-height: 1.5; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h2 style="margin-top: 0;">Appointment Details</h2>
  <p><strong>Barber:</strong> ${barberName || "—"}</p>
  <p><strong>User:</strong> ${userName || "—"}</p>
  <p><strong>Service:</strong> ${serviceName || "—"}</p>
  <p><strong>Date:</strong> ${dateDisplay}</p>
  <p><strong>Time:</strong> ${timeDisplay}</p>
  <p><strong>Status:</strong> ${statusDisplay}</p>
  ${showNotes ? `<p><strong>Notes:</strong> ${notes}</p>` : ""}
  <p style="margin-top: 24px;">${generalNote}</p>
  <hr style="border: none; border-top: 1px solid #ddd; margin: 24px 0;">
  <p style="font-size: 14px; color: #666;">
    For any questions, please reach out to:<br>
    Chop Shop: ${CHOP_SHOP_PHONE}<br>
    ${barberName || ""}<br>
    ${barberEmail || ""}
  </p>
</body>
</html>
`.trim();

  return { subject, html };
}

/**
 * Send one appointment email. Does not throw; logs errors.
 * @param {string} to - Recipient email
 * @param {'user'|'barber'} recipientRole - For general note and behavior
 * @param {Object} appointmentData - Same shape as buildAppointmentEmail data
 * @returns {Promise<{ success: boolean, error?: string }>}
 */
async function sendAppointmentEmail(to, recipientRole, appointmentData) {
  if (!to || !recipientRole || !appointmentData) {
    console.error(
      "[emailService] sendAppointmentEmail: missing to, recipientRole, or appointmentData"
    );
    return { success: false, error: "Missing required params" };
  }
  if (!process.env.RESEND_API_KEY) {
    console.error("[emailService] RESEND_API_KEY is not set");
    return { success: false, error: "RESEND_API_KEY not set" };
  }
  try {
    const { subject, html } = buildAppointmentEmail({
      ...appointmentData,
      recipientRole,
    });
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject,
      html,
    });
    if (error) {
      console.error("[emailService] Resend error:", error);
      return { success: false, error: error.message };
    }
    return { success: true, id: data?.id };
  } catch (err) {
    console.error("[emailService] sendAppointmentEmail error:", err);
    return { success: false, error: err.message };
  }
}

module.exports = {
  buildAppointmentEmail,
  sendAppointmentEmail,
};
