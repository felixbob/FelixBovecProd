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
    console.log("Parsed message type:", msg?.type);
    if (msg.type === "email.received" || msg.type === "email.inbound") {
      const inboundData = msg.data;
      if (inboundData) {
        const apiKey = process.env.RESEND_API_KEY;
        console.log("Initializing Resend with key configured:", !!apiKey);
        
        const resend = new Resend(apiKey || undefined);
        const fromEmail = process.env.RESEND_FROM_EMAIL || "info@felix-bovec.si";
        const ownerEmail = process.env.RESEND_TO_EMAIL || "felix@komuskic.com";
        const sender = inboundData.from || "Neznan pošiljatelj";
        const originalTo = Array.isArray(inboundData.to) ? inboundData.to.join(", ") : inboundData.to || "vas naslov";

        console.log(`Forwarding email from=${fromEmail} to=${ownerEmail} (original sender=${sender}, original recipient=${originalTo})`);

        const response = await resend.emails.send({
          from: fromEmail,
          to: [ownerEmail],
          replyTo: sender,
          subject: `[Posredovano - ${originalTo}] ${inboundData.subject || 'Brez zadeve'}`,
          text: `Posredovano od: ${sender}\n\n${inboundData.text || ''}`,
          html: inboundData.html ? `<div><small>Posredovano od: <b>${sender}</b></small></div><hr/><br/>${inboundData.html}` : undefined
        });

        if (response.error) {
          console.error("Resend API failed to forward the email:", response.error);
          return { 
            statusCode: 500, 
            body: JSON.stringify({ 
              success: false, 
              error: response.error.message || "Resend error",
              details: response.error
            }) 
          };
        }

        console.log("Inbound email forwarded successfully! ID:", response.data?.id);
      } else {
        console.warn("No inbound data found in payload data block.");
      }
    } else {
      console.log(`Received non-inbound event type: ${msg.type}. Skipping forwarding.`);
    }
    return { statusCode: 200, body: "OK" };
  } catch (err: any) {
    console.error("Webhook forwarding crashed with exception:", err);
    return { 
      statusCode: 500, 
      body: JSON.stringify({ 
        success: false, 
        error: "Internal Server Error", 
        message: err.message 
      }) 
    };
  }
};

export { handler };
