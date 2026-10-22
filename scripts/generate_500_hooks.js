import fs from 'node:fs';
import path from 'node:path';

// --- Category Catalog ---

const CATEGORIES = [
  { id: 'contrarian', name: 'Contrarian & Hot Takes', count: 0 },
  { id: 'data-proof', name: 'Data, Metrics & Case Studies', count: 0 },
  { id: 'storytelling', name: 'Personal Journey & Failures', count: 0 },
  { id: 'curation', name: 'Curated Lists & Toolkits', count: 0 },
  { id: 'how-to', name: 'Actionable Step-by-Step Guides', count: 0 },
  { id: 'breakdown', name: 'Architecture & Teardowns', count: 0 },
  { id: 'templates', name: 'Prompts, Frameworks & Checklists', count: 0 }
];

// --- Core Patterns ---

const CORE_TEMPLATES = [
  // Contrarian
  { cat: 'contrarian', t: 'Stop using {tool_a} for {task}. In 2026, {tool_b} is 10x better and costs $0:', p: 'all', tone: 'provocative' },
  { cat: 'contrarian', t: 'Unpopular opinion: {myth_belief} is completely dead in modern software engineering.', p: 'x', tone: 'debate' },
  { cat: 'contrarian', t: 'Most developers spend 80% of their time on {distraction}. Here is what actually moves the needle:', p: 'all', tone: 'direct' },
  { cat: 'contrarian', t: 'We replaced our entire {stack_layer} with 50 lines of vanilla {lang}. The result:', p: 'all', tone: 'minimalist' },
  { cat: 'contrarian', t: 'Why your {system_type} does NOT need {overkill_tech} (and why it is slowing you down):', p: 'linkedin', tone: 'authoritative' },
  { cat: 'contrarian', t: 'Hard truth: Building a {product_type} is easy. Getting {goal_metric} without paying for ads is the real challenge.', p: 'all', tone: 'bold' },
  { cat: 'contrarian', t: 'I stopped doing {standard_routine}. My engineering velocity instantly doubled.', p: 'all', tone: 'insight' },
  { cat: 'contrarian', t: 'Do not hire a {role_title} until you have automated {bottleneck_process}. Here is our playbook:', p: 'linkedin', tone: 'strategic' },

  // Data & Case Studies
  { cat: 'data-proof', t: 'We spent ${ad_spend} testing {strategy_name}. Here is the exact ROI and analytics breakdown:', p: 'all', tone: 'analytical' },
  { cat: 'data-proof', t: 'How our database latency went from {latency_before}ms down to {latency_after}ms with zero code rewrites:', p: 'all', tone: 'technical' },
  { cat: 'data-proof', t: 'From 0 to {traffic_num} monthly organic visitors in {timeframe}: The exact SEO strategy we used:', p: 'all', tone: 'case-study' },
  { cat: 'data-proof', t: 'We analyzed {sample_count} {content_medium} posts. The top 1% all shared these 3 subtle patterns:', p: 'linkedin', tone: 'empirical' },
  { cat: 'data-proof', t: 'Cost audit: How we run a production {service_type} serving {req_count} requests for ${bill_amount}/month:', p: 'all', tone: 'transparent' },
  { cat: 'data-proof', t: 'We A/B tested {variable_a} vs {variable_b} on {target_audience} for 30 days. The winner was clear:', p: 'all', tone: 'data-driven' },
  { cat: 'data-proof', t: '{metric_name} increased by {percentage}% after removing this one annoying step from our onboarding:', p: 'linkedin', tone: 'growth' },
  { cat: 'data-proof', t: 'Real server metrics: Here is what happens when {event_name} hits your infrastructure simultaneously:', p: 'all', tone: 'deep-dive' },

  // Storytelling & Failure
  { cat: 'storytelling', t: 'I lost ${money_lost} on my first SaaS because I ignored this single rule:', p: 'all', tone: 'vulnerable' },
  { cat: 'storytelling', t: 'How an unnoticed bug deleted {data_item} at 2 AM on a Sunday (and how we recovered):', p: 'all', tone: 'dramatic' },
  { cat: 'storytelling', t: 'I spent {months_count} months building in secret. Nobody signed up. 5 lessons on early validation:', p: 'all', tone: 'confessional' },
  { cat: 'storytelling', t: 'From burned out senior developer to building a ${target_income} solo software studio: Year 1 review:', p: 'linkedin', tone: 'inspiring' },
  { cat: 'storytelling', t: 'Our biggest enterprise customer almost canceled when {crisis_event} happened. Here is how we turned it around:', p: 'linkedin', tone: 'resilient' },
  { cat: 'storytelling', t: 'The hardest technical decision we made in 2026: Why we walked away from {tempting_opportunity}:', p: 'all', tone: 'thoughtful' },
  { cat: 'storytelling', t: 'I was rejected by {company_type} twice. 3 years later, they are paying for our software:', p: 'linkedin', tone: 'triumph' },
  { cat: 'storytelling', t: 'What 5 years of shipping solo projects taught me about consistency, burnout, and distribution:', p: 'all', tone: 'reflective' },

  // Curation & Toolkits
  { cat: 'curation', t: '10 open-source repositories that will make you a significantly better {dev_specialty} engineer:', p: 'all', tone: 'high-value' },
  { cat: 'curation', t: 'The ultimate zero-cost tech stack for shipping MVPs in 2026 (bookmark this):', p: 'all', tone: 'curated' },
  { cat: 'curation', t: '7 free developer APIs that feel illegal to know (and can power your entire next project):', p: 'all', tone: 'viral' },
  { cat: 'curation', t: 'The top 8 tools high-output solo founders use to do the work of a 5-person team:', p: 'linkedin', tone: 'practical' },
  { cat: 'curation', t: '5 essential CLI tools that will completely replace slow browser dashboards in your workflow:', p: 'all', tone: 'developer' },
  { cat: 'curation', t: 'My personal swipe file of 20 high-converting {product_category} landing pages (with breakdown):', p: 'linkedin', tone: 'design' },
  { cat: 'curation', t: 'The 6 best books on system architecture that will never go out of date:', p: 'all', tone: 'timeless' },
  { cat: 'curation', t: '9 terminal commands every software engineer should know by heart:', p: 'all', tone: 'educational' },

  // How-To & Guides
  { cat: 'how-to', t: 'How to build an automated {pipeline_type} in under 15 minutes using open-source tools (step-by-step):', p: 'all', tone: 'tactical' },
  { cat: 'how-to', t: 'How to repurpose a single technical blog post into 5 high-impact social posts in 10 minutes:', p: 'all', tone: 'workflow' },
  { cat: 'how-to', t: 'A complete guide to indexing your new website on Google in under 48 hours:', p: 'all', tone: 'actionable' },
  { cat: 'how-to', t: 'How to scale your PostgreSQL database without upgrading your server tier (5 quick wins):', p: 'all', tone: 'performance' },
  { cat: 'how-to', t: 'The 4-step framework to test and validate your SaaS landing page before launch:', p: 'linkedin', tone: 'strategic' },
  { cat: 'how-to', t: 'How to write clean API documentation that third-party developers actually praise:', p: 'all', tone: 'craft' },
  { cat: 'how-to', t: 'How to set up automated zero-downtime deploys on a cheap $5 VPS (full bash script included):', p: 'all', tone: 'devops' },
  { cat: 'how-to', t: 'How to find your first 100 paying software customers using targeted community discussions:', p: 'linkedin', tone: 'acquisition' },

  // Breakdown & Architecture
  { cat: 'breakdown', t: 'Architecture teardown: How {big_company} processes {huge_traffic} with zero latency:', p: 'all', tone: 'system-design' },
  { cat: 'breakdown', t: 'Under the hood of {modern_library}: What happens when you call {popular_function}():', p: 'all', tone: 'deep-dive' },
  { cat: 'breakdown', t: 'How we structured our database schema to handle {data_volume} rows without slowing down:', p: 'all', tone: 'database' },
  { cat: 'breakdown', t: 'The hidden engineering trade-offs of {architecture_choice} nobody tells you before production:', p: 'linkedin', tone: 'insightful' },
  { cat: 'breakdown', t: 'Reverse-engineering the cache layer of {popular_platform}: 3 architectural lessons:', p: 'all', tone: 'technical' },
  { cat: 'breakdown', t: 'How modern AI agents manage memory, context windows, and tool execution under the hood:', p: 'all', tone: 'frontier-tech' },
  { cat: 'breakdown', t: 'A visual breakdown of how WebSockets, Long Polling, and SSE compare in real-world scenarios:', p: 'all', tone: 'architecture' },
  { cat: 'breakdown', t: 'Teardown of a $50k/month micro-SaaS: Tech stack, hosting costs, and architecture diagram:', p: 'all', tone: 'transparency' },

  // Templates & Frameworks
  { cat: 'templates', t: 'Copy & paste: The exact prompt template I use to generate 30 days of high-signal content:', p: 'all', tone: 'high-utility' },
  { cat: 'templates', t: 'The pre-launch checklist every developer should run through 24 hours before going live:', p: 'all', tone: 'checklist' },
  { cat: 'templates', t: 'A simple README.md template that turns casual GitHub visitors into contributors and stars:', p: 'all', tone: 'open-source' },
  { cat: 'templates', t: 'The technical review framework we use to catch 90% of bugs before code review:', p: 'linkedin', tone: 'process' },
  { cat: 'templates', t: 'Cold outreach template: How we pitched our developer tool to 50 engineering leads with a 42% response rate:', p: 'linkedin', tone: 'sales' },
  { cat: 'templates', t: 'The incident post-mortem template our team fills out after every production outage:', p: 'all', tone: 'devops' },
  { cat: 'templates', t: 'The 5-question framework to decide whether to build a custom feature or buy an off-the-shelf tool:', p: 'linkedin', tone: 'framework' },
  { cat: 'templates', t: 'Standard operating procedure: How we onboard a new developer to our codebase in under 2 hours:', p: 'all', tone: 'productivity' }
];

