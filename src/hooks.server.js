import { BASE_PATH } from './lib/site.js';

// 英語版（/en/）は、スクリプトを読まないクローラーにも英語のページとして伝える。
export async function handle({ event, resolve }) {
  if (!event.url.pathname.startsWith(BASE_PATH + 'en/')) return resolve(event);
  return resolve(event, {
    transformPageChunk: ({ html }) => html.replace('<html lang="ja">', '<html lang="en" data-page-lang="en">')
  });
}
