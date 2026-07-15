import * as React from "react";
import { Handler } from "@netlify/functions";
import { Resend } from "resend";

const handler: Handler = async (event, context) => {
  // Only allow POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    let rawBody = event.body || "{}";
    if (event.isBase64Encoded) {
      rawBody = Buffer.from(rawBody, "base64").toString("utf-8");
    }
    const { name, email, phone, message } = JSON.parse(rawBody);

    // Initialize Resend
    const apiKey = process.env.RESEND_API_KEY || "re_BB4DQfR7_JrdAQ7j7W9FNd1av74bWstGU";
    const resend = new Resend(apiKey);

    const fromEmail = process.env.RESEND_FROM_EMAIL || "info@felix-bovec.si";
    const toEmail = "felix@komuskic.com";

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      subject: `Novo sporočilo s spletne strani - ${name}`,
      text: `
        Ime: ${name}
        E-pošta: ${email}
        Telefon: ${phone}
        
        Sporočilo:
        ${message}
      `,
    });

    if (error) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: error.message || JSON.stringify(error) }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ data }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to send message." }),
    };
  }
};

export { handler };
