export default {
  name: 'wireSignal',
  title: 'Live Feed (Ticker)',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Headline',
      type: 'string',
    },
    {
      name: 'mainImage', // Added this
      title: 'Ticker Image',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'content',
      title: 'Content',
      type: 'text',
    },
    {
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      initialValue: (new Date()).toISOString(),
    },
  ],
}