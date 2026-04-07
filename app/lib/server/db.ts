// D1/KV Database helper functions
// These are mock implementations since D1 bindings aren't fully set up yet

import type { PortfolioItem, BlogPost, ContactSubmission, AnalyticsEvent } from '~/types';

// Mock data based on the seed.sql file
const mockPortfolioItems: PortfolioItem[] = [
  {
    id: 1,
    title: 'E-Commerce Platform',
    description: 'A full-stack e-commerce solution with real-time inventory management and payment processing.',
    image_url: 'https://example.com/ecommerce.jpg',
    project_url: 'https://ecommerce-demo.example.com',
    github_url: 'https://github.com/example/ecommerce',
    technologies: ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
    featured: true,
    display_order: 1,
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 2,
    title: 'AI Dashboard',
    description: 'Analytics dashboard for machine learning model performance monitoring and data visualization.',
    image_url: 'https://example.com/dashboard.jpg',
    project_url: 'https://ai-dashboard.example.com',
    github_url: 'https://github.com/example/ai-dashboard',
    technologies: ['Python', 'TensorFlow', 'React', 'D3.js'],
    featured: true,
    display_order: 2,
    created_at: '2024-01-02T00:00:00.000Z',
    updated_at: '2024-01-02T00:00:00.000Z',
  },
  {
    id: 3,
    title: 'Mobile Banking App',
    description: 'Secure mobile banking application with biometric authentication and real-time transactions.',
    image_url: 'https://example.com/banking.jpg',
    project_url: null,
    github_url: 'https://github.com/example/banking-app',
    technologies: ['React Native', 'Node.js', 'MongoDB', 'Plaid'],
    featured: true,
    display_order: 3,
    created_at: '2024-01-03T00:00:00.000Z',
    updated_at: '2024-01-03T00:00:00.000Z',
  },
  {
    id: 4,
    title: 'CMS Platform',
    description: 'Headless content management system with GraphQL API and real-time collaboration features.',
    image_url: 'https://example.com/cms.jpg',
    project_url: 'https://cms-demo.example.com',
    github_url: 'https://github.com/example/cms',
    technologies: ['Next.js', 'GraphQL', 'Prisma', 'PostgreSQL'],
    featured: false,
    display_order: 4,
    created_at: '2024-01-04T00:00:00.000Z',
    updated_at: '2024-01-04T00:00:00.000Z',
  },
  {
    id: 5,
    title: 'DevOps Pipeline',
    description: 'CI/CD automation tool with deployment tracking and rollback capabilities.',
    image_url: 'https://example.com/devops.jpg',
    project_url: null,
    github_url: 'https://github.com/example/devops-pipeline',
    technologies: ['Go', 'Kubernetes', 'GitHub Actions', 'Terraform'],
    featured: false,
    display_order: 5,
    created_at: '2024-01-05T00:00:00.000Z',
    updated_at: '2024-01-05T00:00:00.000Z',
  },
];

const mockBlogPosts: BlogPost[] = [
  {
    id: 1,
    title: 'Getting Started with React Server Components',
    slug: 'getting-started-react-server-components',
    content: '<h1>Getting Started with React Server Components</h1><p>React Server Components represent a paradigm shift in how we build React applications...</p><h2>What are Server Components?</h2><p>Server Components allow you to render components on the server, reducing the JavaScript bundle size sent to the client...</p><h2>Benefits</h2><ul><li>Reduced bundle size</li><li>Direct backend access</li><li>Improved performance</li></ul>',
    excerpt: 'Learn how to leverage React Server Components to build faster, more efficient React applications with reduced client-side JavaScript.',
    cover_image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&h=675&fit=crop',
    tags: ['React', 'JavaScript', 'Performance'],
    published: true,
    published_at: '2024-03-15T10:00:00.000Z',
    created_at: '2024-03-15T10:00:00.000Z',
    updated_at: '2024-03-15T10:00:00.000Z',
  },
  {
    id: 2,
    title: 'Modern CSS Architecture with Tailwind',
    slug: 'modern-css-architecture-tailwind',
    content: '<h1>Modern CSS Architecture with Tailwind</h1><p>Tailwind CSS has revolutionized how we approach styling in web applications...</p><h2>Utility-First Approach</h2><p>The utility-first methodology changes how we think about CSS...</p>',
    excerpt: 'Discover best practices for organizing and scaling your Tailwind CSS codebase in large applications.',
    cover_image: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=1200&h=675&fit=crop',
    tags: ['CSS', 'Tailwind', 'Architecture'],
    published: true,
    published_at: '2024-02-28T14:30:00.000Z',
    created_at: '2024-02-28T14:30:00.000Z',
    updated_at: '2024-02-28T14:30:00.000Z',
  },
  {
    id: 3,
    title: 'Building Resilient APIs with TypeScript',
    slug: 'building-resilient-apis-typescript',
    content: '<h1>Building Resilient APIs with TypeScript</h1><p>Type safety is crucial for building maintainable APIs...</p><h2>Type Safety Benefits</h2><p>Using TypeScript for APIs provides compile-time type checking...</p>',
    excerpt: 'Learn how to leverage TypeScript to build type-safe, resilient APIs that scale.',
    cover_image: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=1200&h=675&fit=crop',
    tags: ['TypeScript', 'API', 'Node.js'],
    published: false,
    published_at: null,
    created_at: '2024-02-20T09:00:00.000Z',
    updated_at: '2024-02-20T09:00:00.000Z',
  },
  {
    id: 4,
    title: 'Hello World',
    slug: 'hello-world',
    content: '<h1>Hello World</h1><p>Welcome to my blog! This is my first post, a simple hello to the world.</p><h2>Why Hello World?</h2><p>Every programmer\'s journey starts with a <code>hello world</code>. It\'s the ritual that marks the beginning of something new.</p><p>In this blog, I\'ll be sharing:</p><ul><li>Technical deep dives into web development</li><li>Tutorials and how-to guides</li><li>Thoughts on software architecture</li><li>Lessons learned from building products</li></ul><h2>What to Expect</h2><p>I believe in writing code that is <strong>maintainable</strong>, <strong>performant</strong>, and <strong>user-friendly</strong>. My posts will reflect these principles, with practical examples and real-world applications.</p><blockquote>The best code is no code at all. The second best is code that reads like prose.</blockquote><p>Stay tuned for more content. Let\'s build something amazing together!</p>',
    excerpt: 'Welcome to my blog! A first post about beginnings, coding rituals, and what to expect from future content.',
    cover_image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&h=675&fit=crop',
    tags: ['Introduction', 'Personal'],
    published: true,
    published_at: '2024-01-01T00:00:00.000Z',
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z',
  },
];

