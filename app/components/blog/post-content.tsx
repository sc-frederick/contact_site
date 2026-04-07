import { Link } from "@tanstack/react-router";
import type { BlogPost } from "~/types";
import { Calendar, Tag, ArrowLeft } from "lucide-react";

interface PostContentProps {
  post: BlogPost;
}

function formatDate(dateString: string | null): string {
  if (!dateString) return "Draft";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Simple HTML content renderer with styling for common elements
function renderContent(html: string) {
  // Note: In production, you'd want to use a proper markdown-to-HTML parser
  // and sanitize the HTML. For now, we'll render the HTML content directly
  // with Tailwind classes applied via CSS.
  return (
    <div
      className="prose prose-invert prose-zinc max-w-none font-body
        prose-headings:font-display prose-headings:text-text-primary prose-headings:font-semibold
        prose-h1:text-3xl prose-h1:mb-6 prose-h1:mt-8 prose-h1:pb-4 prose-h1:border-b prose-h1:border-border
        prose-h2:text-2xl prose-h2:mb-4 prose-h2:mt-8
        prose-h3:text-xl prose-h3:mb-3 prose-h3:mt-6
        prose-p:text-text-secondary prose-p:leading-relaxed prose-p:mb-4
        prose-ul:text-text-secondary prose-ul:my-4 prose-ul:list-disc prose-ul:pl-6
        prose-ol:text-text-secondary prose-ol:my-4 prose-ol:list-decimal prose-ol:pl-6
        prose-li:mb-2
        prose-strong:text-text-primary prose-strong:font-semibold
        prose-a:text-accent prose-a:no-underline hover:prose-a:underline
        prose-code:text-accent prose-code:bg-bg-elevated prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono
        prose-pre:bg-bg-elevated prose-pre:border prose-pre:border-border prose-pre:rounded-lg prose-pre:p-4 prose-pre:my-4
        prose-pre:code:bg-transparent prose-pre:code:p-0 prose-pre:code:text-text-secondary
        prose-blockquote:border-l-2 prose-blockquote:border-accent prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-text-tertiary prose-blockquote:my-4"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export function PostContent({ post }: PostContentProps) {
  return (
    <article className="max-w-3xl mx-auto">
      {/* Back link */}
      <Link
        to="/blog"
        className="inline-flex items-center gap-2 text-text-tertiary hover:text-accent transition-colors duration-300 font-body text-sm mb-8 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
        <span>Back to blog</span>
      </Link>

      {/* Header */}
      <header className="mb-10 pb-8 border-b border-border">
        <h1 className="font-display text-4xl md:text-5xl text-text-primary mb-6 leading-tight">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-6 text-sm font-body">
          <div className="flex items-center gap-2 text-text-secondary">
            <Calendar className="w-4 h-4 text-accent" />
            <span>{formatDate(post.published_at)}</span>
          </div>
          {post.tags.length > 0 && (
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-accent" />
              <div className="flex gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 bg-bg-elevated/50 text-text-secondary rounded-full text-xs border border-border/50"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Cover image */}
      {post.cover_image && (
        <div className="mb-10">
          <div className="aspect-video rounded-xl overflow-hidden border border-border/50">
            <img
              src={post.cover_image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="bg-bg-surface/30 rounded-xl p-6 md:p-8 border border-border/50">
        {renderContent(post.content)}
      </div>

      {/* Bottom navigation */}
      <div className="mt-10 pt-8 border-t border-border">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-accent hover:text-accent-muted transition-colors duration-300 font-body font-medium group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
          <span>Back to all posts</span>
        </Link>
      </div>
    </article>
  );
}
