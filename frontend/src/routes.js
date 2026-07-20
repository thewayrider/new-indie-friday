import { index, route } from '@react-router/dev/routes';

export default [
  index('routes/home.jsx'),
  route('spotlight', 'components/SpotlightListing.jsx'),
  route('spotlight/:slug', 'components/SpotlightDetail.jsx'),
  route('new-releases', 'routes/new-releases.jsx'),
  route('new-releases/page/:page', 'routes/new-releases-page.jsx'),
  route('new-releases/:slug', 'components/ReleaseDetail.jsx'),
  route('about', 'components/About.jsx'),
  route('new-music-old-sessions', 'components/OldSessions.jsx'),
];
