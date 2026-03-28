import {
  APP_INITIALIZER,
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';

import { routes } from './app.routes';
import { tenantMockInterceptor } from './core/tenant/tenant.interceptor';
import { tenantInitializer } from './core/tenant/tenant.initializer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),

    // HTTP client with mock interceptor (replace with real API interceptor in production)
    provideHttpClient(
      withFetch(),
      withInterceptors([tenantMockInterceptor])
    ),

    // Block app bootstrap until tenant config is resolved
    {
      provide: APP_INITIALIZER,
      useFactory: tenantInitializer,
      multi: true,
    },
  ],
};
