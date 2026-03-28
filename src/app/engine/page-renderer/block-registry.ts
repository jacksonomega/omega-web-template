import { Type } from '@angular/core';
import { BlockType } from '../../core/tenant/tenant.model';

/**
 * Central registry mapping a BlockType string to a lazy import.
 * Adding a new block = adding one entry here. The PageRenderer
 * does not need to be modified.
 */
export const BLOCK_REGISTRY: Record<BlockType, () => Promise<Type<unknown>>> = {
  hero: () =>
    import('../../blocks/hero/hero-block.component').then(
      (m) => m.HeroBlockComponent
    ),
  features: () =>
    import('../../blocks/features/features-block.component').then(
      (m) => m.FeaturesBlockComponent
    ),
  pricing: () =>
    import('../../blocks/pricing/pricing-block.component').then(
      (m) => m.PricingBlockComponent
    ),
  contact: () =>
    import('../../blocks/contact/contact-block.component').then(
      (m) => m.ContactBlockComponent
    ),
  testimonials: () =>
    import('../../blocks/testimonials/testimonials-block.component').then(
      (m) => m.TestimonialsBlockComponent
    ),
  footer: () =>
    import('../../blocks/footer/footer-block.component').then(
      (m) => m.FooterBlockComponent
    ),
  'item-list': () =>
    import('../../blocks/item-list/item-list-block.component').then(
      (m) => m.ItemListBlockComponent
    ),
};
