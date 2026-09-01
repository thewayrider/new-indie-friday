export default {
  name: 'resourceArticle',
  title: 'Resource Article',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'author',
      title: 'Author',
      type: 'string',
      description: 'Original author of the article (optional)',
    },
    {
      name: 'originalSourceName',
      title: 'Original Source Name',
      type: 'string',
      description: 'e.g., Daily Maverick (optional)',
    },
    {
      name: 'originalSourceUrl',
      title: 'Original Source URL',
      type: 'url',
      description: 'Link to the full article (optional)',
    },
    {
      name: 'externalCoverImageUrl',
      title: 'External Cover Image URL',
      type: 'url',
      description: 'Optional. Paste a link to the original image here to avoid downloading and hosting it yourself.',
    },
    {
      name: 'teaser',
      title: 'Teaser',
      type: 'text',
      rows: 3,
      description: 'Shown on the listing page',
      validation: (Rule) => Rule.required().max(300),
    },
    {
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [
        {
          type: 'block',
          marks: {
            annotations: [
              {
                name: 'externalLink',
                title: 'External link',
                type: 'object',
                fields: [
                  {
                    name: 'href',
                    title: 'URL',
                    type: 'url',
                    validation: (Rule) =>
                      Rule.uri({ scheme: ['http', 'https'] }),
                  },
                ],
              },
            ],
          },
        },
        {
          type: 'image',
          options: { hotspot: true }
        }
      ],
      validation: (Rule) => Rule.required(),
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'publishedAt',
      media: 'coverImage',
    },
  },
}
