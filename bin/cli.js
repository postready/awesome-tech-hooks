#!/usr/bin/env node

import fs from 'node:fs';
import { HOOKS, CATEGORIES, getRandomHook, getHooksByCategory, searchHooks } from '../src/index.js';

const pkg = JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url), 'utf8'));

// --- Color Palette ---

const c = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m'
};

// --- Help & Usage ---

function printHelp() {
  console.log(`
${c.bold}${c.cyan}awesome-tech-hooks${c.reset} v${pkg.version}
${c.dim}Curated dataset & CLI of 500+ viral hooks for developers and tech founders.${c.reset}
${c.dim}Powered by PostReady — ${c.blue}https://postready.org${c.reset}

${c.bold}USAGE:${c.reset}
  $ awesome-tech-hooks [options]

${c.bold}OPTIONS:${c.reset}
  ${c.green}-r, --random${c.reset}              Get a random hook template
  ${c.green}-c, --category <id>${c.reset}       Filter hooks by category
  ${c.green}-s, --search <query>${c.reset}       Search hooks by keyword
  ${c.green}--list-categories${c.reset}          List all available categories & counts
  ${c.green}-n, --count <num>${c.reset}          Number of results to display (default: 5)
  ${c.green}--json${c.reset}                      Output structured JSON
  ${c.green}-h, --help${c.reset}                  Show this help message
  ${c.green}-v, --version${c.reset}               Show version

${c.bold}EXAMPLES:${c.reset}
  $ awesome-tech-hooks --random
  $ awesome-tech-hooks --category contrarian
  $ awesome-tech-hooks --search "database"
  $ awesome-tech-hooks --list-categories
`);
}

function printCategories() {
  console.log(`\n${c.bold}${c.cyan}Awesome Tech Hooks Categories (Total: ${HOOKS.length}):${c.reset}\n`);
  CATEGORIES.forEach(cat => {
    console.log(`  ${c.bold}${cat.id.padEnd(16)}${c.reset} -> ${cat.name} ${c.dim}(${cat.count} hooks)${c.reset}`);
  });
  console.log(`\n${c.dim}Generate customized hooks with AI on: ${c.cyan}https://postready.org/en/tools/hook-generator${c.reset}\n`);
}

// --- Execution ---

function main() {
  const args = process.argv.slice(2);
  let random = false;
  let category = null;
  let search = null;
  let count = 5;
  let json = false;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '-h' || arg === '--help') {
      printHelp();
      process.exit(0);
    }
    if (arg === '-v' || arg === '--version') {
      console.log(`v${pkg.version}`);
      process.exit(0);
    }
    if (arg === '--list-categories') {
      printCategories();
      process.exit(0);
    }
    if (arg === '-r' || arg === '--random') {
      random = true;
      continue;
    }
    if (arg === '--json') {
      json = true;
      continue;
    }
    if (arg === '-c' || arg === '--category') {
      category = args[++i];
      continue;
    }
    if (arg === '-s' || arg === '--search') {
      search = args[++i];
      continue;
    }
    if (arg === '-n' || arg === '--count') {
      count = parseInt(args[++i], 10) || 5;
      continue;
    }
  }

  if (random) {
    const item = getRandomHook(category);
    if (!item) {
      console.error(`${c.yellow}No hooks found.${c.reset}`);
      process.exit(1);
    }
    if (json) {
      console.log(JSON.stringify(item, null, 2));
      return;
    }
    console.log(`\n${c.bold}${c.green}🎲 Random Hook [${item.category}]${c.reset}`);
    console.log(`\n${c.bold}"${item.template}"${c.reset}`);
    console.log(`\n${c.dim}Tone: ${item.tone} | Length: ${item.charCount} chars${c.reset}`);
    console.log(`${c.dim}Powered by PostReady — ${c.cyan}https://postready.org${c.reset}\n`);
    return;
  }

  let results = HOOKS;
  if (category) {
    results = getHooksByCategory(category);
  }
  if (search) {
    results = searchHooks(search);
  }

  if (!results.length) {
    console.log(`\n${c.yellow}No hooks matching your criteria.${c.reset}\n`);
    return;
  }

  const selected = results.slice(0, count);

  if (json) {
    console.log(JSON.stringify(selected, null, 2));
    return;
  }

  console.log(`\n${c.bold}${c.cyan}Awesome Tech Hooks (${selected.length} of ${results.length} shown):${c.reset}\n`);

  selected.forEach((item, idx) => {
    console.log(`${c.bold}${c.magenta}[${idx + 1}] ${item.category} (${item.tone})${c.reset}`);
    console.log(`    ${c.bold}"${item.template}"${c.reset}`);
    console.log(`    ${c.dim}ID: ${item.id} | ${item.charCount} chars${c.reset}\n`);
  });

  console.log(`${c.dim}More AI tools at: ${c.cyan}https://postready.org${c.reset}\n`);
}

main();
