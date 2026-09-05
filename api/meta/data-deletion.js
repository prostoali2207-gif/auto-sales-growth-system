export default function handler(req, res) {
  res.status(200).setHeader('content-type', 'text/html; charset=utf-8');
  res.send(`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Al Musafir Cars Data Deletion Instructions</title>
  <style>
    body{font-family:Arial,sans-serif;max-width:820px;margin:40px auto;padding:0 20px;line-height:1.6;color:#111}
    h1,h2{line-height:1.25}
  </style>
</head>
<body>
  <h1>Data Deletion Instructions — Al Musafir Cars Social API</h1>
  <p>Last updated: 5 September 2026</p>

  <p>If you want information associated with this application deleted, send a deletion request to Al Musafir Cars through Instagram @almusafircars or WhatsApp +971 50 978 6337.</p>

  <p>Include enough information for us to identify the relevant interaction or account. Do not send passwords or authentication codes.</p>

  <p>After verification, data controlled by Al Musafir Cars and no longer required for legal, security or operational reasons will be deleted or anonymized.</p>

  <p>Data held independently by Meta is governed by Meta's own deletion and privacy processes.</p>
</body>
</html>`);
}
