import { createClient } from '@sanity/client';
import { Resend } from 'resend';

// Initialize Sanity Client with a write token
const sanityClient = createClient({
  projectId: process.env.VITE_SANITY_PROJECT_ID || 'oeemrqux', // fallback to your actual ID
  dataset: process.env.VITE_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false, // We want fresh data for settings
});

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { email } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email is required' });
    }

    // 1. Check if subscriber already exists
    const existingSubscriber = await sanityClient.fetch(
      `*[_type == "subscriber" && email == $email][0]`,
      { email }
    );

    if (existingSubscriber) {
      // If already subscribed, just return success so the user sees a success message
      return res.status(200).json({ success: true, message: 'Already subscribed' });
    }

    // 2. Save subscriber to Sanity
    await sanityClient.create({
      _type: 'subscriber',
      email: email,
      subscribedAt: new Date().toISOString(),
    });

    // 3. Fetch Newsletter Settings from Sanity
    const settings = await sanityClient.fetch(`*[_type == "newsletterSettings"][0]`);
    
    const subject = settings?.welcomeEmailSubject || 'Welcome to New Indie Friday Music!';
    const body = settings?.welcomeEmailBody || 'Thanks for subscribing to these new Indie music releases.\n\nHappy listening from Kim & the Team at New Indie Music!';

    // 4. Send the Welcome Email via Resend
    // Important: Resend requires a verified domain to send 'from'. 
    // You must set RESEND_FROM_EMAIL to something like 'kim@streamusique.com'
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'kim@streamusique.com'; // Replace with your verified Resend email

    await resend.emails.send({
      from: `New Indie Friday <${fromEmail}>`,
      to: [email],
      subject: subject,
      text: body,
    });

    // Return Success
    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('Subscription error:', error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message || String(error) });
  }
}
