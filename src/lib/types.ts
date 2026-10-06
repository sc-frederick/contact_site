/** A repository-backed project displayed on the portfolio page. */
export interface PortfolioItem {
  id: number;
  title: string;
  description: string;
  image_url: string | null;
  project_url: string | null;
  github_url: string | null;
  technologies: string[];
  featured: boolean;
  /** Renders the card as an ink tile so it reads as the lead project. */
  highlighted?: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

/** Validated contact fields passed to storage and mail delivery. */
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

/** Successful public endpoint response. */
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

/** Safe public feedback for an unsuccessful request. */
export interface ApiErrorResponse {
  success: false;
  error: string;
}

/** Public endpoint result with a discriminating success flag. */
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
