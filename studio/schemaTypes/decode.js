export default {
  name: 'decode',
  title: 'The Decode',
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
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'body',
      title: 'Body Text',
      type: 'array',
      of: [{ type: 'block' }],
    },

    // ── Organisation ─────────────────────────────────────────
    {
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      description: 'Toggle on to feature this Decode on the homepage.',
      initialValue: false,
    },
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
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
      ],
    },

    // ── SEO ──────────────────────────────────────────────────
    {
      name: 'seo',
      title: 'SEO',
      type: 'object',
      description: 'Controls how this Decode appears in Google and when shared on social media.',
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
      media: 'coverImage',
    },
  },
}