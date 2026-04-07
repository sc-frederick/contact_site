// Server functions for blog operations

import { createServerFn } from '@tanstack/react-start';
import { getBlogPostsFromDB, getBlogPostBySlugFromDB } from './db';
import type { BlogPost, ApiResponse, PaginatedResponse } from '~/types';

interface GetBlogPostsOptions {
  published?: boolean;
  page?: number;
  limit?: number;
  tag?: string;
}

export const getBlogPosts = createServerFn({ method: 'GET' })
  .handler(async (): Promise<ApiResponse<PaginatedResponse<BlogPost>>> => {
    try {
      const published = true;
      const page = 1;
      const limit = 10;

      // Fetch posts from database (mock data for now)
      let allPosts = await getBlogPostsFromDB(published);

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
        error: error instanceof Error ? error.message : 'Failed to fetch blog posts',
      };
    }
  });

export const getBlogPost = createServerFn({ method: 'GET' })
  .handler(async (ctx): Promise<ApiResponse<BlogPost | null>> => {
    try {
      // Access data from context - slug should be passed as ctx.data
      const data = ctx.data as unknown as { slug?: string };
      const slug = data?.slug;

      if (!slug) {
        return {
          success: false,
          error: 'Blog post slug is required',
        };
      }

      // Fetch post from database (mock data for now)
      const post = await getBlogPostBySlugFromDB(slug);

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
        data: post,
      };
    } catch (error) {
      console.error('Error fetching blog post:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch blog post',
      };
    }
  });

export const getBlogTags = createServerFn({ method: 'GET' })
  .handler(async (): Promise<ApiResponse<string[]>> => {
    try {
      // Fetch all published posts
      const posts = await getBlogPostsFromDB(true);

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
        error: error instanceof Error ? error.message : 'Failed to fetch blog tags',
      };
    }
  });

export const getRecentBlogPosts = createServerFn({ method: 'GET' })
  .handler(async (ctx): Promise<ApiResponse<BlogPost[]>> => {
    try {
      const { limit = 3 } = (ctx.data as unknown as { limit?: number }) || {};

      // Fetch published posts
      const posts = await getBlogPostsFromDB(true);

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
        error: error instanceof Error ? error.message : 'Failed to fetch recent blog posts',
      };
    }
  });
