export default {
  name: 'homePage',
  title: 'Song Pool',
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
    {
      name: 'standoutSongs',
      title: 'Standout Songs',
      type: 'array',
      description: 'Songs selected from the Weekly Song Pool to feature in the Standout Songs dropdown.',
      of: [
        {
          type: 'object',
          name: 'standoutSong',
          title: 'Standout Song',
          fields: [
            {
              name: 'songTitle',
              title: 'Song Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'artistName',
              title: 'Artist',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'blurb',
              title: 'Blurb',
              type: 'text',
              rows: 2,
              description: 'Short 1-line note on why this track stood out.',
            },
            {
              name: 'spotifyUrl',
              title: 'Spotify Link',
              type: 'url',
              validation: (Rule) => Rule.uri({ scheme: ['http', 'https'] }),
            },
          ],
          preview: {
            select: {
              title: 'songTitle',
              subtitle: 'artistName',
            },
          },
        },
      ],
    },
  ],
};
