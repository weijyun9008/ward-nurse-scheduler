import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';

const repository = process.env.GITHUB_REPOSITORY;
if (!repository || !/^[\w.-]+\/[\w.-]+$/.test(repository)) {
  throw new Error('Set GITHUB_REPOSITORY to owner/repository.');
}

const scriptName = 'nurse-scheduler.js';
const revision = execFileSync('git', ['rev-list', '-1', 'HEAD', '--', scriptName], { encoding: 'utf8' }).trim();
if (!revision) throw new Error('Commit nurse-scheduler.js before generating the bookmarklet.');
const script = execFileSync('git', ['show', `${revision}:${scriptName}`]);
if (!script.equals(readFileSync(scriptName))) throw new Error('Commit the updated script first.');
if (script.some(byte => byte >= 128)) throw new Error('Use an ASCII JavaScript bundle.');

const sha256 = createHash('sha256').update(script).digest('hex');
const rootRevision = execFileSync('git', ['rev-list', '--max-parents=0', 'HEAD'], { encoding: 'utf8' }).trim();
const rootTags = execFileSync('git', ['tag', '--points-at', rootRevision], { encoding: 'utf8' }).trim().split(/\s+/);
// The snapshot tag avoids a self-referential commit URL in the one-commit baseline.
const reference = process.env.BOOKMARKLET_REF || (revision === rootRevision && rootTags.includes('scheduler-snapshot') ? 'scheduler-snapshot' : revision);
const url = `https://raw.githubusercontent.com/${repository}/${reference}/${scriptName}`;
const [owner, name] = repository.toLowerCase().split('/');
const installPage = `https://${owner}.github.io/${name}/`;
const bookmarklet = readFileSync('scripts/bookmarklet.template.txt', 'utf8').trim()
  .replace('REPLACE_WITH_HTTPS_URL', url)
  .replace('REPLACE_WITH_SHA256', sha256);
if (bookmarklet.length > 1690) console.warn(`Bookmarklet exceeds the 1690-character size tested in IE mode (${bookmarklet.length}).`);

const region = /<!-- bookmarklet:start -->[\s\S]*?<!-- bookmarklet:end -->/;
const readme = readFileSync('README.md', 'utf8');
if (!region.test(readme)) throw new Error('README bookmarklet markers are missing.');
writeFileSync('README.md', readme.replace(region, () => [
  '<!-- bookmarklet:start -->',
  `[開啟書籤安裝頁](${installPage})`,
  '',
  '<details><summary>手動複製書籤網址與查看 SHA-256</summary>',
  '',
  `<p>SHA-256 <code>${sha256}</code></p>`,
  '',
  '```text',
  bookmarklet,
  '```',
  '',
  '</details>',
  '<!-- bookmarklet:end -->',
].join('\n')));

mkdirSync('_site', { recursive: true });
function escapeHtml(text) {
  return text.replaceAll('&', '&amp;').replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

function inlineMarkdown(text) {
  return escapeHtml(text).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code>$1</code>');
}

const href = escapeHtml(bookmarklet);
const install = `<p class="install-row"><a class="install" draggable="true" href="${href}">6A 護理派班</a></p>
<details><summary>手動複製書籤網址與查看 SHA-256</summary><p class="hash">SHA-256 <code>${sha256}</code></p><pre><code>${href}</code></pre></details>`;
const readmeInstallStep = '1. 開啟安裝頁，將「6A 護理派班」拖到書籤列。';
if (!readme.includes(readmeInstallStep)) throw new Error('README installation step is missing.');
const pageContent = readme
  .replace(region, '\n\n<!-- install-control -->\n\n')
  .replace(readmeInstallStep, '1. 把「6A 護理派班」按鈕拖到瀏覽器的書籤列。')
  .replace('2. 在 OpenWard 查出 6A 的床況，確認 A1、A2 兩區都有在床病人，再點書籤。',
    '2. 在 OpenWard 開啟 6A 病床查詢結果。確認 A1、A2 各有至少一位在床病人後，點書籤開啟派班。')
  .trim().split(/\n{2,}/)
  .map(block => {
    if (block === '<!-- install-control -->') return install;
    if (block.startsWith('# ')) return `<h1>${inlineMarkdown(block.slice(2))}</h1>`;
    if (/^1\. /.test(block)) {
      return `<ol>${block.split('\n').map(line => `<li>${inlineMarkdown(line.replace(/^\d+\. /, ''))}</li>`).join('')}</ol>`;
    }
    return `<p>${inlineMarkdown(block)}</p>`;
  }).join('\n');
writeFileSync('_site/index.html', `<!doctype html>
<html lang="zh-Hant">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>安裝 Ward Nurse Scheduler</title>
<style>
body { margin: 48px auto; padding: 0 20px; max-width: 720px; font: 16px/1.6 system-ui, sans-serif; color: #142b35; }
.install { display: inline-block; color: white; background: #075e64; padding: 9px 15px; border-radius: 6px; text-decoration: none; }
.install-row { display: flex; align-items: center; gap: 8px 14px; }
.hash { overflow-wrap: anywhere; }
pre { overflow: auto; padding: 10px; background: #f2f6f6; }
code { font-family: ui-monospace, Consolas, monospace; }
p > code, li > code, .hash code { padding: .15em .35em; background: #eef2f3; border-radius: 4px; font-size: .875em; overflow-wrap: anywhere; }
</style>
<main>
${pageContent}
<p><a href="https://github.com/${repository}">查看 GitHub repository</a></p>
</main>
</html>
`);
console.log(`SHA-256 ${sha256} · ${bookmarklet.length} characters`);
