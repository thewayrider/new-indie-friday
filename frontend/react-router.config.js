/** @type {import('@react-router/dev/config').Config} */
export default {
  // Keep app source in src/ (root.jsx, routes.js, routes/ live here)
  appDirectory: 'src',

  // No runtime server — we prerender to static HTML instead
  ssr: false,

  // Build-time prerendered paths. Stage 1 = home only.
  // Stage 2 expands this to pull release + spotlight slugs from Sanity.
  prerender: ['/'],
};
