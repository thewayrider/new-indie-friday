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
            // Singleton: Homepage Editor
            S.listItem()
              .title('Homepage Editor')
              .id('homepage')
              .child(
                S.editor()
                  .id('homepage')
                  .schemaType('homepage')
                  .documentId('homepage')
              ),

            S.divider(),

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

            // All other document types (excluding singletons and orderable types)
            ...S.documentTypeListItems().filter(
              (listItem) => !['homepage', 'wireSignal', 'oldSessionsPage', 'release'].includes(listItem.getId())
            ),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },

  document: {
    actions: (prev, context) =>
      context.schemaType === 'homepage'
        ? prev.filter(({ action }) =>
            !['delete', 'unpublish', 'discardChanges'].includes(action)
          )
        : prev,
  },
})