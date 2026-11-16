import '../.cloudflare/types/index.d.ts';

export {};

declare global {
  namespace App {
    /** Shallow-routing state: the project whose details dialog is open. */
    interface PageState {
      projectId?: number;
    }
  }

  interface Window {
    turnstile?: {
      render: (
        element: HTMLElement,
        options: {
          sitekey: string;
          action: string;
          theme: 'light';
          callback: (token: string) => void;
          'expired-callback': () => void;
          'error-callback': () => void;
          'timeout-callback': () => void;
        },
      ) => string;
      reset: (id: string) => void;
      remove: (id: string) => void;
    };
  }
}
