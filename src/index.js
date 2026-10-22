import fs from 'node:fs';
import path from 'node:path';

// --- Dataset Loader ---

const datasetPath = new URL('../data/hooks.json', import.meta.url);
const dataset = JSON.parse(fs.readFileSync(datasetPath, 'utf8'));

export const CATEGORIES = dataset.categories;
export const HOOKS = dataset.hooks;
export const META = dataset.meta;

// --- Query Utilities ---

export function getHooksByCategory(category) {
  if (!category) return HOOKS;
  const target = category.toLowerCase();
  return HOOKS.filter(h => h.category.toLowerCase() === target);
}

export function getRandomHook(category = null) {
  const pool = category ? getHooksByCategory(category) : HOOKS;
  if (!pool.length) return null;
  const index = Math.floor(Math.random() * pool.length);
  return pool[index];
}

export function searchHooks(query) {
  if (!query) return HOOKS;
  const term = query.toLowerCase();
  return HOOKS.filter(h => 
    h.template.toLowerCase().includes(term) ||
    h.category.toLowerCase().includes(term) ||
    h.tone.toLowerCase().includes(term)
  );
}

export function fillTemplate(template, variables = {}) {
  let result = template;
  for (const [key, val] of Object.entries(variables)) {
    result = result.replaceAll(`{${key}}`, val);
  }
  return result;
}
