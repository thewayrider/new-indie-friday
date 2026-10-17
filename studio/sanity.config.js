import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemaTypes'
import {
  orderableDocumentListDeskItem,
} from '@sanity/orderable-document-list'

import {
  CalendarIcon,
  SortIcon,
  TagIcon,
  DocumentsIcon,
} from '@sanity/icons'
import {
  SendTestBroadcastAction,
  SendLiveBroadcastAction,
} from './actions/broadcastActions'

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

            // Releases Group (Folders & Views)
            S.listItem()
              .title('Releases')
              .id('releases-group')
              .icon(DocumentsIcon)
              .child(
                S.list()
                  .title('Releases')
                  .items([
                    // 1. Manual Order (Drag & Drop)
                    orderableDocumentListDeskItem({
                      type: 'release',
                      title: 'Manual Order (Drag & Drop)',
                      id: 'orderable-releases',
                      icon: SortIcon,
                      S,
                      context,
                    }),

                    S.divider(),

                    // 2. All Releases (Newest First) - standard searchable list with pagination
                    S.listItem()
                      .title('All Releases (Newest First)')
                      .id('all-releases-by-date')
                      .icon(DocumentsIcon)
                      .child(
                        S.documentTypeList('release')
                          .title('All Releases (Newest First)')
                          .defaultOrdering([
                            { field: 'releaseDate', direction: 'desc' },
                            { field: '_createdAt', direction: 'desc' },
                          ])
                      ),

                    // 3. By Year & Month
                    S.listItem()
                      .title('By Year & Month')
                      .id('releases-by-month')
                      .icon(CalendarIcon)
                      .child(async () => {
                        const client = context.getClient({ apiVersion: '2024-01-01' })
                        const dates = await client.fetch(
                          `array::unique(*[_type == "release" && defined(releaseDate)].releaseDate)`
                        )
                        const monthMap = {}
                        dates.forEach((d) => {
                          if (d && d.length >= 7) {
                            monthMap[d.slice(0, 7)] = true
                          }
                        })
                        const sortedMonths = Object.keys(monthMap).sort().reverse()
                        const monthNames = [
                          'January', 'February', 'March', 'April', 'May', 'June',
                          'July', 'August', 'September', 'October', 'November', 'December',
                        ]

                        return S.list()
                          .title('Releases by Month')
                          .items(
                            sortedMonths.map((ym) => {
                              const [year, monthNum] = ym.split('-')
                              const label = `${monthNames[parseInt(monthNum, 10) - 1]} ${year}`
                              return S.listItem()
                                .title(label)
                                .id(`release-month-${ym}`)
                                .icon(CalendarIcon)
                                .child(
                                  S.documentList()
                                    .title(label)
                                    .schemaType('release')
                                    .filter('_type == "release" && string::startsWith(releaseDate, $prefix)')
                                    .params({ prefix: ym })
                                    .defaultOrdering([
                                      { field: 'releaseDate', direction: 'desc' },
                                      { field: '_createdAt', direction: 'desc' },
                                    ])
                                )
                            })
                          )
                      }),

                    // 4. By Discovery Source
                    S.listItem()
                      .title('By Discovery Source')
                      .id('releases-by-source')
                      .icon(TagIcon)
                      .child(async () => {
                        const client = context.getClient({ apiVersion: '2024-01-01' })
                        const sources = await client.fetch(
                          `array::unique(*[_type == "release" && defined(discoverySource)].discoverySource)`
                        )
                        const sortedSources = sources.filter(Boolean).sort()

                        return S.list()
                          .title('By Discovery Source')
                          .items(
                            sortedSources.map((source) =>
                              S.listItem()
                                .title(source)
                                .id(`release-source-${source.replace(/[^a-zA-Z0-9_-]/g, '_')}`)
                                .icon(TagIcon)
                                .child(
                                  S.documentList()
                                    .title(source)
                                    .schemaType('release')
                                    .filter('_type == "release" && discoverySource == $source')
                                    .params({ source })
                                    .defaultOrdering([
                                      { field: 'releaseDate', direction: 'desc' },
                                      { field: '_createdAt', direction: 'desc' },
                                    ])
                                )
                            )
                          )
                      }),
                  ])
              ),

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

  document: {
    actions: (prev, context) => {
      if (context.schemaType === 'broadcastEmail') {
        return [...prev, SendTestBroadcastAction, SendLiveBroadcastAction]
      }
      return prev
    },
  },
})