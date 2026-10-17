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
    {
      name: 'adminTestEmail',
      title: 'Admin Test Email Address',
      type: 'string',
      description: 'Where preview/test emails are sent before broadcasting to all subscribers.',
      initialValue: 'kim@streamusique.com',
    },
    {
      name: 'senderEmail',
      title: 'Sender From Email Address',
      type: 'string',
      description: 'The verified sender email address used in Resend (e.g. kim@streamusique.com).',
      initialValue: 'kim@streamusique.com',
    },
    {
      name: 'broadcastSecret',
      title: 'Broadcast API Secret (Optional)',
      type: 'string',
      description: 'Used to authorize broadcast sending requests from the Studio. Defaults to a standard secure token if left empty.',
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