// --- Niche Variations ---

const DOMAINS = [
  { prefix: '', suffix: '' },
  { prefix: '🧵 THREAD: ', suffix: ' 👇' },
  { prefix: '⚡ QUICK GUIDE: ', suffix: '' },
  { prefix: '💡 LESSON: ', suffix: ' Let us break it down:' },
  { prefix: '🚨 PSA for developers: ', suffix: '' },
  { prefix: '📌 Bookmark this: ', suffix: '' },
  { prefix: '🚀 Launch Breakdown: ', suffix: '' },
  { prefix: '🔥 Hot Take: ', suffix: '' },
  { prefix: '📊 Case Study: ', suffix: ' Full breakdown below:' },
  { prefix: '🛠️ Tech Stack Teardown: ', suffix: '' }
];

// --- Generation Loop ---

const hooks = [];
let id = 1;

for (let d = 0; d < DOMAINS.length; d++) {
  const domain = DOMAINS[d];
  for (let c = 0; c < CORE_TEMPLATES.length; c++) {
    const item = CORE_TEMPLATES[c];
    const fullTemplate = `${domain.prefix}${item.t}${domain.suffix}`.trim();

    hooks.push({
      id: `hook-${String(id++).padStart(4, '0')}`,
      category: item.cat,
      template: fullTemplate,
      platform: item.p,
      tone: item.tone,
      charCount: fullTemplate.length,
      source: 'PostReady Open Dataset (https://postready.org)'
    });

    if (hooks.length >= 520) break;
  }
  if (hooks.length >= 520) break;
}

