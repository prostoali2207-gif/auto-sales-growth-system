export default function handler(req, res) {
  res.status(200).setHeader('content-type', 'text/html; charset=utf-8');
  res.send(`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Al Musafir Cars Privacy Policy</title>
  <style>
    body{font-family:Arial,sans-serif;max-width:820px;margin:40px auto;padding:0 20px;line-height:1.6;color:#111}
    h1,h2{line-height:1.25}
  </style>
</head>
<body>
  <h1>Privacy Policy — Al Musafir Cars Social API</h1>
  <p>Last updated: 5 September 2026</p>

  <p>Al Musafir Cars uses this application to manage its own Facebook Page and Instagram professional account through Meta's official APIs.</p>

  <h2>Information we may process</h2>
  <p>The application may process account identifiers, profile information, posts, comments, messages, engagement data and other information made available through permissions granted by Meta for the connected business accounts.</p>

  <h2>How information is used</h2>
  <p>Information is used only for operating and managing Al Musafir Cars social media activity, including publishing content, moderating interactions, handling business inquiries, reviewing account activity and maintaining the connected business profiles.</p>

  <h2>Sharing</h2>
  <p>We do not sell personal information. Information may be processed by service providers required to operate the application and by Meta according to Meta's own platform terms and privacy policies.</p>

  <h2>Retention</h2>
  <p>Information is retained only for as long as reasonably necessary for the business purpose for which it was obtained, legal obligations, security, troubleshooting or platform operation.</p>

  <h2>Data deletion</h2>
  <p>To request deletion of information associated with this application, follow the instructions at <a href="/api/meta/data-deletion">Data Deletion Instructions</a>.</p>

  <h2>Contact</h2>
  <p>For privacy questions or deletion requests, contact Al Musafir Cars through Instagram @almusafircars or WhatsApp +971 50 978 6337.</p>
</body>
</html>`);
}
