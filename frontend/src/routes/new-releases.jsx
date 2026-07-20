import { useLoaderData } from 'react-router';
import { client } from '../client';
import ReleaseListing, { buildQuery, RELEASES_PER_PAGE } from '../components/ReleaseListing';
import { buildMeta } from '../seo';

export function meta() {
  return buildMeta({
    title: 'New Releases',
    description:
      'The latest independent song releases — indie, alt and surf rock with an Australian and New Zealand focus — curated weekly.',
    path: '/new-releases',
  });
}

export async function loader() {
  const res = await client.fetch(buildQuery(1));
  const total = res.total || 0;
  return {
    releases: res.releases || [],
    currentPage: 1,
    totalPages: Math.ceil(total / RELEASES_PER_PAGE),
  };
}

export default function NewReleasesRoute() {
  const { releases, currentPage, totalPages } = useLoaderData();
  return (
    <ReleaseListing releases={releases} currentPage={currentPage} totalPages={totalPages} />
  );
}
