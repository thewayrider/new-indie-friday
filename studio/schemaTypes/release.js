export default {
  name: 'release',
  title: 'Release',
  type: 'document',
  fields: [
    {
      name: 'songTitle',
      title: 'Song Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'artistName',
      title: 'Artist Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
	
	{
      name: 'genre',
      title: 'Genre',
      type: 'string',
      description: 'As designated by Spotify.',
    },
	
    {
      name: 'albumOrEpName',
      title: 'Album / EP Name',
      type: 'string',
      description: 'Leave blank if this track is a standalone single — the site will display "Single" automatically.',
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: (doc, options) => {
          const { artistName, songTitle } = options.parent || doc;
          return `${artistName || ''} ${songTitle || ''}`;
        },
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'blurb',
      title: 'Blurb',
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
              {
                name: 'internalLink',
                title: 'Internal reference',
                type: 'object',
                fields: [
                  {
                    name: 'reference',
                    title: 'Linked document',
                    type: 'reference',
                    to: [{ type: 'release' }, { type: 'spotlightArtist' }],
                  },
                ],
              },
            ],
          },
        },
      ],
      description: 'The write-up shown on this release\'s individual page. Highlight text and use the link tool to add external links (e.g. Spotify) or internal references to other releases/artists.',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'albumArt',
      title: 'Album Art',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'spotifyUrl',
      title: 'Spotify URL',
      type: 'url',
      description: 'Link to the track, album, or artist page on Spotify',
      validation: (Rule) =>
        Rule.required().uri({
          scheme: ['http', 'https'],
        }),
    },
    {
      name: 'releaseDate',
      title: 'Release Date',
      type: 'date',
      description: 'Used to order releases on the homepage (most recent first)',
      validation: (Rule) => Rule.required(),
    },
	
	{
      name: 'orderRank',
      title: 'Order Rank',
      type: 'string',
      hidden: true,
    },
  ],
  preview: {
    select: {
      title: 'songTitle',
      subtitle: 'artistName',
      media: 'albumArt',
    },
  },
}