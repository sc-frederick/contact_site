import { Link } from "@tanstack/react-router";
import type { BlogPost } from "~/types";
import { Calendar, Tag, ArrowRight } from "lucide-react";

interface PostListProps {
  posts: BlogPost[];
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

export function PostList({ posts }: PostListProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="font-body text-text-secondary text-lg">
          No blog posts found.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <article
          key={post.id}
          className="group relative bg-bg-surface/50 border border-border/50 rounded-xl p-6 hover:border-accent/30 transition-all duration-300 hover:shadow-lg hover:shadow-accent/5"
        >
          {/* Decorative accent line */}
          <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-border to-transparent group-hover:via-accent/50 transition-all duration-300" />

          <div className="space-y-4">
            {/* Title */}
            <h2 className="font-display text-2xl text-text-primary group-hover:text-accent transition-colors duration-300">
              <Link to="/blog/$slug" params={{ slug: post.slug }} className="focus:outline-none">
                <span className="absolute inset-0" aria-hidden="true" />
                {post.title}
              </Link>
            </h2>

            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-4 text-sm font-body text-text-tertiary">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(post.published_at)}</span>
              </div>
              {post.tags.length > 0 && (
                <div className="flex items-center gap-1.5">
                  <Tag className="w-4 h-4" />
                  <span>{post.tags.join(", ")}</span>
                </div>
              )}
            </div>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="font-body text-text-secondary leading-relaxed">
                {post.excerpt}
              </p>
            )}

            {/* Read more link */}
            <div className="flex items-center gap-2 text-accent font-body text-sm font-medium pt-2">
              <span>Read more</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
