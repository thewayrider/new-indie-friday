// frontend/src/components/DisqusComments.jsx

import { useEffect } from 'react';

export default function DisqusComments({ pageId, pageUrl, pageTitle }) {
  useEffect(() => {
    window.disqus_config = function () {
      this.page.url = pageUrl;
      this.page.identifier = pageId;
      this.page.title = pageTitle;
    };

    const script = document.createElement('script');
    script.src = 'https://the-double-take.disqus.com/embed.js';
    script.setAttribute('data-timestamp', +new Date());
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup on unmount
      delete window.disqus_config;
      const existing = document.getElementById('dsq-embed-scr');
      if (existing) existing.remove();
      const thread = document.getElementById('disqus_thread');
      if (thread) thread.innerHTML = '';
    };
  }, [pageId]);

  return (
    <div className="mt-16 pt-8 border-t border-black/10">
      <div id="disqus_thread" />
    </div>
  );
}