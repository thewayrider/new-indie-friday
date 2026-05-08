// the-double-take/schemaTypes/wireSignal.js

export default {
  name: 'wireSignal',
  title: 'Live Feed (Ticker)',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Headline',
      type: 'string',
      description: 'The punchy signal headline that scrolls in the ticker strip.',
      validation: Rule => Rule.required().max(120)
    },
    {
      name: 'threadText',
      title: 'Original Threads Post Text',
      type: 'text',
      rows: 4,
      description: 'Paste the full text of the original Threads post. Shown in the popover preview on the site.'
    },
    {
      name: 'threadsUrl',
      title: 'Threads Post URL',
      type: 'url',
      description: 'Direct URL to the original Threads post. Enables the popover and "View on Threads ↗" link.',
      validation: Rule => Rule.uri({ scheme: ['https'] })
    },
    {
      name: 'linkType',
      title: 'Links To',
      type: 'string',
      description: 'Optional — what type of content does this headline relate to? Leave blank if not yet linked.',
      options: {
        list: [
          { title: 'None — standalone signal', value: 'none' },
          { title: 'Deep Dive Article', value: 'deepDive' },
          { title: 'Video', value: 'video' }
        ],
        layout: 'radio'
      }
    },
    {
      name: 'internalLink',
      title: 'Internal Link',
      type: 'reference',
      to: [
        { type: 'article' },
        { type: 'videoShort' }
      ],
      description: 'Optional — link to the Deep Dive or Video this headline refers to. Leave blank if not yet published.',
      options: { disableNew: true }
    },
    {
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      description: 'Used to order entries in the ticker (newest first).',
      initialValue: () => new Date().toISOString()
    }
  ],
  preview: {
    select: { title: 'title', subtitle: 'linkType' },
    prepare({ title, subtitle }) {
      return {
        title: title || 'Untitled signal',
        subtitle: subtitle === 'deepDive' ? '→ Deep Dive'
          : subtitle === 'video' ? '→ Video'
          : '→ Standalone signal'
      }
    }
  }
}