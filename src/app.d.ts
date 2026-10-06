import '../.cloudflare/types/index.d.ts';

export {};

declare global {
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
