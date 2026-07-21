import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

export async function sendBookingNotification(message: string) {
  await client.messages.create({
    body: message,
    from: process.env.TWILIO_WHATSAPP_NUMBER!,
    to: process.env.ADMIN_WHATSAPP!,
  });
}