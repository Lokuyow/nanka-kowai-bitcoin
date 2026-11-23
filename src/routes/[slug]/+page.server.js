import { error } from '@sveltejs/kit';
import { ARTICLES, BASE_PATH } from '../../lib/site.js';

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
  const source = bodies['../../lib/articles/' + article.slug + '.html'];
  if (!source) error(500, '記事の本文が見つかりません');
  // 英語版（/en/）でも同じ画像を指すよう、原稿の相対パスをサイトのルートからのパスにする。
  const body = source.replace(/(\s(?:src|srcset)=")\.\.\//g, '$1' + BASE_PATH);

  return {
    article,
    body,
    previous: ARTICLES[index - 1],
    next: ARTICLES[index + 1]
  };
}
