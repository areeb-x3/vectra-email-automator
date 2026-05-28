const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.css')) {
        results.push(file);
      }
    }
  });
  return results;
}

const cssFiles = walk(srcDir);
let changedFiles = 0;

cssFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  content = content.replace(/var\(--bg-surface,\s*#1e1e1e\)/g, 'var(--card-bg)');
  content = content.replace(/var\(--bg-surface-hover,\s*#2a2a2a\)/g, 'var(--nav-hover-bg)');
  content = content.replace(/var\(--text-primary,\s*#fff\)/g, 'var(--text-primary)');
  content = content.replace(/var\(--text-secondary,\s*#a1a1aa\)/g, 'var(--text-secondary)');
  content = content.replace(/var\(--text-muted,\s*#52525b\)/g, 'var(--text-muted)');
  content = content.replace(/var\(--border-light,\s*#333\)/g, 'var(--border-soft)');
  content = content.replace(/var\(--accent-primary,\s*var\(--primary\)\)/g, 'var(--primary)');
  content = content.replace(/var\(--primary-cyan,\s*var\(--primary-cyan\)\)/g, 'var(--primary-cyan)');
  
  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    changedFiles++;
  }
});

console.log(`Updated ${changedFiles} files to fix hardcoded fallback colors.`);
