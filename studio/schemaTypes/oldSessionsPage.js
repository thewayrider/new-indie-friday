export default {
  name: 'oldSessionsPage',
  title: 'Old Sessions Page',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Internal Document Title',
      type: 'string',
    },
    {
      name: 'pageTitle',
      title: 'Page Heading',
      type: 'string',
      description: 'The main heading shown at the top of the Old Sessions page.',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'intro',
      title: 'Introduction',
      type: 'array',
      of: [
        {
          type: 'block',
          marks: {
            annotations: [
              {
                name: 'externalLink',
                title: 'External link',
                type: 'object',
                fields: [
                  {
                    name: 'href',
                    title: 'URL',
                    type: 'url',
                    validation: (Rule) =>
                      Rule.uri({ scheme: ['http', 'https'] }),
                  },
                ],
              },
            ],
          },
        },
      ],
      description: 'The introductory paragraph explaining what this page is about.',
    },
    {
      name: 'streamusiqueCard',
      title: 'Streamusique Card',
      type: 'object',
      fields: [
        {
          name: 'cardHeading',
          title: 'Card Heading',
          type: 'string',
          description: 'The heading shown above the Streamusique link card.',
        },
        {
          name: 'cardDescription',
          title: 'Card Description',
          type: 'text',
          rows: 3,
          description: 'A short explanation of what Streamusique is.',
        },
        {
          name: 'linkUrl',
          title: 'Link URL',
          type: 'url',
          initialValue: 'https://www.streamusique.com',
          validation: (Rule) =>
            Rule.uri({ scheme: ['http', 'https'] }),
        },
      ],
    },
    {
      name: 'playlists',
      title: 'Spotify Playlists',
      type: 'array',
      of: [
        {
          type: 'object',
          title: 'Playlist',
          fields: [
            {
              name: 'playlistTitle',
              title: 'Playlist Title',
              type: 'string',
              description: 'Label shown above the embed.',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'spotifyUrl',
              title: 'Spotify Playlist URL',
              type: 'url',
              description: 'The full Spotify playlist URL e.g. https://open.spotify.com/playlist/...',
              validation: (Rule) =>
                Rule.required().uri({ scheme: ['http', 'https'] }),
            },
          ],
          preview: {
            select: {
              title: 'playlistTitle',
              subtitle: 'spotifyUrl',
            },
          },
        },
      ],
      description: 'Add as many playlists as needed. Each gets its own embed.',
    },
  ],
  preview: {
    select: {
      title: 'pageTitle',
    },
  },
}