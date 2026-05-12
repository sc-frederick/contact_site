# Stephen Frederick - Personal Site

A modern personal website and developer portfolio for Stephen Frederick, built with TanStack Start and deployed on Cloudflare Workers.

## Overview

This site serves as both an about-me statement and a professional portfolio, showcasing engineering work, software development projects, and technical writing. It includes a digital business card, resume, blog, and contact form.

## Features

- **Responsive Design**: Works across desktop, tablet, and mobile
- **Dark Theme**: Refined dark aesthetic with warm gold accents
- **Portfolio Showcase**: Featured projects with detailed modal views
- **Resume Page**: Interactive timeline with experience, education, and skills
- **Blog**: Markdown-driven posts with code highlighting
- **Contact Form**: Direct message submissions with validation
- **Digital Business Card**: Save contact as vCard, share profile
- **Analytics**: Lightweight pageview and click tracking

## Tech Stack

- **Framework**: [TanStack Start](https://tanstack.com/start) (React 19 + file-based routing)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com) with custom design tokens
- **Runtime**: [Cloudflare Workers](https://workers.cloudflare.com) (SSR + edge deployment)
- **Database**: [Cloudflare D1](https://developers.cloudflare.com/d1) (SQLite)
- **Storage**: [Cloudflare KV](https://developers.cloudflare.com/kv) (caching)
- **Package Manager**: [pnpm](https://pnpm.io)

## Prerequisites

- [Node.js](https://nodejs.org) 20+
- [pnpm](https://pnpm.io/installation) 10+

## Setup

Install dependencies:

```bash
pnpm install
```

Apply the local database schema:

```bash
pnpm run db:setup
```

Optionally seed with sample data:

```bash
pnpm run db:seed
```

Start the development server:

```bash
pnpm run dev
```

The site will be available at `http://localhost:3000`.

## Available Routes

| Route | Description |
|---|---|
| `/` | Home / About Me + Featured Portfolio |
| `/portfolio` | Full developer portfolio grid |
| `/resume` | Interactive resume with timeline |
| `/blog` | Blog post listing |
| `/blog/:slug` | Individual blog post |
| `/contact` | Contact form and info |

## Build

```bash
pnpm run build
```

## Deployment

This project is configured for deployment on Cloudflare Workers via Wrangler.

```bash
pnpm run deploy
```

See [docs/cloudflare-setup.md](docs/cloudflare-setup.md) for one-time database and KV provisioning.

## Contact

- **Website**: [sfrederick.dev](https://sfrederick.dev)
- **GitHub**: [github.com/sc-frederick](https://github.com/sc-frederick)
- **Email**: sc.frederick@outlook.com
- **Location**: Tampa, FL

## License

This project is proprietary and maintained by Stephen Frederick.
