import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { Resend } from "resend";
import dotenv from "dotenv";
import compression from "compression";

dotenv.config({ override: true });

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Optimize bandwidth with compression
  app.use(compression());

  // Redirect HTTP to HTTPS in production
  app.use((req, res, next) => {
    if (process.env.NODE_ENV === "production" && req.headers["x-forwarded-proto"] === "http") {
      return res.redirect(308, `https://${req.headers.host}${req.url}`);
    }
    next();
  });

  app.use(express.json());

  // Security headers
  app.use((req, res, next) => {
    const scriptSrc = process.env.NODE_ENV === "production" ? "'self'" : "'self' 'unsafe-inline' 'unsafe-eval'";
    res.setHeader(
      "Content-Security-Policy",
      `default-src 'self'; script-src ${scriptSrc}; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; connect-src 'self' wss: https:; frame-src 'self' https://maps.google.com https://www.google.com; frame-ancestors 'self'; require-trusted-types-for 'script';`
    );
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
    res.setHeader("X-Frame-Options", "SAMEORIGIN");
    res.setHeader("X-Content-Type-Options", "nosniff");
    next();
  });

  // Wait to initialize resend dynamically so server doesn't crash on boot if env var isn't set
  let resendArgs: Resend | null = null;
  const getResend = () => {
    if (!resendArgs) {
      const apiKey = process.env.RESEND_API_KEY;
      resendArgs = new Resend(apiKey);
    }
    return resendArgs;
  };

  const contactHandler = async (req: express.Request, res: express.Response) => {
    try {
      const { name, email, phone, message } = req.body;
      
      const resend = getResend();
      if (!resend) {
        return res.status(500).json({ error: "Napaka: API ključ za Resend (RESEND_API_KEY) ni nastavljen ali pa ni veljaven." });
      }

      const fromEmail = process.env.RESEND_FROM_EMAIL || "info@felix-bovec.si";
      const toEmail = "felix@komuskic.com";

      if (!fromEmail) {
        return res.status(500).json({ error: "Server is not configured for email sending (Missing FROM email)." });
      }

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
        let errorMsg = error.message || JSON.stringify(error);
        if (errorMsg.includes("API key is invalid") || errorMsg.includes("Missing API")) {
           errorMsg = "Napaka: API ključ za Resend (RESEND_API_KEY) ni veljaven. Preverite nastavitve.";
        }
        return res.status(400).json({ error: errorMsg });
      }

      res.status(200).json({ data });
    } catch (error) {
      res.status(500).json({ error: "Failed to send message." });
    }
  };

  const webhookHandler = async (req: express.Request, res: express.Response) => {
    try {
      console.log("Received webhook payload:", req.body);
      const resend = getResend();
      if (!resend) {
        return res.status(500).json({ error: "Resend is not configured." });
      }

      // Check if it's an inbound email payload or event payload
      const payload = req.body.type === "email.received" && req.body.data ? req.body.data : req.body;

      const { from, to, subject, html, text } = payload;
      const fromEmail = process.env.RESEND_FROM_EMAIL || "info@felix-bovec.si";
      const toEmail = process.env.RESEND_TO_EMAIL || "felix@komuskic.com";

      // Prepare forwarded email content
      const forwardedSubject = `FWD: ${subject || "Brez zadeve"}`;
      const sender = from || "Neznan pošiljatelj";
      const forwardedText = `
Zadeva: ${subject || "Brez zadeve"}
Od: ${sender}
Za: ${Array.isArray(to) ? to.join(", ") : to || "Neznano"}

-------------------------------------------

${text || ""}
      `;
      const forwardedHtml = `
<div>
  <small>Posredovano od: <b>${sender}</b></small><br/>
  <small>Prvotno poslano na: ${Array.isArray(to) ? to.join(", ") : to || "Neznano"}</small>
</div>
<hr />
${html ? html : text ? `<p>${text}</p>` : ""}
      `;

      console.log(`Forwarding email from=${fromEmail} to=${toEmail} (original sender=${sender})`);

      const { data, error } = await resend.emails.send({
        from: fromEmail,
        to: [toEmail],
        replyTo: sender,
        subject: forwardedSubject,
        text: forwardedText,
        html: forwardedHtml,
      });

      if (error) {
        console.error("Webhook forwarding error:", error);
        return res.status(400).json({ error: error.message });
      }

      console.log("Forwarded successfully:", data);
      res.status(200).json({ success: true, data });
    } catch (error) {
      console.error("Webhook processing error:", error);
      res.status(500).json({ error: "Failed to process webhook." });
    }
  };

  // API routes FIRST
  app.post("/api/contact", contactHandler);
  app.post("/.netlify/functions/contact", contactHandler);
  app.post("/api/webhook/resend", webhookHandler);
  app.post("/.netlify/functions/resend-webhook", webhookHandler);

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
