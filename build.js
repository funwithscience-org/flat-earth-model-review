#!/usr/bin/env node
// Build pipeline: copies raw-text/*.md into docs/sections/*.md so the
// statically-served docs/ directory is self-contained for GitHub Pages.
// Also stamps the build date and writes a build manifest.
//
// docs/index.html fetches sections/<file>.md at runtime via marked.js,
// so the build is just a copy-and-stamp.

const fs   = require('fs');
const path = require('path');

const ROOT  = path.resolve(__dirname);
const SRC   = path.join(ROOT, 'raw-text');
const OUT   = path.join(ROOT, 'docs', 'sections');
const HTML  = path.join(ROOT, 'docs', 'index.html');

if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

const files = fs.readdirSync(SRC).filter(f => f.endsWith('.md')).sort();
const manifest = [];

for (const f of files) {
  const srcPath = path.join(SRC, f);
  const outPath = path.join(OUT, f);
  fs.copyFileSync(srcPath, outPath);
  const st = fs.statSync(srcPath);
  manifest.push({ file: f, bytes: st.size, mtime: st.mtime.toISOString() });
  console.log(`  copy  ${f}  (${st.size} bytes)`);
}

// Stamp build date in docs/index.html — replace the contents of #date-ver.
if (fs.existsSync(HTML)) {
  const today = new Date();
  const months = ['January','February','March','April','May','June',
                  'July','August','September','October','November','December'];
  const dateStr = `${months[today.getUTCMonth()]} ${today.getUTCDate()}, ${today.getUTCFullYear()}`;
  let html = fs.readFileSync(HTML, 'utf8');
  // Read version from package.json
  let version = '1';
  try {
    version = require(path.join(ROOT, 'package.json')).version || '1';
  } catch {}
  const stamped = html.replace(
    /<span id="date-ver">[^<]*<\/span>/,
    `<span id="date-ver">${dateStr} · Version ${version}</span>`
  );
  if (stamped !== html) {
    fs.writeFileSync(HTML, stamped);
    console.log(`  stamp ${dateStr} · v${version} → docs/index.html`);
  }
}

fs.writeFileSync(
  path.join(ROOT, 'docs', 'sections', 'manifest.json'),
  JSON.stringify({ built: new Date().toISOString(), sections: manifest }, null, 2) + '\n'
);

console.log(`\nBuilt ${files.length} sections.`);
