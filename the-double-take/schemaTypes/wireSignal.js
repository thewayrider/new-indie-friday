// the-double-take/schemaTypes/wireSignal.js
import { orderRankField } from '@sanity/orderable-document-list'

export default {
  name: 'wireSignal',
  title: 'Live Feed (Ticker)',
  type: 'document',

  __experimental_actions: ['create', 'update', 'delete', 'publish'],

  orderings: [
    {
      title: 'Manual Order',
      name: 'manualOrder',
      by: [{ field: 'orderRank', direction: 'asc' }]
    },
    {
      title: 'Published Date, Newest',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }]
    }
  ],

  fields: [
    // DRAG-AND-DROP: plugin field — stores rank string internally
    orderRankField({ type: 'wireSignal' }),

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
      description: 'Used to display the date in the list view.',
      initialValue: () => new Date().toISOString()
    }
  ],

  preview: {
    select: {
      title: 'title',
      subtitle: 'linkType',
      date: 'publishedAt'
    },
    prepare({ title, subtitle, date }) {
      const d = date ? new Date(date) : null;
      const dd = d ? String(d.getDate()).padStart(2, '0') : '--';
      const mm = d ? String(d.getMonth() + 1).padStart(2, '0') : '--';
      const linkLabel = subtitle === 'deepDive' ? '→ Deep Dive'
        : subtitle === 'video' ? '→ Video'
        : '→ Standalone signal';
      return {
        title: title || 'Untitled signal',
        subtitle: `${dd}/${mm}  ${linkLabel}`
      };
    }
  }
}