// Update category counts
for (const cat of CATEGORIES) {
  cat.count = hooks.filter(h => h.category === cat.id).length;
}

const payload = {
  meta: {
    title: 'Awesome Tech Hooks',
    description: 'Curated open-source dataset of 500+ viral hooks and opening frameworks for tech builders, indie hackers, and engineers.',
    version: '1.0.0',
    total: hooks.length,
    updatedAt: '2026-10-21',
    author: 'eco-null <emrecanozdal@gmail.com>',
    homepage: 'https://postready.org',
    license: 'MIT'
  },
  categories: CATEGORIES,
  hooks: hooks
};

// Write data files
const dataDir = path.resolve('data');
fs.mkdirSync(dataDir, { recursive: true });
fs.writeFileSync(path.join(dataDir, 'hooks.json'), JSON.stringify(payload, null, 2));

const csvHeader = 'id,category,platform,tone,charCount,template\n';
const csvLines = hooks.map(h => `${h.id},${h.category},${h.platform},${h.tone},${h.charCount},"${h.template.replace(/"/g, '""')}"`).join('\n');
fs.writeFileSync(path.join(dataDir, 'hooks.csv'), csvHeader + csvLines);

console.log(`✓ Successfully generated ${hooks.length} hooks across ${CATEGORIES.length} categories.`);
