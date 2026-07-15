import { Handler } from "@netlify/functions";
import { Resend } from "resend";
import { Webhook } from "svix";

const handler: Handler = async (event, context) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const secret = process.env.RESEND_WEBHOOK_SECRET;
  let payload = event.body || "";

  if (event.isBase64Encoded) {
    payload = Buffer.from(payload, "base64").toString("utf-8");
  }

  let msg: any;

  if (!secret) {
    console.log("Resend Webhook received (unverified, missing secret).");
    try {
      msg = JSON.parse(payload);
    } catch (e) {
      return { statusCode: 400, body: "Invalid JSON" };
    }
  } else {
    try {
      const wh = new Webhook(secret);
      msg = wh.verify(payload, event.headers as Record<string, string>) as any;
      console.log("Verified Resend webhook:", msg.type);
    } catch (err) {
      console.error("Webhook verification failed:", err);
      return { statusCode: 400, body: "Webhook verification failed" };
    }
  }

  try {
    if (msg.type === "email.received" || msg.type === "email.inbound") {
      const inboundData = msg.data;
      if (inboundData) {
        const apiKey = process.env.RESEND_API_KEY || "re_BB4DQfR7_JrdAQ7j7W9FNd1av74bWstGU";
        const resend = new Resend(apiKey);
        const fromEmail = process.env.RESEND_FROM_EMAIL || "info@felix-bovec.si";
        const ownerEmail = "felix@gmail.com";
        const sender = inboundData.from || "Neznan pošiljatelj";
        const originalTo = Array.isArray(inboundData.to) ? inboundData.to.join(", ") : inboundData.to || "vas naslov";

        await resend.emails.send({
          from: fromEmail,
          to: [ownerEmail],
          replyTo: sender,
          subject: `[Posredovano - ${originalTo}] ${inboundData.subject || 'Brez zadeve'}`,
          text: `Posredovano od: ${sender}\n\n${inboundData.text || ''}`,
          html: inboundData.html ? `<div><small>Posredovano od: <b>${sender}</b></small></div><hr/><br/>${inboundData.html}` : undefined
        });
        console.log("Inbound email forwarded successfully to", ownerEmail);
      }
    }
    return { statusCode: 200, body: "OK" };
  } catch (err) {
    console.error("Webhook forwarding failed:", err);
    return { statusCode: 500, body: "Failed" };
  }
};

export { handler };
