export default {
  name: 'homepage',
  title: 'Homepage Editor',
  type: 'document',
  fields: [
    {
      name: 'doubleTake',
      title: 'Double Take (Left Intel Memo)',
      type: 'object',
      description: 'The "Raw Intel" memo that establishes the skeptical hook for the day.',
      fields: [
        {
          name: 'quote',
          title: 'The Intel / Take',
          type: 'text',
          rows: 4,
          description: 'Paste and edit your 1-3 sentences here. Be sharp, be skeptical.',
          validation: Rule => Rule.required().max(400)
        },
        {
          name: 'sourceOverride',
          title: 'Source Override (Optional)',
          type: 'string',
          description: 'Defaults to @kimrampling. Fill this in ONLY if the quote is from someone else.',
        },
        {
          name: 'linkedDive',
          title: 'Linked Investigation (Optional)',
          type: 'reference',
          to: [{ type: 'article' }],
          description: 'Link this intel to a specific Deep Dive report.',
          options: { disableNew: true }
        }
      ]
    },
    {
      name: 'featuredDive',
      title: 'Primary Featured Investigation (Right)',
      type: 'reference',
      to: [{ type: 'article' }],
      description: 'The main long-form analysis report for the Hero section.',
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
        title: title ? `INTEL: ${title.substring(0, 50)}...` : 'No Intel set',
        subtitle: subtitle ? `REPORT: ${subtitle}` : 'No report set'
      }
    }
  }
}