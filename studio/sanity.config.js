import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemaTypes'
import {
  orderableDocumentListDeskItem,
} from '@sanity/orderable-document-list'

export default defineConfig({
  name: 'default',
  title: 'New Indie Friday',
  projectId: 'oeemrqux',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S, context) =>
        S.list()
          .title('Content')
          .items([
            // Singleton: Old Sessions Page
            S.listItem()
              .title('Old Sessions Page')
              .id('oldSessionsPage')
              .child(
                S.editor()
                  .id('oldSessionsPage')
                  .schemaType('oldSessionsPage')
                  .documentId('oldSessionsPage')
              ),

            S.divider(),

            // Orderable: Releases
            orderableDocumentListDeskItem({
              type: 'release',
              title: 'Release',
              S,
              context,
            }),

            // Orderable: Resources (Left Column)
            orderableDocumentListDeskItem({
              type: 'resourceArticle',
              title: 'Resources (Left Column)',
              id: 'orderable-resources',
              filter: `_type == $type && category == "resource"`,
              params: { type: 'resourceArticle' },
              S,
              context,
            }),

            // Orderable: Articles (Right Column)
            orderableDocumentListDeskItem({
              type: 'resourceArticle',
              title: 'Articles (Right Column)',
              id: 'orderable-articles',
              filter: `_type == $type && category != "resource"`,
              params: { type: 'resourceArticle' },
              S,
              context,
            }),

            // All other document types (excluding singletons and orderable types)
            ...S.documentTypeListItems().filter(
              (listItem) => !['oldSessionsPage', 'release', 'resourceArticle'].includes(listItem.getId())
            ),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})