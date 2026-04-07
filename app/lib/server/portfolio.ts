// Server functions for portfolio operations

import { createServerFn } from '@tanstack/react-start';
import { getPortfolioItemsFromDB } from './db';
import type { PortfolioItem, ApiResponse, PaginatedResponse } from '~/types';

interface GetPortfolioItemsOptions {
  featured?: boolean;
  page?: number;
  limit?: number;
}

export const getPortfolioItems = createServerFn({ method: 'GET' })
  .handler(async (ctx): Promise<ApiResponse<PaginatedResponse<PortfolioItem>>> => {
    try {
      const options = (ctx.data as unknown as GetPortfolioItemsOptions) || {};
      const { featured, page = 1, limit = 10 } = options;

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
        error: error instanceof Error ? error.message : 'Failed to fetch portfolio items',
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
        error: error instanceof Error ? error.message : 'Failed to fetch featured portfolio items',
      };
    }
  });

export const getPortfolioItemById = createServerFn({ method: 'GET' })
  .handler(async (ctx): Promise<ApiResponse<PortfolioItem | null>> => {
    try {
      const { id } = (ctx.data as unknown as { id: number }) || {};

      if (!id) {
        return {
          success: false,
          error: 'Portfolio item ID is required',
        };
      }

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
        error: error instanceof Error ? error.message : 'Failed to fetch portfolio item',
      };
    }
  });
