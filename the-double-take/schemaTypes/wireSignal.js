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
      name: 'linkType',
      title: 'Links To',
      type: 'string',
      description: 'What type of content does this headline relate to?',
      options: {
        list: [
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
      description: 'Link to the Deep Dive or Video this headline refers to. Keeps visitors on the site.',
      options: { disableNew: true }
    },
    {
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      description: 'Used to order entries in the ticker (newest first).'
    }
  ],
  preview: {
    select: { title: 'title', subtitle: 'linkType' },
    prepare({ title, subtitle }) {
      return {
        title: title || 'Untitled signal',
        subtitle: subtitle === 'deepDive' ? '→ Deep Dive' : subtitle === 'video' ? '→ Video' : 'No link set'
      }
    }
  }
}