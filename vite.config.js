import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import { BASE_PATH } from './src/lib/site.js';

// 開発サーバーのファイル監視から、プロジェクト直下の .claude を外す。
// .claude/worktrees/ には作業用 worktree が入る。Windows では監視がフォルダごとに張られ、
// worktree が増えると走査の間は開発サーバーが応答しなくなる。
// `**/.claude/**` だと worktree 内で動かしたときにプロジェクト自体が外れるので、プロジェクト直下だけを指定する。
const ownDir = (name) =>
  fileURLToPath(new URL(name, import.meta.url)).replaceAll('\\', '/').replace(/[()[\]{}*?!+@]/g, '\\$&') + '/**';

export default defineConfig({
  plugins: [
    sveltekit({
      adapter: adapter(),
      paths: { base: BASE_PATH.slice(0, -1), relative: false }
    })
  ],
  server: { watch: { ignored: [ownDir('.claude')] } }
});
