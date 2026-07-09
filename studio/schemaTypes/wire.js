export default {
  name: 'wire',
  title: 'The Wire',
  type: 'document',
  fields: [
    { name: 'title', title: 'Title', type: 'string' },
    { name: 'url', title: 'URL (X/Threads)', type: 'url' },
    { name: 'date', title: 'Date', type: 'datetime' },
    { 
      name: 'topicTag', 
      title: 'Topic Tag', 
      type: 'string',
      options: { list: ['Politics', 'Finance', 'Culture', 'Tech'] }
    }
  ],
  preview: {
    select: { title: 'title', subtitle: 'topicTag' }
  }
}