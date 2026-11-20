import { error } from '@sveltejs/kit';
import { ARTICLES } from '../../lib/site.js';

// 本文の HTML はリポジトリ内の原稿だけを読み込む。
const bodies = import.meta.glob('../../lib/articles/*.html', {
  eager: true,
  query: '?raw',
  import: 'default'
});

export function entries() {
  return ARTICLES.map(({ slug }) => ({ slug }));
}

export function load({ params }) {
  const index = ARTICLES.findIndex(({ slug }) => slug === params.slug);
  if (index === -1) error(404, 'ページが見つかりません');

  const article = ARTICLES[index];
  const body = bodies['../../lib/articles/' + article.slug + '.html'];
  if (!body) error(500, '記事の本文が見つかりません');

  return {
    article,
    body,
    previous: ARTICLES[index - 1]?.slug,
    next: ARTICLES[index + 1]?.slug
  };
}
