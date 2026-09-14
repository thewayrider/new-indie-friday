export default {
  name: 'socialLink',
  title: 'Social Link',
  type: 'object',
  fields: [
    {
      name: 'platform',
      title: 'Platform',
      type: 'string',
      options: {
        list: [
          { title: 'Website', value: 'website' },
          { title: 'X (Twitter)', value: 'x' },
          { title: 'Instagram', value: 'instagram' },
          { title: 'Facebook', value: 'facebook' },
          { title: 'Wikipedia', value: 'wikipedia' },
          { title: 'YouTube', value: 'youtube' },
          { title: 'TikTok', value: 'tiktok' },
        ],
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'url',
      title: 'URL',
      type: 'url',
      validation: (Rule) => Rule.required().uri({ scheme: ['http', 'https'] }),
    },
  ],
  preview: {
    select: {
      title: 'platform',
      subtitle: 'url',
    },
    prepare({ title, subtitle }) {
      const titles = {
        website: 'Website',
        x: 'X (Twitter)',
        instagram: 'Instagram',
        facebook: 'Facebook',
        wikipedia: 'Wikipedia',
        youtube: 'YouTube',
        tiktok: 'TikTok',
      }
      return {
        title: title ? titles[title] : 'Social Link',
        subtitle: subtitle,
      }
    }
  },
}
