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

  // Colors
  content = content.replace(/#6366f1/gi, 'var(--primary)');
  content = content.replace(/#8b5cf6/gi, 'var(--primary-purple)');
  content = content.replace(/#a855f7/gi, 'var(--primary-purple)');
  content = content.replace(/#06b6d4/gi, 'var(--primary-cyan)');
  
  // Specific property replacements to be safe with white/black
  content = content.replace(/color:\s*#fff(?:fff)?\s*;/gi, 'color: var(--text-primary);');
  content = content.replace(/color:\s*white\s*;/gi, 'color: var(--text-primary);');
  
  content = content.replace(/background:\s*#020617\s*;/gi, 'background: var(--bg-primary);');
  content = content.replace(/background-color:\s*#020617\s*;/gi, 'background-color: var(--bg-primary);');

  content = content.replace(/background:\s*#070c20\s*;/gi, 'background: var(--bg-secondary);');
  content = content.replace(/background-color:\s*#070c20\s*;/gi, 'background-color: var(--bg-secondary);');
  
  content = content.replace(/color:\s*#94a3b8\s*;/gi, 'color: var(--text-secondary);');
  content = content.replace(/color:\s*#64748b\s*;/gi, 'color: var(--text-muted);');

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    changedFiles++;
  }
});

console.log(`Updated ${changedFiles} files with hex replacements.`);
