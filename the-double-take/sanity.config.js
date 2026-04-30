import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'The Double Take',
  projectId: '9weej2ir',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S) =>
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
            ...S.documentTypeListItems().filter(
              (listItem) => !['homepage'].includes(listItem.getId())
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