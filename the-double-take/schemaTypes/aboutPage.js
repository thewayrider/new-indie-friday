export default {
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  __experimental_actions: ['update', 'publish'],
  fields: [
    {
      name: 'intro',
      title: 'Who You Are',
      type: 'array',
      of: [{ type: 'block' }],
    },
    {
      name: 'whatItIs',
      title: 'What The Double Take Is',
      type: 'array',
      of: [{ type: 'block' }],
    },
    {
      name: 'whyItExists',
      title: 'Why It Exists',
      type: 'string',
    },
    {
      name: 'photo',
      title: 'Your Photo',
      type: 'image',
      options: { hotspot: true }
    }
  ]
}