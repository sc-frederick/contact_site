// TypeScript interfaces for the application

// Portfolio Item interface
export interface PortfolioItem {
  id: number;
  title: string;
  description: string;
  image_url: string | null;
  project_url: string | null;
  github_url: string | null;
  technologies: string[];
  featured: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

// Blog Post interface
export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  cover_image: string | null;
  tags: string[];
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

// Contact Form Data interface (input)
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Contact Submission interface (database record)
export interface ContactSubmission extends ContactFormData {
  id: number;
  ip_address: string | null;
  user_agent: string | null;
  status: 'pending' | 'read' | 'replied' | 'spam';
  created_at: string;
}

// Analytics Event interface
export interface AnalyticsEvent {
  id?: number;
  event_type: 'pageview' | 'click' | 'scroll' | 'custom';
  page_path: string;
  referrer: string | null;
  session_id: string;
  ip_address: string | null;
  user_agent: string | null;
  metadata: Record<string, unknown>;
  created_at?: string;
}

// API Response types
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// Pagination types
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
