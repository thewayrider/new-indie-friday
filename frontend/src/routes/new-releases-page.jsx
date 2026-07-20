import { useLoaderData } from 'react-router';
import { client } from '../client';
import ReleaseListing, { buildQuery, RELEASES_PER_PAGE } from '../components/ReleaseListing';

export async function loader({ params }) {
  const currentPage = parseInt(params.page, 10) || 1;
  const res = await client.fetch(buildQuery(currentPage));
  const total = res.total || 0;
  return {
    releases: res.releases || [],
    currentPage,
    totalPages: Math.ceil(total / RELEASES_PER_PAGE),
  };
}

export default function NewReleasesPageRoute() {
  const { releases, currentPage, totalPages } = useLoaderData();
  return (
    <ReleaseListing releases={releases} currentPage={currentPage} totalPages={totalPages} />
  );
}
