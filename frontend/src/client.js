// frontend/src/client.js

import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const client = createClient({
  projectId: 'oeemrqux',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
});

// This builder helps turn Sanity's image data into real URLs
const builder = imageUrlBuilder(client);

export const urlFor = (source) => builder.image(source);