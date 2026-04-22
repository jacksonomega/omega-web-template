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
  'promo-timer': () =>
    import('../../blocks/promo-timer/promo-timer-block.component').then(
      (m) => m.PromoTimerBlockComponent
    ),
  'video-embed': () =>
    import('../../blocks/video-embed/video-embed-block.component').then(
      (m) => m.VideoEmbedBlockComponent
    ),
  'gallery': () =>
    import('../../blocks/gallery/gallery-block.component').then(
      (m) => m.GalleryBlockComponent
    ),
  'location': () =>
    import('../../blocks/location/location-block.component').then(
      (m) => m.LocationBlockComponent
    ),
  'faq': () =>
    import('../../blocks/faq/faq-block.component').then(
      (m) => m.FaqBlockComponent
    ),
  'text': () =>
    import('../../blocks/text/text-block.component').then(
      (m) => m.TextBlockComponent
    ),
  'timeline': () =>
    import('../../blocks/timeline/timeline-block.component').then(
      (m) => m.TimelineBlockComponent
    ),
  'business-info': () =>
    import('../../blocks/business-info/business-info-block.component').then(
      (m) => m.BusinessInfoBlockComponent
    ),
  'restaurant-menu': () =>
    import('../../blocks/restaurant-menu/restaurant-menu-block.component').then(
      (m) => m.RestaurantMenuBlockComponent
    ),
  'product-showcase': () =>
    import('../../blocks/product-showcase/product-showcase-block.component').then(
      (m) => m.ProductShowcaseBlockComponent
    ),
  'booking-cta': () =>
    import('../../blocks/booking-cta/booking-cta-block.component').then(
      (m) => m.BookingCtaBlockComponent
    ),
  'ai-chat': () =>
    import('../../blocks/ai-chat/ai-chat-block.component').then(
      (m) => m.AiChatBlockComponent
    ),
  'newsletter': () =>
    import('../../blocks/newsletter/newsletter-block.component').then(
      (m) => m.NewsletterBlockComponent
    ),
  'ai-chat-page': () =>
    import('../../blocks/ai-chat-page/ai-chat-page-block.component').then(
      (m) => m.AiChatPageBlockComponent
    ),
};
