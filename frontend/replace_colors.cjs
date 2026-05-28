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
let totalReplacements = 0;

cssFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // Replace rgba(255, 255, 255, x) -> rgba(var(--theme-glass-rgb), x)
  // Need to handle spaces carefully
  content = content.replace(/rgba\(\s*255\s*,\s*255\s*,\s*255\s*,\s*([^)]+)\)/g, 'rgba(var(--theme-glass-rgb), $1)');

  // Replace rgba(2, 6, 23, x) -> rgba(var(--theme-bg-rgb), x)
  content = content.replace(/rgba\(\s*2\s*,\s*6\s*,\s*23\s*,\s*([^)]+)\)/g, 'rgba(var(--theme-bg-rgb), $1)');

  // Replace rgba(0, 0, 0, x) -> rgba(var(--theme-shadow-rgb), x)
  content = content.replace(/rgba\(\s*0\s*,\s*0\s*,\s*0\s*,\s*([^)]+)\)/g, 'rgba(var(--theme-shadow-rgb), $1)');

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    changedFiles++;
    totalReplacements += (originalContent.length - content.length); // rough estimate just for tracking
  }
});

console.log(`Updated ${changedFiles} files.`);
