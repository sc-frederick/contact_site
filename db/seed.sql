-- Portfolio Items
INSERT INTO portfolio_items (title, description, image_url, project_url, github_url, technologies, featured, display_order) VALUES
('Forewit', 'Engineering software for people and AI agents. Starting with MEP tools that replace scattered Excel workflows with shared project data and agent-usable calculation logic.', NULL, 'https://surfside-software.com', NULL, '["TypeScript", "TanStack Start", "Effect", "Cloudflare Workers", "D1", "MCP"]', 1, 1),
('Intelligent Irrigation', 'Irrigation design software for Corexis that generates more efficient designs to save water and money.', NULL, NULL, NULL, '["Ruby on Rails", "PostgreSQL", "PostGIS", "Python", "EPANET", "Stimulus"]', 1, 2),
('Permit Monitor', 'Local desktop app for Windows and macOS that tracks public building permits across Florida counties, cities, and water management districts, with Jev, a decisions/system model, built in.', NULL, NULL, NULL, '["Electron", "TypeScript", "Playwright", "Zod"]', 1, 3),
('Moke Agent', 'AI-powered AEC drawing QC review pipeline. Locates project drawings, splits PDFs by engineering discipline, runs discipline-specific AI review with Synthetic AI / Kimi K2.5 and an OpenRouter fallback, and generates formatted review reports.', NULL, NULL, NULL, '["TypeScript", "Bun", "Effect-TS", "OpenRouter AI", "Zod", "pdf-lib"]', 1, 4),
('AEC Project Lighthouse', 'Project management SaaS for architecture, engineering, and construction teams. Features real-time collaboration, Gantt charts, markdown editing, email notifications, and automated tests. Live at aeccloud.io.', NULL, 'https://www.aeccloud.io', NULL, '["React 19", "TypeScript", "Convex", "Vite", "Tailwind CSS", "Vitest", "Playwright"]', 1, 5),
('General AI Tooling for AEC Engineers', 'A kit for using general-purpose AI in architecture, engineering, and construction work. It combines reusable agent skills, repeatable workflows, executable Python workbooks, and feedback loops that turn one-off experiments into repeatable engineering processes.', NULL, NULL, NULL, '["Agent Skills", "Reusable Workflows", "Python Workbooks", "Feedback Loops"]', 1, 6),
('Moke Script', 'AI-powered planset review and comparison tool for construction drawings. Ships as a desktop CLI for Windows, macOS, and Linux that reviews or diffs PDF plansets into an HTML report, plus a hosted SvelteKit web app on Cloudflare with review jobs, auth, and D1/R2 storage.', NULL, NULL, NULL, '["SvelteKit", "TypeScript", "Cloudflare Workers", "D1", "R2", "Codex CLI", "pdf-to-img"]', 1, 7),
('ScoutWork', 'AI-powered job search and recruiting platform with chat-based matching and a dark "Night Desk" theme. Aggregates listings via SerpApi, runs chat on Cloudflare Workers AI, stores data in D1 with résumé uploads in R2, and gates access with magic-link email auth.', NULL, NULL, NULL, '["TanStack Start", "React", "TypeScript", "Cloudflare Workers", "D1", "R2", "Workers AI", "SerpApi"]', 1, 8),
('BricsCAD / AutoCAD MCP Server', 'Code-mode MCP integration for AI-assisted drafting in BricsCAD alongside an isolated AutoCAD connector. A Python stdio server attaches to the running CAD session over Windows COM, serializes spool jobs, executes generated PyRx code inside BricsCAD, and returns structured results with transaction rollback.', NULL, NULL, NULL, '["Python 3.12", "FastMCP", "PyRx", "Windows COM", "JSON-RPC"]', 1, 9),
('Snip-it', 'Chrome Manifest V3 extension for capturing excerpts from building, fire, and electrical codes during code research. Clips and organizes citations, indexes them with fuzzy search, and syncs to Dropbox so references can be re-found later.', NULL, NULL, NULL, '["WXT", "Svelte 5", "TypeScript", "MiniSearch", "Dexie", "Dropbox SDK"]', 0, 10),
('Link Converter Utilities', 'Two web services that convert shared links. One rewrites Apple Maps links in incoming SMS/RCS messages to Google Maps links. The other converts Apple Music links to Spotify using the Odesli API with a Spotify search fallback.', NULL, NULL, NULL, '["Go", "TypeScript", "React 19", "SQLite", "Spotify API", "Docker"]', 0, 11);

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
