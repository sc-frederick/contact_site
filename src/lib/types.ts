/** Where a project stands, shown as a label on its card. */
export type ProjectStatus =
  'Live' | 'Open source' | 'In development' | 'Internal';

/** A real screenshot or drawing of a project, at two widths. */
export interface ProjectImage {
  readonly src: string;
  readonly srcSmall: string;
  readonly width: number;
  readonly height: number;
  readonly alt: string;
}

/** A repository-backed project displayed on the portfolio page. */
export interface PortfolioItem {
  readonly id: number;
  readonly title: string;
  /** One complete sentence for the card, about 120 characters at most. */
  readonly summary: string;
  /** The full description shown in the project dialog. */
  readonly description: string;
  readonly status: ProjectStatus;
  readonly image?: ProjectImage;
  /** Flagship projects lead the portfolio and appear on the home page. */
  readonly featured?: boolean;
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
