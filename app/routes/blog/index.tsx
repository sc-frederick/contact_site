import { createFileRoute } from "@tanstack/react-router";
import { getBlogPostsFromDB } from "~/lib/server/db";
import { PostList } from "~/components/blog/post-list";
import type { BlogPost } from "~/types";

export const Route = createFileRoute("/blog/")({
  component: BlogIndex,
  loader: async (): Promise<BlogPost[]> => {
    const posts = await getBlogPostsFromDB(true);
    return posts;
  },
});

function BlogIndex() {
  const posts = Route.useLoaderData();

  return (
    <div className="min-h-screen bg-bg-primary py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header — standardized centered layout */}
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl md:text-5xl text-text-primary mb-4">
            Blog
          </h1>

          {/* Decorative line */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent via-border to-border" />
            <div className="w-2 h-2 rounded-full bg-accent" />
            <div className="h-px w-24 bg-gradient-to-r from-border via-accent to-border" />
            <div className="w-2 h-2 rounded-full bg-accent" />
            <div className="h-px w-12 bg-gradient-to-l from-transparent via-border to-border" />
          </div>

          <p className="font-body text-text-secondary text-lg max-w-2xl mx-auto">
            Thoughts on software development, design patterns, and building
            products that matter.
          </p>
        </div>

        {/* Post listing */}
        <PostList posts={posts} />
      </div>
    </div>
  );
}
