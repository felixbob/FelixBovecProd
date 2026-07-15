const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);
resend.emails.send({
  from: process.env.RESEND_FROM_EMAIL || "info@felix-bovec.si",
  to: "felix@komuskic.com",
  subject: "Test",
  text: "Test"
}).then(console.log).catch(console.error);
