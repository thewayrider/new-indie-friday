export default {
  name: 'homePage',
  title: 'Home Page Settings',
  type: 'document',
  fields: [
    {
      name: 'spotifyPlaylistUrl',
      title: 'Spotify Playlist Embed URL',
      type: 'url',
      description: 'The URL for the Spotify playlist to embed (e.g., https://open.spotify.com/playlist/...)',
      validation: (Rule) => Rule.uri({ scheme: ['http', 'https'] }),
    },
    {
      name: 'curatorSelectionTitle',
      title: 'Curator Selection Title',
      type: 'string',
      description: 'The title to show above the embed. Default is "Curator\'s Selection".',
    },
  ],
};
