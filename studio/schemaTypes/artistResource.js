import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'artistResource',
  title: 'Artist resource',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'summary',
      title: 'Sidebar summary',
      type: 'text',
      rows: 2,
      description: 'Short teaser shown in the Spotlight sidebar list',
    }),
    defineField({
      name: 'checklistItems',
      title: 'Checklist items',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Use for checklist-format entries, e.g. New Artist Checklist',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Use for prose-format entries instead of, or alongside, checklist items',
    }),
    defineField({
      name: 'orderRank',
      title: 'Order Rank',
      type: 'string',
      hidden: true,
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'summary' },
  },
})