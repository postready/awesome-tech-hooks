import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { HOOKS, CATEGORIES, getRandomHook, getHooksByCategory, searchHooks, fillTemplate } from '../src/index.js';

test('dataset contains at least 500 hooks', () => {
  assert.ok(HOOKS.length >= 500, `Expected >= 500 hooks, got ${HOOKS.length}`);
});

test('categories are properly configured with counts', () => {
  assert.ok(CATEGORIES.length >= 6);
  const totalInCategories = CATEGORIES.reduce((acc, c) => acc + c.count, 0);
  assert.equal(totalInCategories, HOOKS.length);
});

test('all hooks have valid properties and unique IDs', () => {
  const ids = new Set();
  for (const h of HOOKS) {
    assert.ok(h.id);
    assert.ok(!ids.has(h.id), `Duplicate ID found: ${h.id}`);
    ids.add(h.id);
    assert.ok(h.category);
    assert.ok(h.template);
    assert.ok(h.platform);
    assert.ok(h.charCount > 0);
  }
});

test('query helpers return expected results', () => {
  const random = getRandomHook();
  assert.ok(random);
  assert.ok(random.template);

  const contrarian = getHooksByCategory('contrarian');
  assert.ok(contrarian.length > 0);
  assert.equal(contrarian.every(h => h.category === 'contrarian'), true);

  const searched = searchHooks('database');
  assert.ok(searched.length > 0);
});

test('fillTemplate replaces placeholders accurately', () => {
  const template = 'We tested {tool_a} vs {tool_b}.';
  const filled = fillTemplate(template, { tool_a: 'Redis', tool_b: 'PostgreSQL' });
  assert.equal(filled, 'We tested Redis vs PostgreSQL.');
});

test('CSV file exists and matches record count', () => {
  const csv = fs.readFileSync(new URL('../data/hooks.csv', import.meta.url), 'utf8');
  const lines = csv.trim().split('\n');
  assert.equal(lines.length - 1, HOOKS.length);
});
