// Ambient types for the pagefind browser bundle served at /pagefind/pagefind.js.
// It is loaded lazily at runtime via dynamic import, so keep this loose on
// purpose — the library ships its own types for bundler-resolved imports only.
declare module "/pagefind/pagefind.js" {
  export interface PagefindFilterCounts {
    [filterName: string]: Record<string, number>;
  }

  export interface PagefindResult {
    id: string;
    data: () => Promise<{
      url: string;
      excerpt: string;
      meta?: {
        title?: string;
        date?: string;
      };
      filters?: Record<string, string[]>;
    }>;
  }

  export interface PagefindSearchResult {
    results: PagefindResult[];
  }

  export interface PagefindSearchOptions {
    filters?: Record<string, string | string[]>;
    sort?: unknown;
  }

  export const search: (
    query: string,
    options?: PagefindSearchOptions,
  ) => Promise<PagefindSearchResult>;
  export const filters: () => Promise<PagefindFilterCounts>;
  export const options: (options: Record<string, unknown>) => Promise<void>;
}
