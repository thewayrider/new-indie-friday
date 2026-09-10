export default {
  name: 'newsletterSettings',
  title: 'Newsletter Settings',
  type: 'document',
  fields: [
    {
      name: 'welcomeEmailSubject',
      title: 'Welcome Email Subject Line',
      type: 'string',
      initialValue: 'Welcome to New Indie Friday Music!',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'welcomeEmailBody',
      title: 'Welcome Email Body (Plain Text)',
      type: 'text',
      initialValue: 'Many thanks for subscribing to these new Indie music releases.\nWe will send you curated new Indie song releases.\nPlease feel free to rate these selections!\n\nHappy listening from Kim & the Team at New Indie Music!',
      validation: (Rule) => Rule.required(),
    },
  ],
  preview: {
    prepare() {
      return {
        title: 'Newsletter Settings',
        subtitle: 'Global configuration for welcome emails',
      };
    },
  },
};
