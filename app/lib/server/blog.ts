// Server functions for blog operations

import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { getBlogPostsFromDB, getBlogPostBySlugFromDB } from './db';
import { sanitizeBlogHtml } from './blog-content';
import type { BlogPost, ApiResponse, PaginatedResponse } from '~/types';

const blogSlugSchema = z.strictObject({
  slug: z.string().min(1).max(200).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
});
const recentPostsSchema = z.strictObject({
  limit: z.number().int().min(1).max(10).optional(),
});

function sanitizePost(post: BlogPost): BlogPost {
  return { ...post, content: sanitizeBlogHtml(post.content) };
}

export const getBlogPosts = createServerFn({ method: 'GET' })
  .handler(async (): Promise<ApiResponse<PaginatedResponse<BlogPost>>> => {
    try {
      const published = true;
      const page = 1;
      const limit = 10;

      // Fetch posts from database (mock data for now)
      const allPosts = (await getBlogPostsFromDB(published)).map(sanitizePost);

      // Calculate pagination
      const total = allPosts.length;
      const totalPages = Math.ceil(total / limit);
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedPosts = allPosts.slice(startIndex, endIndex);

      return {
        success: true,
        data: {
          items: paginatedPosts,
          total,
          page,
          limit,
          totalPages,
        },
      };
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      return {
        success: false,
        error: 'Failed to fetch blog posts',
      };
    }
  });

export const getBlogPost = createServerFn({ method: 'GET' })
  .validator((data: unknown) => blogSlugSchema.parse(data))
  .handler(async (ctx): Promise<ApiResponse<BlogPost | null>> => {
    try {
      // Fetch post from database (mock data for now)
      const post = await getBlogPostBySlugFromDB(ctx.data.slug);

      if (!post) {
        return {
          success: false,
          error: 'Blog post not found',
        };
      }

      // Only return published posts through this endpoint
      if (!post.published) {
        return {
          success: false,
          error: 'Blog post not found',
        };
      }

      return {
        success: true,
        data: sanitizePost(post),
      };
    } catch (error) {
      console.error('Error fetching blog post:', error);
      return {
        success: false,
        error: 'Failed to fetch blog post',
      };
    }
  });

export const getBlogTags = createServerFn({ method: 'GET' })
  .handler(async (): Promise<ApiResponse<string[]>> => {
    try {
      // Fetch all published posts
      const posts = (await getBlogPostsFromDB(true)).map(sanitizePost);

      // Extract and deduplicate tags
      const allTags = posts.flatMap((post) => post.tags);
      const uniqueTags = [...new Set(allTags)].sort();

      return {
        success: true,
        data: uniqueTags,
      };
    } catch (error) {
      console.error('Error fetching blog tags:', error);
      return {
        success: false,
        error: 'Failed to fetch blog tags',
      };
    }
  });

export const getRecentBlogPosts = createServerFn({ method: 'GET' })
  .validator((data: unknown) => recentPostsSchema.parse(data ?? {}))
  .handler(async (ctx): Promise<ApiResponse<BlogPost[]>> => {
    try {
      const { limit = 3 } = ctx.data;

      // Fetch published posts
      const posts = (await getBlogPostsFromDB(true)).map(sanitizePost);

      // Return most recent posts up to the limit
      const recentPosts = posts.slice(0, limit);

      return {
        success: true,
        data: recentPosts,
      };
    } catch (error) {
      console.error('Error fetching recent blog posts:', error);
      return {
        success: false,
        error: 'Failed to fetch recent blog posts',
      };
    }
  });
