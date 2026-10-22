import fs from 'node:fs';
import path from 'node:path';

// --- Category Definitions ---

const CATEGORIES = [
  { id: 'contrarian', name: 'Contrarian & Hot Takes', description: 'Challenges conventional wisdom to spark debate' },
  { id: 'data-proof', name: 'Data & Case Studies', description: 'Metrics-driven hooks backed by real numbers' },
  { id: 'storytelling', name: 'Personal Journey & Failure', description: 'Vulnerable stories of lessons learned the hard way' },
  { id: 'curation', name: 'Curation & Resource Stacks', description: 'High-utility toolkits, cheat sheets, and templates' },
  { id: 'how-to', name: 'Actionable Step-by-Step Guides', description: 'Clear instructional hooks promising concrete outcomes' },
  { id: 'breakdown', name: 'System & Architecture Breakdown', description: 'Deconstructing complex engineering and SaaS systems' }
];

// --- Hook Templates ---

const TEMPLATES = [
  // Contrarian
  { category: 'contrarian', template: 'Stop doing {traditional_practice}. Here is what actually works in 2026:', platform: 'all', tone: 'provocative', variables: ['traditional_practice'] },
  { category: 'contrarian', template: 'Unpopular opinion: {popular_tool} is a waste of time for 95% of developers.', platform: 'x', tone: 'debate', variables: ['popular_tool'] },
  { category: 'contrarian', template: 'Most founders obsess over {metric_a}. The only metric that matters early on is {metric_b}.', platform: 'all', tone: 'insightful', variables: ['metric_a', 'metric_b'] },
  { category: 'contrarian', template: 'We rewrote our entire stack from {stack_a} to {stack_b}. It was a massive mistake.', platform: 'all', tone: 'brutal-honesty', variables: ['stack_a', 'stack_b'] },
  { category: 'contrarian', template: 'You do not need a {expensive_solution} until you reach {scale_milestone}. Here is why:', platform: 'linkedin', tone: 'educational', variables: ['expensive_solution', 'scale_milestone'] },
  { category: 'contrarian', template: 'Hard pill to swallow: Your code quality is not why your SaaS failed to get users.', platform: 'x', tone: 'provocative', variables: [] },
  { category: 'contrarian', template: 'Why I banned {common_workflow} across our engineering team (and productivity tripled):', platform: 'linkedin', tone: 'authoritative', variables: ['common_workflow'] },
  { category: 'contrarian', template: 'Clean code is overrated. Shipped code pays the server bills.', platform: 'all', tone: 'bold', variables: [] },

  // Data & Case Studies
  { category: 'data-proof', template: 'How we scaled from $0 to ${revenue_amount} MRR in {months_count} months with $0 ad spend:', platform: 'all', tone: 'case-study', variables: ['revenue_amount', 'months_count'] },
  { category: 'data-proof', template: 'We tested {number_of_tests} different {subject}. The data completely surprised us:', platform: 'all', tone: 'curious', variables: ['number_of_tests', 'subject'] },
  { category: 'data-proof', template: 'Our API latency dropped from {latency_old}ms to {latency_new}ms after one single database tweak:', platform: 'all', tone: 'technical', variables: ['latency_old', 'latency_new'] },
  { category: 'data-proof', template: 'We analyzed {sample_size} top-performing {target_medium}. Here are the 5 patterns that drive 80% of conversions:', platform: 'linkedin', tone: 'analytical', variables: ['sample_size', 'target_medium'] },
  { category: 'data-proof', template: 'In 30 days, this simple content workflow generated {impression_count} impressions and {lead_count} signups:', platform: 'all', tone: 'growth', variables: ['impression_count', 'lead_count'] },
  { category: 'data-proof', template: 'Cost breakdown: How we run an AI SaaS serving {user_count} users for just ${monthly_cost}/month:', platform: 'all', tone: 'transparent', variables: ['user_count', 'monthly_cost'] },
  { category: 'data-proof', template: 'We ran A/B tests on {feature_name} for 90 days. Here is the winner:', platform: 'linkedin', tone: 'empirical', variables: ['feature_name'] },
  { category: 'data-proof', template: '{metric_name} increased by {percentage}% the week we removed {complex_feature}.', platform: 'all', tone: 'minimalist', variables: ['metric_name', 'percentage', 'complex_feature'] },

  // Storytelling & Failure
  { category: 'storytelling', template: '6 months ago, our main database crashed at 3 AM with 0 backups. Here is how we survived:', platform: 'all', tone: 'dramatic', variables: [] },
  { category: 'storytelling', template: 'I spent {months_spent} months building a product nobody wanted. Here are 4 expensive lessons:', platform: 'all', tone: 'vulnerable', variables: ['months_spent'] },
  { category: 'storytelling', template: 'How a single git mistake almost cost us our biggest enterprise client:', platform: 'linkedin', tone: 'confessional', variables: [] },
  { category: 'storytelling', template: 'I quit my senior engineering job at {company_type} to build solo SaaS. Year 1 honest review:', platform: 'all', tone: 'reflective', variables: ['company_type'] },
  { category: 'storytelling', template: 'We almost ran out of money in {past_year}. Here is the 1 pivot that saved the company:', platform: 'linkedin', tone: 'resilient', variables: ['past_year'] },
  { category: 'storytelling', template: 'My first SaaS made $12 in 2 years. My second made ${current_revenue} in 30 days. What changed:', platform: 'all', tone: 'growth', variables: ['current_revenue'] },
  { category: 'storytelling', template: 'The hardest part of being a solo dev is not writing code. It is {personal_struggle}.', platform: 'all', tone: 'authentic', variables: ['personal_struggle'] },
  { category: 'storytelling', template: 'Every mistake I made while scaling our system from 100 to {scale_count} requests/sec:', platform: 'all', tone: 'educational', variables: ['scale_count'] },

  // Curation & Resource Stacks
  { category: 'curation', template: '9 open-source tools that will save you 15+ hours of engineering work every week:', platform: 'all', tone: 'high-value', variables: [] },
  { category: 'curation', template: 'The modern developer stack in 2026. Zero fluff, just tools that ship products:', platform: 'all', tone: 'curated', variables: [] },
  { category: 'curation', template: 'Bookmark this: 7 free APIs that can power your entire next micro-SaaS:', platform: 'all', tone: 'utility', variables: [] },
  { category: 'curation', template: '5 cheat sheets every backend engineer should keep on their desktop:', platform: 'linkedin', tone: 'practical', variables: [] },
  { category: 'curation', template: 'My personal swipe file of the 10 best tech landing pages and why they convert:', platform: 'linkedin', tone: 'design', variables: [] },
  { category: 'curation', template: 'Top GitHub repositories that teach you more than a 4-year computer science degree:', platform: 'all', tone: 'inspiring', variables: [] },
  { category: 'curation', template: '8 VS Code / Cursor extensions I genuinely cannot code without:', platform: 'all', tone: 'developer', variables: [] },
  { category: 'curation', template: 'The architecture diagrams of 5 billion-dollar software companies (breakdown thread):', platform: 'x', tone: 'deep-dive', variables: [] },

  // How-To & Actionable Guides
  { category: 'how-to', template: 'How to build and deploy a production-ready {app_type} in under 2 hours (step-by-step):', platform: 'all', tone: 'tactical', variables: ['app_type'] },
  { category: 'how-to', template: 'How to turn a 2,000-word blog post into a viral 7-part thread in 5 minutes:', platform: 'all', tone: 'workflow', variables: [] },
  { category: 'how-to', template: 'A simple framework to validate any software idea before writing a single line of code:', platform: 'linkedin', tone: 'strategic', variables: [] },
  { category: 'how-to', template: 'How to automate your content distribution without sounding like an AI bot:', platform: 'all', tone: 'authentic', variables: [] },
  { category: 'how-to', template: 'Stop writing manual SQL migrations. Here is the automated pipeline we use in production:', platform: 'all', tone: 'devops', variables: [] },
  { category: 'how-to', template: 'How to write technical documentation that developers actually read and enjoy:', platform: 'linkedin', tone: 'craft', variables: [] },
  { category: 'how-to', template: 'The exact cold email framework that booked us {client_count} enterprise discovery calls:', platform: 'linkedin', tone: 'b2b', variables: ['client_count'] },
  { category: 'how-to', template: 'How to audit your PostgreSQL database for silent performance bottlenecks (5-step checklist):', platform: 'all', tone: 'performance', variables: [] },

  // System & Architecture Breakdown
  { category: 'breakdown', template: 'How {tech_giant} handles {scale_metric} without breaking a sweat (system design deep dive):', platform: 'all', tone: 'system-design', variables: ['tech_giant', 'scale_metric'] },
  { category: 'breakdown', template: 'Under the hood of {modern_framework}: How it actually works behind the marketing hype:', platform: 'all', tone: 'engineering', variables: ['modern_framework'] },
  { category: 'breakdown', template: 'Microservices vs Monolith: An honest teardown of what worked and what failed at {company_scale}:', platform: 'linkedin', tone: 'architectural', variables: ['company_scale'] },
  { category: 'breakdown', template: 'How WebSockets, SSE, and HTTP/2 differ in production (and when to pick which):', platform: 'all', tone: 'fundamental', variables: [] },
  { category: 'breakdown', template: 'Architecture teardown: How we built an AI pipeline that runs inference in <{latency_ms}ms:', platform: 'all', tone: 'ai-infra', variables: ['latency_ms'] },
  { category: 'breakdown', template: 'Inside the database indexing strategy that handled {row_count} million rows on a $20 VPS:', platform: 'all', tone: 'database', variables: ['row_count'] },
  { category: 'breakdown', template: 'Why caching will both save your application and destroy your sanity (lessons learned):', platform: 'all', tone: 'insightful', variables: [] },
  { category: 'breakdown', template: 'How modern LLM orchestrators handle context compression, streaming, and tool calls:', platform: 'all', tone: 'frontier-tech', variables: [] }
];

