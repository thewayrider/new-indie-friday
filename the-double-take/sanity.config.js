import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemaTypes'
import {
  orderableDocumentListDeskItem
} from '@sanity/orderable-document-list'

export default defineConfig({
  name: 'default',
  title: 'The Double Take',
  projectId: '9weej2ir',
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

           

            // All other document types (excluding homepage and wireSignal)
            ...S.documentTypeListItems().filter(
              (listItem) => !['homepage', 'wireSignal'].includes(listItem.getId())
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