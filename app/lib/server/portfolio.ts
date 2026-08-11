// Server functions for portfolio operations

import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { getPortfolioItemsFromDB } from './db';
import type { PortfolioItem, ApiResponse, PaginatedResponse } from '~/types';

const portfolioOptionsSchema = z.strictObject({
  featured: z.boolean().optional(),
  page: z.number().int().min(1).max(10_000).optional(),
  limit: z.number().int().min(1).max(100).optional(),
});
const portfolioIdSchema = z.strictObject({
  id: z.number().int().positive(),
});

export const getPortfolioItems = createServerFn({ method: 'GET' })
  .validator((data: unknown) => portfolioOptionsSchema.parse(data ?? {}))
  .handler(async (ctx): Promise<ApiResponse<PaginatedResponse<PortfolioItem>>> => {
    try {
      const { featured, page = 1, limit = 100 } = ctx.data;

      // Fetch items from database (mock data for now)
      const allItems = await getPortfolioItemsFromDB(featured);

      // Calculate pagination
      const total = allItems.length;
      const totalPages = Math.ceil(total / limit);
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedItems = allItems.slice(startIndex, endIndex);

      return {
        success: true,
        data: {
          items: paginatedItems,
          total,
          page,
          limit,
          totalPages,
        },
      };
    } catch (error) {
      console.error('Error fetching portfolio items:', error);
      return {
        success: false,
        error: 'Failed to fetch portfolio items',
      };
    }
  });

export const getFeaturedPortfolioItems = createServerFn({ method: 'GET' })
  .handler(async (): Promise<ApiResponse<PortfolioItem[]>> => {
    try {
      const items = await getPortfolioItemsFromDB(true);

      return {
        success: true,
        data: items,
      };
    } catch (error) {
      console.error('Error fetching featured portfolio items:', error);
      return {
        success: false,
        error: 'Failed to fetch featured portfolio items',
      };
    }
  });

export const getPortfolioItemById = createServerFn({ method: 'GET' })
  .validator((data: unknown) => portfolioIdSchema.parse(data))
  .handler(async (ctx): Promise<ApiResponse<PortfolioItem | null>> => {
    try {
      const { id } = ctx.data;

      // Fetch all items and find by ID (will be replaced with direct DB query)
      const items = await getPortfolioItemsFromDB();
      const item = items.find((i) => i.id === id);

      if (!item) {
        return {
          success: false,
          error: 'Portfolio item not found',
        };
      }

      return {
        success: true,
        data: item,
      };
    } catch (error) {
      console.error('Error fetching portfolio item:', error);
      return {
        success: false,
        error: 'Failed to fetch portfolio item',
      };
    }
  });
