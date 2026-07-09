export default {
  name: 'visualEvidence',
  title: 'Visual Evidence',
  type: 'document',
  fields: [
    { name: 'title', title: 'Title', type: 'string' },
    { name: 'youtubeUrl', title: 'YouTube URL', type: 'url' },
    { name: 'description', title: 'Short Description', type: 'text', rows: 3 }
  ]
}