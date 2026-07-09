export default {
  name: 'spotlightArtist',
  title: 'Spotlight Artist',
  type: 'document',
  fields: [
    {
      name: 'artistName',
      title: 'Artist Name',
      type: 'string',
      description: 'Shown as the main heading, both on the homepage and the Spotlight detail page.',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'genre',
      title: 'Genre',
      type: 'string',
      description: 'As designated by Spotify.',
    },
    {
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'The location accepted as the band/artist\'s base, as researched manually.',
    },
    {
      name: 'songReleaseDate',
      title: 'Song Release Date',
      type: 'date',
      description: 'The release date of the featured song, as given by Spotify.',
    },

    {
   
      name: 'teaser',
      title: 'Teaser (2–3 lines)',
      type: 'text',
      rows: 3,
      description: 'Shown under the artist name on the homepage, and beside the thumbnail on the /spotlight listing page for older posts.',
      validation: (Rule) => Rule.required().max(280),
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
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'image',
      title: 'Artist Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    },

    {
      name: 'headerImage',
      title: 'Spotlight Page Header Image',
      type: 'image',
      description: 'A small band/artist photo shown beside the headline on the Spotlight article page. Different from the main square cover image used on the homepage.',
      options: {
        hotspot: true,
      },
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
      name: 'spotifyUrl',
      title: 'Spotify URL (Featured Song)',
      type: 'url',
      description: 'The specific song chosen to complement this Spotlight post — used for the embed.',
      validation: (Rule) =>
        Rule.uri({ scheme: ['http', 'https'] }),
    },
    {
      name: 'albumLinkUrl',
      title: 'Album Link (optional)',
      type: 'url',
      description: 'Optional — link to an album mentioned in the post, if relevant.',
      validation: (Rule) =>
        Rule.uri({ scheme: ['http', 'https'] }),
    },
    {
      name: 'featuredDate',
      title: 'Featured Date',
      type: 'date',
      description: 'The week this artist was/is the homepage spotlight.',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'isCurrent',
      title: 'Currently Featured on Homepage',
      type: 'boolean',
      description: 'Toggle ON for the artist that should appear in the homepage Hero. Should only be true for one entry at a time.',
      initialValue: false,
    },
  ],
  preview: {
    select: {
      title: 'artistName',
      subtitle: 'genre',
      media: 'image',
    },
  },
}