// Helper functions for working with the database
// These will be replaced with actual D1 queries when bindings are configured

export async function getPortfolioItemsFromDB(
  featured?: boolean
): Promise<PortfolioItem[]> {
  // TODO: Replace with actual D1 query when bindings are configured
  // const db = getPlatformEnv().DB;
  // const stmt = db.prepare('SELECT * FROM portfolio_items WHERE featured = ? ORDER BY display_order');
  // return stmt.all(featured ? 1 : 0);

  if (featured !== undefined) {
    return mockPortfolioItems
      .filter((item) => item.featured === featured)
      .sort((a, b) => a.display_order - b.display_order);
  }

  return [...mockPortfolioItems].sort((a, b) => a.display_order - b.display_order);
}

export async function getBlogPostsFromDB(
  published?: boolean
): Promise<BlogPost[]> {
  // TODO: Replace with actual D1 query when bindings are configured

  if (published !== undefined) {
    return mockBlogPosts
      .filter((post) => post.published === published)
      .sort((a, b) => {
        const dateA = a.published_at ? new Date(a.published_at).getTime() : 0;
        const dateB = b.published_at ? new Date(b.published_at).getTime() : 0;
        return dateB - dateA;
      });
  }

  return [...mockBlogPosts].sort((a, b) => {
    const dateA = a.published_at ? new Date(a.published_at).getTime() : 0;
    const dateB = b.published_at ? new Date(b.published_at).getTime() : 0;
    return dateB - dateA;
  });
}

export async function getBlogPostBySlugFromDB(
  slug: string
): Promise<BlogPost | null> {
  // TODO: Replace with actual D1 query when bindings are configured
  const post = mockBlogPosts.find((p) => p.slug === slug);
  return post || null;
}

export async function createContactSubmissionInDB(
  data: Omit<ContactSubmission, 'id' | 'created_at' | 'status'>
): Promise<ContactSubmission> {
  // TODO: Replace with actual D1 query when bindings are configured
  const newSubmission: ContactSubmission = {
    ...data,
    id: Date.now(),
    status: 'pending',
    created_at: new Date().toISOString(),
  };

  console.log('Created contact submission:', newSubmission);
  return newSubmission;
}

export async function createAnalyticsEventInDB(
  data: Omit<AnalyticsEvent, 'id' | 'created_at'>
): Promise<AnalyticsEvent> {
  // TODO: Replace with actual D1 query when bindings are configured
  const newEvent: AnalyticsEvent = {
    ...data,
    id: Date.now(),
    created_at: new Date().toISOString(),
  };

  console.log('Created analytics event:', newEvent);
  return newEvent;
}

// Helper to get platform environment (for use when D1 is configured)
// This function will work with Cloudflare Workers/Pages environment
export function getPlatformEnv(): { DB?: D1Database; KV?: KVNamespace } {
  // In a real Cloudflare environment, this would be available via the request context
  // For now, return empty object since we're using mock data
  return {};
}

// D1Database type stub (for when bindings are configured)
export interface D1Database {
  prepare(query: string): D1PreparedStatement;
  dump(): Promise<ArrayBuffer>;
  batch<T>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]>;
  exec(query: string): Promise<D1ExecResult>;
}

export interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T>(): Promise<T | null>;
  run<T>(): Promise<D1Result<T>>;
  all<T>(): Promise<D1Result<T>>;
  raw<T>(): Promise<T[]>;
}

export interface D1Result<T> {
  results: T[];
  success: boolean;
  error?: string;
  meta?: {
    duration: number;
    last_row_id: number;
    changes: number;
  };
}

export interface D1ExecResult {
  count: number;
  duration: number;
}

// KVNamespace type stub (for when bindings are configured)
export interface KVNamespace {
  get(key: string, options?: { cacheTtl?: number; type?: 'text' | 'json' | 'arrayBuffer' | 'stream' }): Promise<string | null>;
  put(key: string, value: string | ArrayBuffer | ReadableStream, options?: { expiration?: number; expirationTtl?: number }): Promise<void>;
  delete(key: string): Promise<void>;
  list(options?: { prefix?: string; limit?: number; cursor?: string }): Promise<{ keys: { name: string; expiration?: number }[]; list_complete: boolean; cursor?: string }>;
}
