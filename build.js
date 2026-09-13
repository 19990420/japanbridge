#!/usr/bin/env node
/* ARKLinks — deploy build.
   Vercel runs this (see vercel.json → buildCommand) and serves ./dist.

   ⚠️ Why this exists (2026-09-13): the HTML source carries working notes in <!-- --> comments
   (decision history, what not to reinstate, who to ask). Those are for us. A public audit found
   them in the served pages — including the farm's name, which the site deliberately never prints.
   So the source keeps its notes, and this step strips every HTML comment before deploy.

   It also leaves repo-only files (notes, tooling, legacy archive) out of the public output.
   No dependencies. Node ≥ 16. */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const OUT = path.join(ROOT, 'dist');

// Never published. Add here, not by deleting from the repo.
const EXCLUDE_TOP = new Set([
  '.git', '.claude', '.github', 'node_modules', 'dist', 'tools', 'legacy',
  'build.js', 'vercel.json', 'package.json', 'package-lock.json',
  'AGENTS.md', 'CLAUDE.md', 'README.md', '.DS_Store', '.gitignore', '.vercelignore',
]);
const EXCLUDE_ANY = (name) => name === '.DS_Store' || name.endsWith('.md');

function stripHtmlComments(html) {
  // Conditional comments and comments inside <script>/<style> are not used in this codebase.
  return html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/[ \t]+\n/g, '\n')        // trailing whitespace left behind
    .replace(/\n{3,}/g, '\n\n');       // collapse the gaps the comments leave
}

function copyTree(src, dst, depth) {
  fs.mkdirSync(dst, { recursive: true });
  for (const name of fs.readdirSync(src)) {
    if (depth === 0 && EXCLUDE_TOP.has(name)) continue;
    if (EXCLUDE_ANY(name)) continue;
    const s = path.join(src, name), d = path.join(dst, name);
    const st = fs.statSync(s);
    if (st.isDirectory()) { copyTree(s, d, depth + 1); continue; }
    if (name.endsWith('.html')) {
      const before = fs.readFileSync(s, 'utf8');
      const after = stripHtmlComments(before);
      fs.writeFileSync(d, after);
      const n = (before.match(/<!--/g) || []).length;
      console.log(`  ${path.relative(ROOT, s)}  −${n} comments  (${before.length} → ${after.length} bytes)`);
    } else {
      fs.copyFileSync(s, d);
    }
  }
}

fs.rmSync(OUT, { recursive: true, force: true });
console.log('build → dist/');
copyTree(ROOT, OUT, 0);

// Guard: nothing we promised to keep private may survive into dist.
const forbidden = [/Moriuchi/i, /森内/, /<!--/];
let bad = 0;
(function scan(dir) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) { scan(p); continue; }
    if (!/\.(html|js|css|txt|xml|json)$/.test(name)) continue;
    const t = fs.readFileSync(p, 'utf8');
    for (const re of forbidden) if (re.test(t)) { console.error(`  ✗ ${path.relative(OUT, p)} matches ${re}`); bad++; }
  }
})(OUT);
if (bad) { console.error('build failed: private strings found in dist/'); process.exit(1); }
console.log('ok');
