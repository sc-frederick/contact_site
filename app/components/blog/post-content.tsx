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
      className="max-w-none font-body
        [&_h1]:font-display [&_h1]:text-text-primary [&_h1]:font-semibold [&_h1]:text-3xl md:[&_h1]:text-4xl [&_h1]:mb-6 [&_h1]:mt-2 [&_h1]:pb-4 [&_h1]:border-b [&_h1]:border-border
        [&_h2]:font-display [&_h2]:text-text-primary [&_h2]:font-semibold [&_h2]:text-2xl [&_h2]:mb-4 [&_h2]:mt-10
        [&_h3]:font-display [&_h3]:text-text-primary [&_h3]:font-semibold [&_h3]:text-xl [&_h3]:mb-3 [&_h3]:mt-8
        [&_p]:text-text-secondary [&_p]:leading-relaxed [&_p]:mb-4
        [&_ul]:text-text-secondary [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6
        [&_ol]:text-text-secondary [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6
        [&_li]:mb-2
        [&_strong]:text-text-primary [&_strong]:font-semibold
        [&_a]:text-accent [&_a]:no-underline hover:[&_a]:underline
        [&_code]:text-accent [&_code]:bg-bg-elevated [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono
        [&_pre]:bg-bg-elevated [&_pre]:border [&_pre]:border-border [&_pre]:rounded-lg [&_pre]:p-4 [&_pre]:my-4
        [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-text-secondary
        [&_blockquote]:border-l-2 [&_blockquote]:border-accent [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-text-tertiary [&_blockquote]:my-4"
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
