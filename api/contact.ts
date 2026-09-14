// Vercel Serverless Function: POST /api/contact
// Sends contact form submissions securely to abdullahazaam1505@gmail.com

export default async function handler(req: any, res: any) {
  // Set CORS and preflight headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed. Only POST requests are accepted.' });
    return;
  }

  try {
    const { name, email, message } = req.body || {};

    // 1. Validate Name
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      res.status(400).json({ error: 'Please enter your name.' });
      return;
    }
    if (name.trim().length > 100) {
      res.status(400).json({ error: 'Name must be 100 characters or fewer.' });
      return;
    }

    // 2. Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
      res.status(400).json({ error: 'Please enter a valid email address.' });
      return;
    }
    if (email.trim().length > 100) {
      res.status(400).json({ error: 'Email must be 100 characters or fewer.' });
      return;
    }

    // 3. Validate Message
    if (!message || typeof message !== 'string' || message.trim().length < 5) {
      res.status(400).json({ error: 'Please enter a message with at least 5 characters.' });
      return;
    }
    if (message.trim().length > 5000) {
      res.status(400).json({ error: 'Message must be 5,000 characters or fewer.' });
      return;
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const cleanMessage = message.trim();
    const TO_EMAIL = 'abdullahazaam1505@gmail.com';

    // Verify Environment Configuration
    const resendApiKey = process.env.RESEND_API_KEY;

    if (!resendApiKey) {
      console.error('[API/Contact] Missing RESEND_API_KEY environment variable.');
      res.status(500).json({
        error: 'Email delivery service is not configured. Please add RESEND_API_KEY in Vercel project environment variables.',
      });
      return;
    }

    // Default sender or custom verified domain
    const fromAddress = process.env.FROM_EMAIL || 'Portfolio Contact <onboarding@resend.dev>';

    // Send email using Resend REST API (zero extra dependencies required)
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [TO_EMAIL],
        reply_to: cleanEmail,
        subject: `Portfolio Message from ${cleanName}`,
        text: `New message from portfolio contact form:\n\nName: ${cleanName}\nEmail: ${cleanEmail}\n\nMessage:\n${cleanMessage}\n\nSent from: https://abdullahazaam-portfolio.vercel.app/`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0c0c0c; border: 1px solid #262626; border-radius: 16px; overflow: hidden; color: #ffffff;">
            <div style="background: linear-gradient(90deg, #E50914, #B80710); padding: 24px; text-align: left;">
              <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 700; letter-spacing: -0.02em;">New Portfolio Contact Message</h1>
              <p style="color: rgba(255,255,255,0.85); margin: 6px 0 0 0; font-size: 13px;">Abdullah Azaam Portfolio</p>
            </div>
            <div style="padding: 24px;">
              <div style="margin-bottom: 20px;">
                <span style="display: block; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #a3a3a3; margin-bottom: 4px;">Sender Name</span>
                <p style="margin: 0; font-size: 16px; font-weight: 600; color: #ffffff;">${cleanName}</p>
              </div>
              <div style="margin-bottom: 20px;">
                <span style="display: block; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #a3a3a3; margin-bottom: 4px;">Sender Email</span>
                <a href="mailto:${cleanEmail}" style="margin: 0; font-size: 15px; color: #E50914; text-decoration: none; font-weight: 500;">${cleanEmail}</a>
              </div>
              <div style="margin-bottom: 20px;">
                <span style="display: block; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #a3a3a3; margin-bottom: 8px;">Message</span>
                <div style="background-color: #141414; border: 1px solid #262626; border-radius: 10px; padding: 16px; color: #e5e5e5; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${cleanMessage}</div>
              </div>
              <div style="border-top: 1px solid #262626; padding-top: 16px; margin-top: 24px;">
                <p style="margin: 0; font-size: 12px; color: #737373;">
                  You can reply directly to this email to respond to <strong style="color: #a3a3a3;">${cleanName}</strong> at ${cleanEmail}.
                </p>
              </div>
            </div>
          </div>
        `,
      }),
    });

    const resendData = await resendResponse.json();

    if (!resendResponse.ok) {
      console.error('[API/Contact] Resend API Error:', resendData);
      res.status(resendResponse.status || 500).json({
        error: resendData?.message || 'Failed to dispatch email. Please try again later.',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Your message has been sent successfully.',
      id: resendData?.id,
    });
  } catch (error: any) {
    console.error('[API/Contact] Unexpected server error:', error);
    res.status(500).json({
      error: 'An unexpected server error occurred. Please try again or reach out directly by email.',
    });
  }
}
