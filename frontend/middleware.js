import { next } from '@vercel/functions';

const MARKDOWN_404 = `# 404 Not Found

The requested resource does not exist on New Indie Friday (https://www.streamusique.com).

## Where to look next:
- [Home](https://www.streamusique.com/): Weekly curated independent music discoveries
- [Sitemap](https://www.streamusique.com/sitemap.xml): Complete XML sitemap
- [LLM Index (llms.txt)](https://www.streamusique.com/llms.txt): Plaintext guide for AI agents & LLMs
- [New Releases](https://www.streamusique.com/new-releases): The latest single, EP, and album picks
- [Spotlight](https://www.streamusique.com/spotlight): In-depth features on standout artists
- [Resources](https://www.streamusique.com/resources): Practical guides for indie musicians
- [About](https://www.streamusique.com/about): Curator information and site mission
`;

export const config = {
  matcher: [
    /*
     * Match all request paths except static assets with file extensions
     */
    '/((?!assets/|_assets/|.*\\.(?:ico|png|jpg|jpeg|gif|webp|svg|xml|txt|css|js|map)$).*)',
  ],
};

export default async function middleware(request) {
  const accept = request.headers.get('accept') || '';

  // Only intercept when client explicitly negotiates for Markdown (e.g. AI agents, curl)
  if (!accept.includes('text/markdown')) {
    return next();
  }

  const url = new URL(request.url);

  try {
    // Probe the origin HTML page to verify if route exists without recursion
    const originProbe = await fetch(new URL(url.pathname, request.url), {
      headers: {
        accept: 'text/html',
      },
    });

    if (originProbe.status === 404) {
      // 1. Return genuine HTTP 404 with Markdown body for agents
      return new Response(MARKDOWN_404, {
        status: 404,
        headers: {
          'Content-Type': 'text/markdown; charset=utf-8',
          'Vary': 'Accept, Accept-Encoding',
          'Cache-Control': 'public, max-age=0, must-revalidate',
        },
      });
    }

    // 2. Route exists: serve Markdown representation with Vary: Accept
    const llmsRes = await fetch(new URL('/llms.txt', request.url));
    const markdownBody = llmsRes.ok ? await llmsRes.text() : MARKDOWN_404;

    return new Response(markdownBody, {
      status: 200,
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        'Vary': 'Accept, Accept-Encoding',
        'Cache-Control': 'public, max-age=0, must-revalidate',
      },
    });
  } catch {
    return next();
  }
}
