import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure' // Switched to modern structureTool
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'The Double Take',

  // KEEP YOUR ACTUAL PROJECT ID HERE
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
                S.document()
                  .schemaType('homepage')
                  .documentId('homepage')
              ),
            S.divider(),
            // All other document types
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
})