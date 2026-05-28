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

  // Replace dark grey backgrounds: rgba(10..40, 10..40, 10..40, x) -> var(--card-bg)
  // We'll use a regex replacer function to check if the rgb values are low (dark)
  content = content.replace(/rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([^)]+)\)/g, (match, r, g, b, a) => {
    // If it's a dark color (all rgb under 50) and it's not a shadow (not all 0)
    // We treat it as a surface/card background.
    // Wait, what if it's already using a variable? The regex only matches digits.
    r = parseInt(r);
    g = parseInt(g);
    b = parseInt(b);
    if (r < 50 && g < 50 && b < 50 && (r > 0 || g > 0 || b > 0)) {
      // It's a dark grey like rgba(10, 11, 30, 0.8) or rgba(22, 27, 34, 0.5)
      // If alpha is high (> 0.5), it's probably a modal/card.
      // If alpha is low (< 0.5), it's probably a surface/sidebar.
      // Let's just use var(--card-bg) for high alpha and var(--bg-surface) for low alpha
      const alpha = parseFloat(a);
      if (alpha > 0.4) {
        return 'var(--card-bg)';
      } else {
        return 'var(--bg-surface)';
      }
    }
    // Also catch pure black with opacity which is used for overlays/shadows
    if (r === 0 && g === 0 && b === 0) {
       // if used as background, it might be overlay. But could be box-shadow.
       // We'll leave 0,0,0 alone, it's usually shadow or overlay which we handled mostly.
    }
    return match;
  });

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    changedFiles++;
  }
});

console.log(`Updated ${changedFiles} files with dark RGBA replacements.`);
