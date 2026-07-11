export default {
  name: 'homepage',
  title: 'Homepage Manager',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Internal Document Title',
      type: 'string',
    },
    // ── THIS WEEK'S PICK (FOOTER STRIP) ──
    {
      name: 'weeklyPick',
      title: "This Week's Pick (Footer Strip)",
      type: 'object',
      fields: [
        {
          name: 'artistName',
          title: 'Artist Name',
          type: 'string',
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'trackName',
          title: 'Track Name',
          type: 'string',
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'spotifyUrl',
          title: 'Spotify URL',
          type: 'url',
          validation: (Rule) =>
            Rule.required().uri({
              scheme: ['http', 'https'],
            }),
        },
      ],
    },
  ],
}