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

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export default async function handler(req, res) {
  // CORS support for requests from Sanity Studio or local dev
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { broadcastId, isTest = false, secret } = req.body || {};
    if (!broadcastId) {
      return res.status(400).json({ error: 'broadcastId is required' });
    }

    // Fetch newsletter settings for admin email, sender, and secret
    const settings = await sanityClient.fetch(
      `*[_type == "newsletterSettings"][0]{adminTestEmail, senderEmail, broadcastSecret}`
    );

    const configuredSecret = settings?.broadcastSecret || process.env.BROADCAST_SECRET;
    if (configuredSecret) {
      const authHeader = req.headers.authorization;
      const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
      if (secret !== configuredSecret && bearerToken !== configuredSecret) {
        return res.status(401).json({ error: 'Unauthorized broadcast request' });
      }
    }

    const cleanId = broadcastId.replace(/^drafts\./, '');
    const draftId = `drafts.${cleanId}`;

    // Fetch the broadcast document with referenced music/spotlight data (favoring most recent draft/published version)
    const broadcast = await sanityClient.fetch(
      `*[_type == "broadcastEmail" && (_id == $draftId || _id == $cleanId)] | order(_updatedAt desc)[0]{
        _id,
        title,
        campaignType,
        customSubject,
        editorialOption,
        editorialMessage,
        status,
        releaseRef->{
          songTitle,
          artistName,
          releaseDate,
          slug,
          trackEmbedCode,
          "coverImageUrl": mainImage.asset->url
        },
        spotlightRef->{
          artistName,
          albumSubtitle,
          featureCategory,
          genre,
          slug,
          excerpt,
          "coverImageUrl": mainImage.asset->url
        }
      }`,
      { cleanId, draftId }
    );

    if (!broadcast) {
      return res.status(404).json({ error: 'Broadcast campaign not found' });
    }

    if (!isTest && broadcast.status === 'sent') {
      return res.status(400).json({ error: 'This campaign has already been sent to subscribers' });
    }

    const fromAddress = settings?.senderEmail || process.env.RESEND_FROM_EMAIL || 'kim@streamusique.com';
    const fromHeader = `New Indie Friday <${fromAddress}>`;

    // Determine subject line
    let subject = broadcast.customSubject?.trim();
    if (!subject) {
      if (broadcast.campaignType === 'single') {
        const title = broadcast.releaseRef?.songTitle || 'New Music';
        const artist = broadcast.releaseRef?.artistName || 'Indie Artist';
        subject = `New Single: ${title} by ${artist}`;
      } else if (broadcast.campaignType === 'album') {
        const title = broadcast.releaseRef?.songTitle || 'New Album';
        const artist = broadcast.releaseRef?.artistName || 'Indie Artist';
        subject = `New Album: ${title} by ${artist}`;
      } else if (broadcast.campaignType === 'spotlight') {
        const artist = broadcast.spotlightRef?.artistName || 'Featured Artist';
        subject = `Featured Spotlight: ${artist}`;
      } else {
        subject = broadcast.title || 'New Indie Friday Update';
      }
    }

    if (isTest) {
      subject = `[PREVIEW TEST] ${subject}`;
    }

    // Determine recipient list
    let recipients = [];
    const adminEmail = settings?.adminTestEmail || 'kim@streamusique.com';

    if (isTest) {
      recipients = [adminEmail];
    } else {
      const subscribers = await sanityClient.fetch(`*[_type == "subscriber"]{email}`);
      recipients = (subscribers || []).map((sub) => sub.email).filter(Boolean);

      if (recipients.length === 0) {
        return res.status(200).json({ success: true, count: 0, message: 'No subscribers found to send to' });
      }
    }

    // Format editorial message if present
    const formattedEditorial = broadcast.editorialMessage
      ? escapeHtml(broadcast.editorialMessage).replace(/\n/g, '<br />')
      : '';

    // Build the music card layout
    let musicCardHtml = '';
    const siteUrl = 'https://www.streamusique.com';

    if (broadcast.campaignType === 'single' || broadcast.campaignType === 'album') {
      const songTitle = escapeHtml(broadcast.releaseRef?.songTitle || 'New Release');
      const artistName = escapeHtml(broadcast.releaseRef?.artistName || 'Indie Artist');
      const slug = broadcast.releaseRef?.slug?.current || '';
      const releaseUrl = slug ? `${siteUrl}/new-releases/${slug}` : siteUrl;
      const coverImg = broadcast.releaseRef?.coverImageUrl;
      const typeLabel = broadcast.campaignType === 'album' ? 'New Album / EP' : 'New Single Release';

      musicCardHtml = `
        <div style="background-color: #ffffff; padding: 28px; border: 2px solid #111111; margin: 24px 0; text-align: center;">
          <span style="font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #666666; display: block; margin-bottom: 12px;">${typeLabel}</span>
          ${coverImg ? `<img src="${coverImg}" alt="${songTitle}" style="max-width: 280px; width: 100%; height: auto; border-radius: 4px; margin-bottom: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.08);" />` : ''}
          <h2 style="font-size: 26px; margin: 0 0 8px 0; color: #111111; font-weight: 800; line-height: 1.2;">${songTitle}</h2>
          <p style="font-size: 17px; color: #444444; margin: 0 0 24px 0; letter-spacing: 0.5px;">by <strong style="color: #000000;">${artistName}</strong></p>
          <a href="${releaseUrl}" style="display: inline-block; background-color: #111111; color: #ffffff; padding: 14px 28px; text-decoration: none; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; font-size: 13px; border-radius: 3px;">Listen to the Music &rarr;</a>
        </div>
      `;
    } else if (broadcast.campaignType === 'spotlight') {
      const artistName = escapeHtml(broadcast.spotlightRef?.artistName || 'Featured Artist');
      const subtitle = escapeHtml(broadcast.spotlightRef?.albumSubtitle || broadcast.spotlightRef?.featureCategory || broadcast.spotlightRef?.genre || '');
      const excerpt = escapeHtml(broadcast.spotlightRef?.excerpt || '');
      const slug = broadcast.spotlightRef?.slug?.current || '';
      const spotlightUrl = slug ? `${siteUrl}/spotlight/${slug}` : siteUrl;
      const coverImg = broadcast.spotlightRef?.coverImageUrl;

      musicCardHtml = `
        <div style="background-color: #ffffff; padding: 28px; border: 2px solid #111111; margin: 24px 0; text-align: center;">
          <span style="font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #666666; display: block; margin-bottom: 12px;">Artist Spotlight</span>
          ${coverImg ? `<img src="${coverImg}" alt="${artistName}" style="max-width: 280px; width: 100%; height: auto; border-radius: 4px; margin-bottom: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.08);" />` : ''}
          <h2 style="font-size: 26px; margin: 0 0 8px 0; color: #111111; font-weight: 800; line-height: 1.2;">${artistName}</h2>
          ${subtitle ? `<p style="font-size: 14px; color: #666666; margin: 0 0 16px 0; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">${subtitle}</p>` : ''}
          ${excerpt ? `<p style="font-size: 15px; color: #444444; line-height: 1.6; margin: 0 0 24px 0; text-align: left; padding: 0 10px;">${excerpt}</p>` : ''}
          <a href="${spotlightUrl}" style="display: inline-block; background-color: #111111; color: #ffffff; padding: 14px 28px; text-decoration: none; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; font-size: 13px; border-radius: 3px;">Explore Spotlight Feature &rarr;</a>
        </div>
      `;
    }

    const showEditorial =
      broadcast.campaignType === 'editorial' ||
      (broadcast.editorialOption === 'custom' && formattedEditorial);

    const editorialHtml = showEditorial
      ? `
        <div style="background-color: #ffffff; padding: 24px 28px; border-left: 4px solid #111111; margin: 20px 0; text-align: left; line-height: 1.7; color: #333333; font-size: 15px;">
          ${formattedEditorial}
        </div>
      `
      : '';

    const testBanner = isTest
      ? `
        <div style="background-color: #fef3c7; border: 1px solid #f59e0b; padding: 12px; margin-bottom: 20px; border-radius: 4px; text-align: center; font-size: 13px; font-weight: bold; color: #92400e;">
          [TEST PREVIEW] This email was sent only to ${adminEmail}. Not sent to live subscribers.
        </div>
      `
      : '';

    const fullHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${escapeHtml(subject)}</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
          <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f4f5; padding: 30px 10px;">
            <tr>
              <td align="center">
                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border: 1px solid #e4e4e7; padding: 32px 24px; text-align: left;">
                  <tr>
                    <td>
                      ${testBanner}
                      <div style="text-align: center; border-bottom: 2px solid #111111; padding-bottom: 16px; margin-bottom: 24px;">
                        <h1 style="margin: 0; font-size: 20px; letter-spacing: 3px; text-transform: uppercase; color: #111111; font-weight: 900;">New Indie Friday</h1>
                        <p style="margin: 4px 0 0 0; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #71717a;">Curated Independent Music Discovery</p>
                      </div>

                      ${editorialHtml}
                      ${musicCardHtml}

                      <div style="text-align: center; border-top: 1px solid #e4e4e7; padding-top: 24px; margin-top: 32px; font-size: 12px; color: #71717a; line-height: 1.6;">
                        <p style="margin: 0 0 8px 0;">You received this email because you subscribed to <a href="${siteUrl}" style="color: #111111; text-decoration: underline;">New Indie Friday</a>.</p>
                        <p style="margin: 0;">Happy listening from Kim &amp; the Team at New Indie Friday!</p>
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;

    // Send emails via Resend
    if (isTest) {
      const { data, error } = await resend.emails.send({
        from: fromHeader,
        to: [adminEmail],
        subject: subject,
        html: fullHtml,
      });

      if (error) {
        console.error('Resend Test Email Error:', error);
        return res.status(500).json({ error: 'Failed to send preview test email', details: error.message });
      }

      await sanityClient
        .patch(broadcast._id)
        .set({ lastTestSentAt: new Date().toISOString() })
        .commit();

      return res.status(200).json({
        success: true,
        isTest: true,
        sentTo: adminEmail,
        data,
      });
    } else {
      // Chunk recipients in batches of 50 to respect Resend Bcc limits
      const CHUNK_SIZE = 50;
      for (let i = 0; i < recipients.length; i += CHUNK_SIZE) {
        const chunk = recipients.slice(i, i + CHUNK_SIZE);
        const { error } = await resend.emails.send({
          from: fromHeader,
          to: [fromAddress],
          bcc: chunk,
          subject: subject,
          html: fullHtml,
        });

        if (error) {
          console.error('Resend Broadcast Error (chunk):', error);
          return res.status(500).json({ error: 'Failed to send broadcast emails', details: error.message });
        }
      }

      await sanityClient
        .patch(broadcast._id)
        .set({
          status: 'sent',
          sentAt: new Date().toISOString(),
          sentCount: recipients.length,
        })
        .commit();

      return res.status(200).json({
        success: true,
        isTest: false,
        recipientCount: recipients.length,
      });
    }
  } catch (error) {
    console.error('Broadcast API Handler Error:', error);
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}
