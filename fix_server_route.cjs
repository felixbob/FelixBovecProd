const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

if (!code.includes('app.post("/.netlify/functions/contact", contactHandler);')) {
  code = code.replace(
    'app.post("/api/contact", contactHandler);',
    'app.post("/api/contact", contactHandler);\n  app.post("/.netlify/functions/contact", contactHandler);'
  );
  fs.writeFileSync('server.ts', code);
}
