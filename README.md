# awesome-tech-hooks

> 500+ proven, high-performing hook frameworks and opening lines for developers, indie hackers, and tech founders on X & LinkedIn. Available as JSON, CSV, and interactive CLI.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Hooks Count](https://img.shields.io/badge/hooks-520-brightgreen.svg)](data/hooks.json)
[![Formats](https://img.shields.io/badge/formats-JSON%20%7C%20CSV%20%7C%20CLI-orange.svg)](data/)
[![Powered by PostReady](https://img.shields.io/badge/Powered%20by-PostReady.org-purple.svg)](https://postready.org/en/tools/hook-generator)

A curated, battle-tested collection of opening hooks reverse-engineered from viral technical threads, engineering teardowns, and SaaS launch posts.

Part of the **[PostReady.org](https://postready.org)** open-source toolkit.

---
## Categories & Coverage

| Category | Hooks | Focus Area |
| :--- | :--- | :--- |
| `contrarian` | ~80 | Debunking tech myths, unpopular opinions, minimalist stacks |
| `data-proof` | ~80 | Metrics, benchmark numbers, latency improvements, A/B test results |
| `storytelling` | ~80 | Post-mortems, 3 AM production outages, solo founder lessons |
| `curation` | ~70 | Developer toolkits, cheat sheets, free APIs, swipe files |
| `how-to` | ~70 | Step-by-step engineering workflows, automation recipes |
| `breakdown` | ~70 | System architecture teardowns, database scaling case studies |
| `templates` | ~70 | Checklists, standard operating procedures, outreach copy |

---
## Quick Start (Interactive CLI)

Explore hooks directly from your terminal with `npx`:

```bash
# Get a random hook template
npx awesome-tech-hooks --random

# Search hooks by topic (e.g. database, AI, latency)
npx awesome-tech-hooks --search "database"

# Browse a specific category
npx awesome-tech-hooks --category contrarian --count 5

# List all categories and counts
npx awesome-tech-hooks --list-categories

# Output JSON for scripts or pipelines
npx awesome-tech-hooks --random --json
```

---
## Dataset Formats

The full dataset is available in two raw formats in the `/data` folder:

- **JSON:** [`data/hooks.json`](data/hooks.json) (structured with metadata, tone, and character count)
- **CSV:** [`data/hooks.csv`](data/hooks.csv) (ready for Excel, Google Sheets, or Pandas)

### Schema (JSON):

```json
{
  "id": "hook-0042",
  "category": "data-proof",
  "template": "Our API latency dropped from {latency_old}ms to {latency_new}ms after one single database tweak:",
  "platform": "all",
  "tone": "technical",
  "charCount": 97,
  "source": "PostReady Open Dataset (https://postready.org)"
}
```

---
## Programmatic Usage

### JavaScript / TypeScript:

```javascript
import { getRandomHook, searchHooks, fillTemplate } from 'awesome-tech-hooks';

// Get a random contrarian hook
const hook = getRandomHook('contrarian');
console.log(hook.template);
// "Stop using {tool_a} for {task}. In 2026, {tool_b} is 10x better and costs $0:"

// Fill in dynamic parameters
const finalPost = fillTemplate(hook.template, {
  tool_a: 'Redis',
  task: 'simple key-value caching',
  tool_b: 'in-memory SQLite'
});
console.log(finalPost);
```

### Python / Pandas:

```python
import pandas as pd

df = pd.read_csv('https://raw.githubusercontent.com/eco-null/awesome-tech-hooks/main/data/hooks.csv')

# Filter for storytelling hooks
stories = df[df['category'] == 'storytelling']
print(stories[['id', 'template']].head())
```

---
## Need AI-Generated Hooks?

If you prefer AI to write customized hooks based on your exact code, article, or topic:
 **[PostReady AI Hook Generator](https://postready.org/en/tools/hook-generator)** — 25 free credits, optimized for X & LinkedIn algorithms.

Also explore:
- [Tweet to LinkedIn Formatter](https://postready.org/en/tools/tweet-to-linkedin)
- [Thread Splitter](https://postready.org/en/tools/thread-splitter)
- [Social Text Styler](https://postready.org/en/tools/linkedin-text-formatter)

---
## License

MIT © [eco-null](https://github.com/eco-null)
