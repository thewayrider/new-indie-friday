import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from 'react-router';
import './index.css';
import Header from './components/Header';
import Footer from './components/Footer';
import { Analytics } from '@vercel/analytics/react';

// <link> tags for the document head (migrated from index.html)
export const links = () => [
  { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Fraunces:wght@400;600;900&family=Spectral:wght@400;700;800&display=swap',
  },
];

// Default document metadata; individual routes override in Stage 3
export const meta = () => [
  { title: 'New Indie Friday' },
  {
    name: 'description',
    content:
      'New independent music — indie, alt and surf rock with an Australian and New Zealand focus — curated weekly by Kim Rampling.',
  },
];

const gaConfig = `
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-5FZRB4MCW2');
`;

const statcounterConfig =
  'var sc_project=13335607;var sc_invisible=1;var sc_security="c33e5b6b";';

// The HTML document shell (replaces index.html)
export function Layout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#e8e2d9" />
        <Meta />
        <Links />
        {/* Google Analytics (GA4) */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-5FZRB4MCW2"
        ></script>
        <script dangerouslySetInnerHTML={{ __html: gaConfig }} />
        {/* Rybbit Analytics */}
        <script
          src="https://app.rybbit.io/api/script.js?siteId=e22eedcebabd"
          defer
        ></script>
        {/* Statcounter config in <head> before deferred counter.js to prevent React 19 async script hoisting race */}
        <script dangerouslySetInnerHTML={{ __html: statcounterConfig }} />
        <script src="https://www.statcounter.com/counter/counter.js" defer></script>
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />

        {/* Statcounter noscript fallback */}
        <noscript>
          <div className="statcounter">
            <a
              title="Web Analytics"
              href="https://statcounter.com/"
              target="_blank"
              rel="noreferrer"
            >
              <img
                className="statcounter"
                src="https://c.statcounter.com/13335607/0/c33e5b6b/1/"
                alt="Web Analytics"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </a>
          </div>
        </noscript>
      </body>
    </html>
  );
}

// App chrome that wraps every route (Header + page + Footer)
export default function App() {
  return (
    <div className="min-h-screen bg-[#e8e2d9] text-black font-manrope">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <Analytics />
    </div>
  );
}
