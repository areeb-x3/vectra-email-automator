// Simulated API Response Structure for Guides

export const featuredGuide = {
  id: 'feat-1',
  title: 'Mastering Autonomous Email Workflows',
  description: 'Learn how to construct self-healing email sequences that adapt to user engagement in real-time. A deep dive into Vectra\'s core autonomous engine.',
  category: 'Automation',
  readTime: '8 min',
  difficulty: 'Advanced',
  author: { name: 'Vectra Intelligence', avatar: 'V' },
  image: 'gradient-primary', // We will use CSS gradients or abstract UI visuals instead of stock images
  tags: ['Autonomous', 'Sequences', 'AI'],
  engagement: { saves: 1205, views: 8400 },
  isOfficial: true,
  content: `
    <h2>The Future of Outbound</h2>
    <p>Outbound email isn't dead, it's just evolving. In a world saturated with generic cold outreach, autonomous sequences allow your campaigns to adapt based on prospect behavior in real-time. This is the difference between a 2% and a 20% reply rate.</p>
    
    <blockquote>"The best outreach feels like serendipity, not automation." — Vectra Design Team</blockquote>
    
    <h3>Core Principles of Self-Healing</h3>
    <ul>
      <li><strong>Context over Volume:</strong> Stop sending the exact same template to 10,000 people. Segment by firmographics.</li>
      <li><strong>Behavioral Triggers:</strong> If a prospect clicks a pricing link but doesn't reply, the autonomous engine automatically shifts them to a high-intent track.</li>
      <li><strong>Self-Healing:</strong> If open rates drop below baseline, the system automatically pauses and suggests A/B variations.</li>
    </ul>

    <p>In this guide, we'll walk through setting up your first self-healing sequence using Vectra's visual builder. You'll learn how to map out decision trees that feel completely natural to the recipient.</p>
  `
};

export const officialGuides = [
  {
    id: 'off-1',
    title: 'Setting up your first Smart Scheduler',
    description: 'A step-by-step walkthrough to ensure your emails hit inboxes exactly when your leads are most active.',
    category: 'Scheduler',
    readTime: '4 min',
    difficulty: 'Beginner',
    tags: ['Timing', 'Delivery'],
    engagement: { saves: 4320, views: 15000 },
    isOfficial: true,
    content: `
      <h2>Why Timing is Everything</h2>
      <p>Sending an email at 2 AM on a Saturday is a guaranteed way to get ignored. The Smart Scheduler ensures your emails land exactly when your prospect is actually at their desk, sipping their morning coffee.</p>
      
      <h3>Setting up Dynamic Timezones</h3>
      <p>Follow these quick steps to enable local delivery:</p>
      <ul>
        <li>Navigate to the <strong>Scheduler</strong> tab in your dashboard.</li>
        <li>Enable <strong>Dynamic Timezone Matching</strong>. Vectra will automatically infer the recipient's timezone from their domain or location data.</li>
        <li>Set your optimal operating hours (e.g., 9 AM - 11 AM local time).</li>
      </ul>

      <p>Vectra will now queue your emails and release them asynchronously. You can monitor the queue in real-time from the Activity Feed.</p>
    `
  },
  {
    id: 'off-2',
    title: 'Connecting Multiple Organisations',
    description: 'Manage diverse client portfolios efficiently with Vectra\'s unified workspace architecture.',
    category: 'Workspace',
    readTime: '6 min',
    difficulty: 'Intermediate',
    tags: ['Multi-tenant', 'Architecture'],
    engagement: { saves: 2100, views: 9800 },
    isOfficial: true,
  },
  {
    id: 'off-3',
    title: 'Dynamic Variables & Personalization',
    description: 'Go beyond basic names. Use conditional logic to craft uniquely tailored messaging at scale.',
    category: 'Personalization',
    readTime: '5 min',
    difficulty: 'Intermediate',
    tags: ['Variables', 'Logic'],
    engagement: { saves: 3400, views: 12200 },
    isOfficial: true,
  }
];

export const communityGuides = [
  {
    id: 'com-1',
    title: 'My 90% Open Rate Cold Outreach System',
    description: 'I documented the exact delay structure and conditional triggers I use for high-ticket B2B sales.',
    category: 'Workflow',
    readTime: '10 min',
    difficulty: 'Advanced',
    author: { name: 'Sarah J.', avatar: 'SJ' },
    tags: ['B2B', 'Cold Email'],
    engagement: { saves: 890, likes: 1200 },
    isOfficial: false,
    trending: true,
    content: `
      <h2>My 90% Open Rate Secret</h2>
      <p>Most people overcomplicate their cold outreach. They write essays. They use huge HTML templates. Here is the exact, simplified framework I use to get meetings with C-level executives.</p>

      <h3>The Subject Line</h3>
      <p>Keep it to 2-3 words. Lowercase. Make it look like an internal memo from a colleague. Never use exclamation marks.</p>
      <blockquote>Example: <em>quick question re: {{company}}</em></blockquote>

      <h3>The Body Framework</h3>
      <ul>
        <li><strong>Observation:</strong> "Saw you just raised Series A. Congrats!"</li>
        <li><strong>Problem:</strong> "Usually, scaling sales teams struggle with inbox deliverability at this stage."</li>
        <li><strong>Solution:</strong> "We built a tool that fixes this automatically."</li>
        <li><strong>Soft CTA:</strong> "Worth a quick chat?"</li>
      </ul>

      <p>That's it. Keep it under 50 words. Don't send a novel.</p>
    `
  },
  {
    id: 'com-2',
    title: 'Integrating Vectra with Notion via Webhooks',
    description: 'A quick guide on pushing your campaign analytics straight into your Notion CRM databases.',
    category: 'Integration',
    readTime: '7 min',
    difficulty: 'Advanced',
    author: { name: 'DevMike', avatar: 'DM' },
    tags: ['Notion', 'Webhooks'],
    engagement: { saves: 450, likes: 620 },
    isOfficial: false,
    trending: false,
  },
  {
    id: 'com-3',
    title: 'The Perfect Follow-Up Cadence',
    description: 'Stop guessing. Here is the statistical approach to spacing out your follow-up emails without being annoying.',
    category: 'Strategy',
    readTime: '5 min',
    difficulty: 'Beginner',
    author: { name: 'GrowthHacker', avatar: 'GH' },
    tags: ['Follow-up', 'Strategy'],
    engagement: { saves: 1120, likes: 980 },
    isOfficial: false,
    trending: true,
  }
];

export const quickTips = [
  {
    id: 'tip-1',
    content: 'Always use the A/B testing block for subject lines before a massive broadcast.',
    module: 'Automation',
  },
  {
    id: 'tip-2',
    content: 'Group your contacts by timezone to maximize your smart scheduler\'s efficiency.',
    module: 'Scheduler',
  },
  {
    id: 'tip-3',
    content: 'Use {{fallback:friend}} to ensure your variables never look broken.',
    module: 'Personalization',
  }
];

// Helper to simulate API fetching
export const fetchGuidesData = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        featured: featuredGuide,
        official: officialGuides,
        community: communityGuides,
        tips: quickTips
      });
    }, 800); // simulate network delay
  });
};
