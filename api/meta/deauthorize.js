export default function handler(req, res) {
  res.setHeader('cache-control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  return res.status(200).json({
    ok: true,
    data_deletion_url: 'https://auto-sales-growth-system.vercel.app/api/meta/data-deletion'
  });
}