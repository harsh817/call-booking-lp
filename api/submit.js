module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = req.body;
  if (!body || !body.name || !body.phone) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const webhookUrl = process.env.BOOST_WEBHOOK_URL;
  if (!webhookUrl) {
    return res.status(500).json({ error: 'Server misconfigured' });
  }

  try {
    const upstream = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!upstream.ok) throw new Error('Upstream ' + upstream.status);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Webhook error:', err.message);
    return res.status(502).json({ error: 'Webhook delivery failed' });
  }
};
