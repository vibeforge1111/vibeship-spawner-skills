#!/usr/bin/env node

/**
 * Sync Skill Count
 *
 * Counts actual skills and updates all documentation files.
 * Run this after adding new skills to keep counts consistent.
 *
 * Usage: node scripts/sync-count.js
 */

const fs = require('fs');
const path = require('path');

const SKILLS_DIR = path.join(__dirname, '..');
const EXCLUDED_DIRS = ['.git', '.github', 'scripts', 'cli', 'node_modules'];

// Files to update with skill count
const FILES_TO_UPDATE = [
  { path: 'README.md', pattern: /\*\*\d+\+? skills\*\*/g, replacement: (count) => `**${count}+ skills**` },
  { path: 'cli/README.md', pattern: /\d+\+? specialist skills/g, replacement: (count) => `${count}+ specialist skills` },
  { path: 'cli/package.json', pattern: /\d+\+? specialist skills/g, replacement: (count) => `${count}+ specialist skills` },
];

function countSkills() {
  let total = 0;
  const categories = {};

  const dirs = fs.readdirSync(SKILLS_DIR).filter(f => {
    const fullPath = path.join(SKILLS_DIR, f);
    return fs.statSync(fullPath).isDirectory() && !EXCLUDED_DIRS.includes(f) && !f.startsWith('.');
  });

  for (const category of dirs) {
    const categoryPath = path.join(SKILLS_DIR, category);
    const skills = fs.readdirSync(categoryPath).filter(f => {
      const skillPath = path.join(categoryPath, f);
      return fs.statSync(skillPath).isDirectory();
    });

    if (skills.length > 0) {
      categories[category] = skills.length;
      total += skills.length;
    }
  }

  return { total, categories };
}

function updateFile(filePath, pattern, replacement, count) {
  const fullPath = path.join(SKILLS_DIR, filePath);

  if (!fs.existsSync(fullPath)) {
    console.log(`  ⚠ File not found: ${filePath}`);
    return false;
  }

  const content = fs.readFileSync(fullPath, 'utf8');
  const newContent = content.replace(pattern, replacement(count));

  if (content !== newContent) {
    const tmpPath = fullPath + '.tmp';
    fs.writeFileSync(tmpPath, newContent);
    fs.renameSync(tmpPath, fullPath);
    console.log(`  ✓ Updated: ${filePath}`);
    return true;
  } else {
    console.log(`  - No change: ${filePath}`);
    return false;
  }
}

function main() {
  console.log(`
┌─────────────────────────────────────────────────────────────────┐
│  SKILL COUNT SYNC                                               │
└─────────────────────────────────────────────────────────────────┘
`);

  const { total, categories } = countSkills();

  console.log('Skill Count by Category:');
  console.log('─'.repeat(40));

  const sortedCategories = Object.entries(categories).sort((a, b) => b[1] - a[1]);
  for (const [category, count] of sortedCategories) {
    console.log(`  ${category.padEnd(20)} ${count}`);
  }

  console.log('─'.repeat(40));
  console.log(`  ${'TOTAL'.padEnd(20)} ${total}`);
  console.log('');

  console.log('Updating files...');
  let updated = 0;

  for (const file of FILES_TO_UPDATE) {
    if (updateFile(file.path, file.pattern, file.replacement, total)) {
      updated++;
    }
  }

  console.log('');
  if (updated > 0) {
    console.log(`✓ Updated ${updated} file(s) with count: ${total}+`);
    console.log('');
    console.log('Don\'t forget to commit the changes!');
  } else {
    console.log('✓ All files already up to date');
  }
}

main();
