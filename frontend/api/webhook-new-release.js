import { createClient } from '@sanity/client';
import { Resend } from 'resend';

const sanityClient = createClient({
  projectId: process.env.VITE_SANITY_PROJECT_ID || 'oeemrqux',
  dataset: process.env.VITE_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Basic webhook secret verification
    // You can set SANITY_WEBHOOK_SECRET in Vercel to protect this route
    const authHeader = req.headers.authorization;
    if (process.env.SANITY_WEBHOOK_SECRET && authHeader !== `Bearer ${process.env.SANITY_WEBHOOK_SECRET}`) {
       return res.status(401).json({ error: 'Unauthorized' });
    }

    const release = req.body;
    
    // We only care about new releases that have a slug
    if (!release || !release.slug || !release.slug.current || !release.songTitle || !release.artistName) {
      return res.status(400).json({ error: 'Invalid payload' });
    }

    // 1. Fetch all subscribers from Sanity
    const subscribers = await sanityClient.fetch(`*[_type == "subscriber"]{email}`);
    
    if (!subscribers || subscribers.length === 0) {
      return res.status(200).json({ message: 'No subscribers to notify' });
    }

    // 2. Prepare the email list
    const emails = subscribers.map(sub => sub.email).filter(Boolean);

    // 3. Build the beautiful HTML email layout
    // No risky iframe embeds, just clean HTML
    const releaseUrl = `https://www.streamusique.com/new-releases/${release.slug.current}`;
    
    const htmlBody = `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 40px 20px; text-align: center; border: 1px solid #eaeaea;">
        <h2 style="margin-top: 0; font-size: 24px; color: #111; text-transform: uppercase; letter-spacing: 2px;">A New Indie Song Release!</h2>
        <div style="background-color: #fff; padding: 30px; border: 2px solid #000; margin: 30px 0;">
          <h3 style="font-size: 28px; margin: 0 0 10px 0; color: #000;">${release.songTitle}</h3>
          <p style="font-size: 16px; color: #555; margin: 0 0 20px 0; letter-spacing: 1px;">by <strong style="color: #000;">${release.artistName}</strong></p>
          <a href="${releaseUrl}" style="display: inline-block; background-color: #000; color: #fff; padding: 15px 30px; text-decoration: none; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; font-size: 14px; border: 1px solid #000;">Listen to the Music</a>
        </div>
        <p style="font-size: 12px; color: #888; margin-top: 30px;">
          You received this email because you subscribed to New Indie Friday.<br>
          Happy listening from Kim & the Team!
        </p>
      </div>
    `;

    // 4. Send using Resend
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'kim@streamusique.com';
    
    // Resend allows sending to an array of up to 50 Bcc emails in one call
    // For larger lists, you'd chunk this array.
    const { data, error } = await resend.emails.send({
      from: `New Indie Friday <${fromEmail}>`,
      to: [`${fromEmail}`], // Send to self
      bcc: emails,          // Bcc all subscribers to protect privacy
      subject: `New Release: ${release.songTitle} by ${release.artistName}`,
      html: htmlBody,
    });

    if (error) {
      console.error('Resend Webhook API Error:', error);
      return res.status(500).json({ error: 'Failed to send emails via Resend', details: error.message });
    }

    return res.status(200).json({ success: true, count: emails.length });
  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
