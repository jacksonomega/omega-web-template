import {
  Component,
  inject,
  signal,
  Type,
  effect,
} from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { TenantService } from '../../core/tenant/tenant.service';
import { BlockType, PageBlock } from '../../core/tenant/tenant.model';
import { BLOCK_REGISTRY } from './block-registry';

interface ResolvedBlock {
  block: PageBlock;
  component: Type<unknown>;
}

@Component({
  selector: 'app-page-renderer',
  standalone: true,
  imports: [NgComponentOutlet],
  template: `
    @if (tenantService.isLoading()) {
      <div class="loading-screen" aria-live="polite" aria-label="Cargando página...">
        <div class="loading-spinner"></div>
      </div>
    }

    @if (tenantService.error()) {
      <div class="error-screen" role="alert">
        <h1>⚠️ Error al cargar la página</h1>
        <p>{{ tenantService.error() }}</p>
      </div>
    }

    @if (!tenantService.isLoading() && !tenantService.error()) {
      <main class="page-layout">
        @for (item of resolvedBlocks(); track item.block.id) {
          <section
            class="block-wrapper"
            [attr.data-block-type]="item.block.type"
            [attr.data-block-id]="item.block.id"
          >
            <ng-container
              *ngComponentOutlet="
                item.component;
                inputs: { data: item.block.data }
              "
            />
          </section>
        }
      </main>
    }
  `,
  styles: [`
    .loading-screen {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100dvh;
      background: var(--color-bg, #0a0a0a);
    }

    .loading-spinner {
      width: 48px;
      height: 48px;
      border: 3px solid color-mix(in srgb, var(--color-primary, #16a34a) 20%, transparent);
      border-top-color: var(--color-primary, #16a34a);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .error-screen {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100dvh;
      gap: 1rem;
      padding: 2rem;
      text-align: center;
      background: var(--color-bg, #0a0a0a);
      color: var(--color-text, #f5f5f5);
    }

    .page-layout {
      display: flex;
      flex-direction: column;
      min-height: 100dvh;
    }

    .block-wrapper {
      width: 100%;
    }
  `],
})
export class PageRendererComponent {
  protected readonly tenantService = inject(TenantService);

  /** Resolved blocks: each PageBlock paired with its lazy-loaded component Type */
  readonly resolvedBlocks = signal<ResolvedBlock[]>([]);

  constructor() {
    // El 'effect' vigila a tenantService.blocks()
    // Cada vez que el editor mande un bloque nuevo, se volverá a ejecutar,
    // cargará los componentes perezosos si hacen falta, y actualizará la vista.
    effect(async () => {
      const blocks = this.tenantService.blocks();
      const resolved = await this.resolveBlocks(blocks);
      this.resolvedBlocks.set(resolved);
    }, { allowSignalWrites: true });
  }

  /**
   * Resolves all block components in parallel using Promise.all.
   * Blocks with unknown types are gracefully skipped with a console warning.
   */
  private async resolveBlocks(blocks: PageBlock[]): Promise<ResolvedBlock[]> {
    const results = await Promise.allSettled(
      blocks.map((block) => this.resolveBlock(block))
    );

    return results
      .filter((r): r is PromiseFulfilledResult<ResolvedBlock> => r.status === 'fulfilled')
      .map((r) => r.value);
  }

  private async resolveBlock(block: PageBlock): Promise<ResolvedBlock> {
    const normalizedType = block.type
      .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
      .toLowerCase() as BlockType;

    const loader = BLOCK_REGISTRY[normalizedType];
    if (!loader) {
      console.warn(`[PageRenderer] Unknown block type: "${block.type}" (normalized: "${normalizedType}"). Skipping.`);
      return Promise.reject(new Error(`Unknown block type: ${block.type}`));
    }
    
    // Devolvemos el bloque pero con su tipo ya normalizado
    const blockNormalized = { ...block, type: normalizedType };
    const component = await loader();
    
    return { block: blockNormalized, component };
  }
}
