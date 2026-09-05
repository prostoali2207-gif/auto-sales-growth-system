export default function handler(req, res) {
  res.status(200).setHeader('content-type', 'text/html; charset=utf-8');
  res.send(`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Al Musafir Cars Social API Terms</title>
  <style>
    body{font-family:Arial,sans-serif;max-width:820px;margin:40px auto;padding:0 20px;line-height:1.6;color:#111}
    h1,h2{line-height:1.25}
  </style>
</head>
<body>
  <h1>Terms of Use — Al Musafir Cars Social API</h1>
  <p>Last updated: 5 September 2026</p>
  <p>This application is operated by Al Musafir Cars for management of its own Facebook Page and Instagram professional account through Meta's official APIs.</p>
  <h2>Permitted use</h2>
  <p>The application is intended for authorized business administration, content management, moderation, account operations and handling business inquiries.</p>
  <h2>Platform terms</h2>
  <p>Use of Facebook and Instagram through this application remains subject to Meta's applicable platform terms, policies and permissions.</p>
  <h2>Availability</h2>
  <p>The application may be changed, suspended or discontinued as operational requirements or platform capabilities change.</p>
  <h2>Contact</h2>
  <p>For questions about these terms, contact Al Musafir Cars through Instagram @almusafircars or WhatsApp +971 50 978 6337.</p>
</body>
</html>`);
}
