// the-double-take/schemaTypes/article.js

export default {
  name: 'article',
  title: 'Archive Posts',
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
      initialValue: (new Date()).toISOString(),
    },
    {
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
    },
    {
      name: 'threadPost',
      title: 'The Post That Started This',
      type: 'text',
      rows: 4,
      description: 'Paste your original Threads post here. Edit for clarity — this appears as the social card at the top of the article.',
    },
    {
      name: 'threadUrl',
      title: 'Threads Post URL',
      type: 'url',
      description: 'Paste the direct link to the original Threads post.',
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
      of: [{ type: 'block' }],
    },

    // ── Organisation ─────────────────────────────────────────
    {
      name: 'featured',
      title: 'Featured Article',
      type: 'boolean',
      description: 'Toggle on to display this article in the Hero section on the homepage.',
      initialValue: false,
    },
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
      description: 'Add keywords to help organise and filter Deep Dives (e.g. "Federal Reserve", "Macro", "Liquidity").',
    },
    {
      name: 'readTime',
      title: 'Read Time (minutes)',
      type: 'number',
      description: 'Estimated reading time in minutes (e.g. 8). Displayed on article cards and at the top of the article.',
    },

    {
  name: 'archived',
  title: 'Archived',
  type: 'boolean',
  description: 'Toggle on to hide this Deep Dive from the listing page. It remains in Sanity and accessible via direct URL.',
  initialValue: false,
},

    // ── Author ───────────────────────────────────────────────
    {
      name: 'author',
      title: 'Author',
      type: 'object',
      fields: [
        {
          name: 'name',
          title: 'Name',
          type: 'string',
          initialValue: 'Kim Robert Rampling',
        },
        {
          name: 'handle',
          title: 'Social Handle',
          type: 'string',
          initialValue: '@kimrampling',
        },
        {
          name: 'bio',
          title: 'Short Bio',
          type: 'text',
          rows: 2,
        },
      ],
    },

    // ── SEO ──────────────────────────────────────────────────
    {
      name: 'seo',
      title: 'SEO',
      type: 'object',
      description: 'Controls how this article appears in Google and when shared on social media.',
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
          description: 'Recommended: 150–160 characters. This appears under your link in Google search results.',
        },
        {
          name: 'shareImage',
          title: 'Social Share Image',
          type: 'image',
          description: 'Recommended: 1200×630px. This is the image shown when the article is shared on social media.',
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