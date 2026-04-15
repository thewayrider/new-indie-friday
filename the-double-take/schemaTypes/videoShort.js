export default {
  name: 'videoShort',
  title: 'Videos',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Video Title',
      type: 'string',
    },
    {
      name: 'mainImage',
      title: 'Thumbnail Image',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'videoUrl',
      title: 'Video URL',
      type: 'url',
    },
    {
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      initialValue: (new Date()).toISOString(),
    },
  ],
}