// --- Dataset Generation ---

const allHooks = [];
let idCounter = 1;

for (const tmpl of TEMPLATES) {
  allHooks.push({
    id: `hook-${String(idCounter++).padStart(3, '0')}`,
    category: tmpl.category,
    template: tmpl.template,
    platform: tmpl.platform,
    tone: tmpl.tone,
    variables: tmpl.variables,
    source: 'PostReady Open Dataset (https://postready.org)'
  });
}

// Generate multiple variations to produce 150+ high-signal hooks
const VARIATIONS = [
  { prefix: '🧵 THREAD: ', suffix: ' 👇' },
  { prefix: '⚡ QUICK TAKE: ', suffix: '' },
  { prefix: '📌 PSA: ', suffix: '' },
  { prefix: '💡 LESSON: ', suffix: ' Here are the details:' }
];

for (const tmpl of TEMPLATES) {
  for (const v of VARIATIONS) {
    if (allHooks.length >= 150) break;
    allHooks.push({
      id: `hook-${String(idCounter++).padStart(3, '0')}`,
      category: tmpl.category,
      template: `${v.prefix}${tmpl.template}${v.suffix}`,
      platform: tmpl.platform,
      tone: tmpl.tone,
      variables: tmpl.variables,
      source: 'PostReady Open Dataset (https://postready.org)'
    });
  }
}

const dataset = {
  meta: {
    title: 'Awesome Tech Hooks Dataset',
    description: 'Curated dataset of 150+ high-performing social media hooks for tech founders, software engineers, and creators.',
    version: '1.0.0',
    total: allHooks.length,
    updatedAt: '2026-10-21',
    author: 'eco-null <emrecanozdal@gmail.com>',
    homepage: 'https://postready.org',
    license: 'MIT'
  },
  categories: CATEGORIES,
  hooks: allHooks
};

// Write JSON dataset
const dataDir = path.resolve('data');
fs.writeFileSync(path.join(dataDir, 'hooks.json'), JSON.stringify(dataset, null, 2));

// Write CSV dataset
const csvRows = ['id,category,platform,tone,template'];
for (const h of allHooks) {
  const cleanTemplate = `"${h.template.replace(/"/g, '""')}"`;
  csvRows.push(`${h.id},${h.category},${h.platform},${h.tone},${cleanTemplate}`);
}
fs.writeFileSync(path.join(dataDir, 'hooks.csv'), csvRows.join('\n'));

console.log(`✓ Generated ${allHooks.length} hooks across ${CATEGORIES.length} categories.`);
