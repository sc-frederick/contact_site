-- Sample Portfolio Items
INSERT INTO portfolio_items (title, description, image_url, project_url, github_url, technologies, featured, display_order) VALUES
('E-Commerce Platform', 'A full-stack e-commerce solution with real-time inventory management and payment processing.', 'https://example.com/ecommerce.jpg', 'https://ecommerce-demo.example.com', 'https://github.com/example/ecommerce', '["React", "Node.js", "PostgreSQL", "Stripe"]', 1, 1),
('AI Dashboard', 'Analytics dashboard for machine learning model performance monitoring and data visualization.', 'https://example.com/dashboard.jpg', 'https://ai-dashboard.example.com', 'https://github.com/example/ai-dashboard', '["Python", "TensorFlow", "React", "D3.js"]', 1, 2),
('Mobile Banking App', 'Secure mobile banking application with biometric authentication and real-time transactions.', 'https://example.com/banking.jpg', NULL, 'https://github.com/example/banking-app', '["React Native", "Node.js", "MongoDB", "Plaid"]', 1, 3),
('CMS Platform', 'Headless content management system with GraphQL API and real-time collaboration features.', 'https://example.com/cms.jpg', 'https://cms-demo.example.com', 'https://github.com/example/cms', '["Next.js", "GraphQL", "Prisma", "PostgreSQL"]', 0, 4),
('DevOps Pipeline', 'CI/CD automation tool with deployment tracking and rollback capabilities.', 'https://example.com/devops.jpg', NULL, 'https://github.com/example/devops-pipeline', '["Go", "Kubernetes", "GitHub Actions", "Terraform"]', 0, 5);

-- Sample Blog Posts
INSERT INTO blog_posts (title, slug, content, excerpt, cover_image, tags, published, published_at) VALUES
('Getting Started with React Server Components', 'getting-started-react-server-components', 
'<h1>Getting Started with React Server Components</h1><p>React Server Components represent a paradigm shift in how we build React applications...</p><h2>What are Server Components?</h2><p>Server Components allow you to render components on the server, reducing the JavaScript bundle size sent to the client...</p><h2>Benefits</h2><ul><li>Reduced bundle size</li><li>Direct backend access</li><li>Improved performance</li></ul>', 
'Learn how to leverage React Server Components to build faster, more efficient React applications with reduced client-side JavaScript.', 
'https://example.com/blog/server-components.jpg', '["React", "JavaScript", "Performance"]', 1, '2024-03-15 10:00:00'),

('Modern CSS Architecture with Tailwind', 'modern-css-architecture-tailwind',
'<h1>Modern CSS Architecture with Tailwind</h1><p>Tailwind CSS has revolutionized how we approach styling in web applications...</p><h2>Utility-First Approach</h2><p>The utility-first methodology changes how we think about CSS...</p>',
'Discover best practices for organizing and scaling your Tailwind CSS codebase in large applications.',
'https://example.com/blog/tailwind-architecture.jpg', '["CSS", "Tailwind", "Architecture"]', 1, '2024-02-28 14:30:00'),

('Building Resilient APIs with TypeScript', 'building-resilient-apis-typescript',
'<h1>Building Resilient APIs with TypeScript</h1><p>Type safety is crucial for building maintainable APIs...</p><h2>Type Safety Benefits</h2><p>Using TypeScript for APIs provides compile-time type checking...</p>',
'Learn how to leverage TypeScript to build type-safe, resilient APIs that scale.',
'https://example.com/blog/typescript-apis.jpg', '["TypeScript", "API", "Node.js"]', 0, NULL);

-- Sample Contact Submissions
INSERT INTO contact_submissions (name, email, subject, message, status, created_at) VALUES
('John Smith', 'john.smith@example.com', 'Project Inquiry', 'Hi Stephen, I came across your portfolio and I am impressed with your work. I have a project that I would like to discuss with you. Can we schedule a call next week?', 'read', '2024-03-10 09:15:00'),
('Sarah Johnson', 'sarah.j@techcorp.com', 'Freelance Opportunity', 'Hello, We are looking for a senior frontend developer for a 6-month contract. Your React and TypeScript experience looks like a great fit. Would you be interested in learning more?', 'pending', '2024-03-14 16:45:00'),
('Michael Chen', 'mchen.dev@example.com', 'Collaboration', 'Hey Stephen, I saw your work on the AI Dashboard project. I am building something similar and would love to compare notes. Are you open to a quick chat?', 'read', '2024-03-12 11:20:00'),
('Alice Williams', 'alice@startup.io', 'Consulting Request', 'We need help optimizing our React application performance. Your blog posts suggest you have expertise in this area. Can we discuss consulting rates?', 'replied', '2024-03-08 13:00:00');

-- Sample Analytics Events
INSERT INTO analytics_events (event_type, page_path, referrer, session_id, metadata, created_at) VALUES
('pageview', '/', 'https://google.com', 'sess_001', '{"device": "desktop", "country": "US"}', '2024-03-15 08:00:00'),
('pageview', '/portfolio', NULL, 'sess_001', '{"device": "desktop", "country": "US"}', '2024-03-15 08:00:15'),
('pageview', '/blog', NULL, 'sess_001', '{"device": "desktop", "country": "US"}', '2024-03-15 08:01:30'),
('click', '/portfolio', NULL, 'sess_001', '{"element": "project-card", "project": "E-Commerce Platform"}', '2024-03-15 08:00:45'),
('pageview', '/', 'https://twitter.com', 'sess_002', '{"device": "mobile", "country": "UK"}', '2024-03-15 09:30:00'),
('pageview', '/contact', NULL, 'sess_002', '{"device": "mobile", "country": "UK"}', '2024-03-15 09:32:00'),
('click', '/contact', NULL, 'sess_002', '{"element": "submit-button"}', '2024-03-15 09:35:00'),
('pageview', '/', NULL, 'sess_003', '{"device": "desktop", "country": "CA"}', '2024-03-15 10:15:00'),
('pageview', '/blog/getting-started-react-server-components', 'https://linkedin.com', 'sess_003', '{"device": "desktop", "country": "CA"}', '2024-03-15 10:16:00'),
('scroll', '/blog/getting-started-react-server-components', NULL, 'sess_003', '{"depth": 75}', '2024-03-15 10:18:00');
