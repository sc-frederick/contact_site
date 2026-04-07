import { createFileRoute } from "@tanstack/react-router";
import { getBlogPostsFromDB } from "~/lib/server/db";
import { PostList } from "~/components/blog/post-list";
import { PenLine } from "lucide-react";
import type { BlogPost } from "~/types";

export const Route = createFileRoute("/blog/")({
  component: BlogIndex,
  loader: async (): Promise<BlogPost[]> => {
    // Fetch published posts directly from DB
    const posts = await getBlogPostsFromDB(true);
    return posts;
  },
});

function BlogIndex() {
  const posts = Route.useLoaderData();

  return (
    <div className="min-h-screen bg-bg-primary py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <PenLine className="w-8 h-8 text-accent" />
            <h1 className="font-display text-4xl md:text-5xl text-text-primary">
              Blog
            </h1>
          </div>
          <p className="font-body text-text-secondary text-lg max-w-2xl">
            Thoughts on software development, design patterns, and building
            products that matter.
          </p>
          <div className="h-px w-24 bg-accent mt-6" />
        </div>

        {/* Post listing */}
        <PostList posts={posts} />
      </div>
    </div>
  );
}
