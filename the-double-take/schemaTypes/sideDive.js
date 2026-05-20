// the-double-take/schemaTypes/sideDive.js

export default {
  name: 'sideDive',
  title: 'Side Dives',
  type: 'document',
  fields: [
    // ── Core Fields ──────────────────────────────────────────
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
    },
    {
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    },
    {
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      description: 'A short summary shown on the listing page above the article body.',
    },
    {
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'body',
      title: 'Body Content',
      type: 'array',
      of: [
        { type: 'block' },
        // ── Inline Video Embed ──
        {
          type: 'object',
          name: 'videoEmbed',
          title: 'Video Embed',
          fields: [
            {
              name: 'url',
              title: 'Video URL',
              type: 'url',
              description: 'Paste a YouTube or Vimeo URL. e.g. https://www.youtube.com/watch?v=XXXXX',
            },
            {
              name: 'caption',
              title: 'Caption',
              type: 'string',
              description: 'Optional caption shown below the video.',
            },
          ],
          preview: {
            select: { title: 'url', subtitle: 'caption' },
            prepare({ title, subtitle }) {
              return {
                title: subtitle || 'Video Embed',
                subtitle: title,
              };
            },
          },
        },
      ],
    },

    // ── Organisation ─────────────────────────────────────────
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
      description: 'Add keywords to help organise Side Dives (e.g. "Fed", "China", "Energy").',
    },
    {
      name: 'readTime',
      title: 'Read Time (minutes)',
      type: 'number',
      description: 'Estimated reading time in minutes.',
    },
    {
      name: 'archived',
      title: 'Archived',
      type: 'boolean',
      description: 'Toggle on to hide this piece from the Side Dives listing page. It remains in Sanity and accessible via direct URL.',
      initialValue: false,
    },

    // ── SEO ──────────────────────────────────────────────────
    {
      name: 'seo',
      title: 'SEO',
      type: 'object',
      description: 'Controls how this piece appears in Google and when shared on social media.',
      fields: [
        {
          name: 'metaTitle',
          title: 'Meta Title',
          type: 'string',
          description: 'Recommended: 50–60 characters. Leave blank to use the article title.',
        },
        {
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'text',
          rows: 3,
          description: 'Recommended: 150–160 characters.',
        },
        {
          name: 'shareImage',
          title: 'Social Share Image',
          type: 'image',
          description: 'Recommended: 1200×630px.',
          options: { hotspot: true },
        },
      ],
    },
  ],

  // ── Studio Preview ───────────────────────────────────────
  preview: {
    select: {
      title: 'title',
      subtitle: 'excerpt',
      media: 'mainImage',
      archived: 'archived',
    },
    prepare({ title, subtitle, media, archived }) {
      return {
        title: archived ? `[ARCHIVED] ${title}` : title,
        subtitle,
        media,
      };
    },
  },
}