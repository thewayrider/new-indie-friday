import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'oeemrqux',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
});

async function runTest() {
  const q = 'rock and*';
  try {
    const results = await client.fetch(
      `*[_type == "release" && (
        songTitle match $q ||
        artistName match $q
      )] | order(orderRank asc)[0...8]{
        _id,
        songTitle,
        artistName,
        "slug": slug.current
      }`,
      { q }
    );
    console.log("Search results:", results);
  } catch (error) {
    console.error("Error fetching:", error);
  }
}

runTest();
