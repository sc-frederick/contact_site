import { createFileRoute, notFound } from "@tanstack/react-router";
import { getBlogPostBySlugFromDB } from "~/lib/server/db";
import { PostContent } from "~/components/blog/post-content";
import type { BlogPost } from "~/types";

export const Route = createFileRoute("/blog/$slug")({
  component: BlogPost,
  loader: async ({ params }): Promise<BlogPost> => {
    const post = await getBlogPostBySlugFromDB(params.slug);
    
    if (!post || !post.published) {
      throw notFound();
    }
    
    return post;
  },
  errorComponent: ({ error }) => {
    // Check if it's a not found error
    if (error instanceof Response && error.status === 404) {
      return <PostNotFound />;
    }
    return <PostError error={error} />;
  },
});

function PostNotFound() {
  return (
    <div className="min-h-screen bg-bg-primary py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="font-display text-4xl text-text-primary mb-4">
          Post Not Found
        </h1>
        <p className="font-body text-text-secondary mb-8">
          The blog post you're looking for doesn't exist or has been removed.
        </p>
        <a
          href="/blog"
          className="inline-flex items-center gap-2 text-accent hover:text-accent-muted transition-colors duration-300 font-body font-medium"
        >
          ← Back to blog
        </a>
      </div>
    </div>
  );
}

function PostError({ error }: { error: unknown }) {
  return (
    <div className="min-h-screen bg-bg-primary py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="font-display text-4xl text-text-primary mb-4">
          Something went wrong
        </h1>
        <p className="font-body text-text-secondary mb-8">
          Failed to load the blog post. Please try again later.
        </p>
        <a
          href="/blog"
          className="inline-flex items-center gap-2 text-accent hover:text-accent-muted transition-colors duration-300 font-body font-medium"
        >
          ← Back to blog
        </a>
      </div>
    </div>
  );
}

function BlogPost() {
  const post = Route.useLoaderData();

  return (
    <div className="min-h-screen bg-bg-primary py-16 px-4 sm:px-6 lg:px-8">
      <PostContent post={post} />
    </div>
  );
}
