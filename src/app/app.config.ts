import {
  APP_INITIALIZER,
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';

import { routes } from './app.routes';
import { tenantInitializer } from './core/tenant/tenant.initializer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),

    // HTTP client
    provideHttpClient(
      withFetch()
    ),

    // Block app bootstrap until tenant config is resolved
    {
      provide: APP_INITIALIZER,
      useFactory: tenantInitializer,
      multi: true,
    },
  ],
};
