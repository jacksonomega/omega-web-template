import { inject } from '@angular/core';
import { lastValueFrom, defaultIfEmpty } from 'rxjs';
import { TenantService } from './tenant.service';

/**
 * APP_INITIALIZER factory.
 * Ensures the tenant config is fully loaded before Angular renders the first
 * component — prevents flash of unstyled content.
 *
 * Uses lastValueFrom + defaultIfEmpty(null) to guard against the
 * "no elements in sequence" RxJS error that can occur in SSR context if
 * the observable completes without emitting (e.g. interceptor not active).
 */
export function tenantInitializer(): () => Promise<void> {
  const tenantService = inject(TenantService);
  return () =>
    lastValueFrom(tenantService.loadTenantConfig().pipe(defaultIfEmpty(null))).then(
      () => void 0
    );
}
