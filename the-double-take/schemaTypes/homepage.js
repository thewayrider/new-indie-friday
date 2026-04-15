// the-double-take/schemaTypes/homepage.js

export default {
  name: 'homepage',
  title: 'Homepage Editor',
  type: 'document',
  fields: [
    {
      name: 'doubleTake',
      title: 'Double Take of the Day',
      type: 'object',
      description: 'The tweet card on the left side of the Hero. Write your sharpest take here.',
      fields: [
        {
          name: 'quote',
          title: 'Pull Quote',
          type: 'text',
          rows: 4,
          description: '1–3 punchy sentences. This appears as the tweet card quote in the Hero.',
          validation: Rule => Rule.required().max(400)
        },
        {
          name: 'linkedDive',
          title: 'Linked Deep Dive (optional)',
          type: 'reference',
          to: [{ type: 'article' }],
          description: 'If this take relates to a Deep Dive article, link it here. Powers the READ THE FULL BREAKDOWN link.',
          options: { disableNew: true }
        }
      ]
    },
    {
      name: 'featuredDive',
      title: 'Featured Deep Dive',
      type: 'reference',
      to: [{ type: 'article' }],
      description: 'The article shown on the right side of the Hero. Title and excerpt display here.',
      options: { disableNew: true }
    }
  ],
  preview: {
    select: {
      title: 'doubleTake.quote',
      subtitle: 'featuredDive.title'
    },
    prepare({ title, subtitle }) {
      return {
        title: title ? title.substring(0, 60) + '…' : 'No quote set',
        subtitle: subtitle ? `Featured: ${subtitle}` : 'No featured dive set'
      }
    }
  }
}