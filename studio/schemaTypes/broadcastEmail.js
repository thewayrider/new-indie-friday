export default {
  name: 'broadcastEmail',
  title: 'Broadcast Email',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Internal Campaign Title',
      type: 'string',
      description: 'Used for your reference in Sanity Studio (e.g. "Weekly Blast: The Beths" or "Oct 2026 Editorial Note").',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'campaignType',
      title: 'Campaign Type',
      type: 'string',
      description: 'Choose what type of email you are sending to subscribers.',
      options: {
        list: [
          { title: 'New Single Release', value: 'single' },
          { title: 'New Album / EP Release', value: 'album' },
          { title: 'Featured Artist or Album (Spotlight)', value: 'spotlight' },
          { title: 'Editorial / Newsletter (Standalone)', value: 'editorial' },
        ],
        layout: 'radio',
      },
      initialValue: 'single',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'releaseRef',
      title: 'Select Release',
      type: 'reference',
      to: [{ type: 'release' }],
      description: 'Choose the release from your catalog to feature in this email.',
      hidden: ({ parent }) => parent?.campaignType !== 'single' && parent?.campaignType !== 'album',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const type = context.parent?.campaignType
          if ((type === 'single' || type === 'album') && !value) {
            return 'Please select a Release to feature.'
          }
          return true
        }),
    },
    {
      name: 'spotlightRef',
      title: 'Select Spotlight Artist',
      type: 'reference',
      to: [{ type: 'spotlightArtist' }],
      description: 'Choose the Spotlight Artist from your catalog to feature in this email.',
      hidden: ({ parent }) => parent?.campaignType !== 'spotlight',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          if (context.parent?.campaignType === 'spotlight' && !value) {
            return 'Please select a Spotlight Artist to feature.'
          }
          return true
        }),
    },
    {
      name: 'customSubject',
      title: 'Custom Subject Line (Optional)',
      type: 'string',
      description: 'Leave blank to auto-generate based on your music selection (e.g. "New Single: Song Title by Artist" or "Featured Artist: Artist Name").',
    },
    {
      name: 'editorialOption',
      title: 'Editorial Message Option',
      type: 'string',
      description: 'Do you want to include a personal note or editorial thoughts above the music card?',
      options: {
        list: [
          { title: 'No editorial note (Clean music card only)', value: 'none' },
          { title: 'Include custom editorial note above music', value: 'custom' },
        ],
        layout: 'radio',
      },
      initialValue: 'none',
      hidden: ({ parent }) => parent?.campaignType === 'editorial',
    },
    {
      name: 'editorialMessage',
      title: 'Custom Editorial Message',
      type: 'text',
      rows: 6,
      description: 'Your personal note to subscribers. Appears prominently at the top of the email as a personal letter from Kim & the team.',
      hidden: ({ parent }) =>
        parent?.campaignType !== 'editorial' && parent?.editorialOption !== 'custom',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent
          const isRequired =
            parent?.campaignType === 'editorial' || parent?.editorialOption === 'custom'
          if (isRequired && (!value || !value.trim())) {
            return 'Please enter your editorial message, or choose "No editorial note".'
          }
          return true
        }),
    },
    {
      name: 'status',
      title: 'Broadcast Status',
      type: 'string',
      options: {
        list: [
          { title: 'Draft', value: 'draft' },
          { title: 'Sent to Subscribers', value: 'sent' },
        ],
      },
      initialValue: 'draft',
      readOnly: true,
    },
    {
      name: 'sentAt',
      title: 'Sent At',
      type: 'datetime',
      readOnly: true,
      hidden: ({ parent }) => parent?.status !== 'sent',
    },
    {
      name: 'sentCount',
      title: 'Recipient Count',
      type: 'number',
      description: 'Number of subscribers this email was delivered to.',
      readOnly: true,
      hidden: ({ parent }) => parent?.status !== 'sent',
    },
    {
      name: 'lastTestSentAt',
      title: 'Last Test Email Sent',
      type: 'datetime',
      readOnly: true,
      hidden: ({ value }) => !value,
    },
  ],
  preview: {
    select: {
      title: 'title',
      campaignType: 'campaignType',
      status: 'status',
      sentAt: 'sentAt',
      releaseTitle: 'releaseRef.songTitle',
      releaseArtist: 'releaseRef.artistName',
      spotlightArtist: 'spotlightRef.artistName',
    },
    prepare({ title, campaignType, status, sentAt, releaseTitle, releaseArtist, spotlightArtist }) {
      const statusPrefix = status === 'sent' ? '✓ SENT' : 'DRAFT'
      let item = ''
      if (campaignType === 'single') {
        item = releaseTitle ? `Single: ${releaseTitle} (${releaseArtist})` : 'Single (none selected)'
      } else if (campaignType === 'album') {
        item = releaseTitle ? `Album: ${releaseTitle} (${releaseArtist})` : 'Album (none selected)'
      } else if (campaignType === 'spotlight') {
        item = spotlightArtist ? `Spotlight: ${spotlightArtist}` : 'Spotlight (none selected)'
      } else {
        item = 'Editorial Letter'
      }

      const dateStr = sentAt ? ` • ${new Date(sentAt).toLocaleDateString()}` : ''
      return {
        title: title || 'Untitled Broadcast',
        subtitle: `[${statusPrefix}] ${item}${dateStr}`,
      }
    },
  },
}
