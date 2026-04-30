export default {
  name: 'homepage',
  title: 'Homepage Manager',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Internal Document Title',
      type: 'string',
    },
    // ── THE DOUBLE TAKE (LEFT HERO BOX) ──
    {
      name: 'doubleTake',
      title: 'The Double Take (Memo Box)',
      type: 'object',
      fields: [
        {
          name: 'quote',
          title: 'Intel Quote',
          type: 'text',
          rows: 3,
        },
        {
          name: 'intelImage',
          title: 'Intel / Evidence Image (Optional)',
          type: 'image',
          options: { hotspot: true },
          description: 'A small visual reference that appears in the memo box.',
        },
        {
          name: 'sourceOverride',
          title: 'Source Label Override',
          type: 'string',
          description: 'e.g., @KIMRAMPLING // THREADS',
        },
        {
          name: 'linkedDive',
          title: 'Link to Deep Dive',
          type: 'reference',
          to: [{ type: 'article' }],
          description: 'Clicking the memo will take users to this article.',
        },
      ],
    },
    // ── FEATURED ANALYSIS (RIGHT HERO BOX) ──
    {
      name: 'featuredDive',
      title: 'Featured Deep Analysis',
      type: 'reference',
      to: [{ type: 'article' }],
      description: 'The main report featured on the right side of the hero.',
    },
  ],
}