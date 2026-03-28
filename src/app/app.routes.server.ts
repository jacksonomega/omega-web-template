import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    // Multi-tenant pages are fully dynamic — SSR on every request.
    // Prerender is not viable since tenant slugs are unknown at build time.
    path: '**',
    renderMode: RenderMode.Server,
  },
];
