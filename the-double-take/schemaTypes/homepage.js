export default {
  name: 'homepage',
  title: 'Homepage Editor',
  type: 'document',
  fields: [
    {
      name: 'featuredPost',
      title: 'Double Take of the Day',
      type: 'reference',
      description: 'Select the post you want to feature at the very top of the website.',
      to: [
        { type: 'article' },
        { type: 'videoShort' },
        { type: 'wireSignal' }
      ],
    },
    {
      name: 'tagline',
      title: 'Homepage Tagline',
      type: 'string',
      description: 'The short text that appears under the main logo/title.'
    }
  ],
}