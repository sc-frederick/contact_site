/** Where a project stands, shown as a label on its card. */
export type ProjectStatus =
  'Live' | 'Open source' | 'In development' | 'Internal';

/** A repository-backed project displayed on the portfolio page. */
export interface PortfolioItem {
  readonly id: number;
  readonly title: string;
  readonly description: string;
  readonly status: ProjectStatus;
  readonly project_url: string | null;
  readonly github_url: string | null;
  readonly technologies: readonly string[];
  /** Renders the card as an ink tile so it reads as the lead project. */
  readonly highlighted?: boolean;
  readonly display_order: number;
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
