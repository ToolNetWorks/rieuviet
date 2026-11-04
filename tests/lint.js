/**
 * Syntax and structure linter for RIEU VIỆT
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');

console.log('Running linter and syntax checks...');

// 1. Check JS syntax
try {
  execSync('npx esbuild src/js/main.js --bundle --outfile=/dev/null', { cwd: root, stdio: 'pipe' });
  console.log('✔ JS source syntax valid');
} catch (e) {
  console.error('✖ JS syntax error:', e.stderr.toString());
  process.exit(1);
}

// 2. Check CSS syntax
try {
  execSync('npx esbuild src/css/main.css --bundle --outfile=/dev/null', { cwd: root, stdio: 'pipe' });
  console.log('✔ CSS source syntax valid');
} catch (e) {
  console.error('✖ CSS syntax error:', e.stderr.toString());
  process.exit(1);
}

// 3. Check Python sitegen syntax
try {
  execSync('python3 -m py_compile build_pages.py scripts/sitegen/*.py scripts/sitegen/pages/*.py', { cwd: root, stdio: 'pipe' });
  console.log('✔ Python sitegen syntax valid');
} catch (e) {
  console.error('✖ Python syntax error:', e.stderr.toString());
  process.exit(1);
}

console.log('🎉 All linting checks passed successfully!\n');
