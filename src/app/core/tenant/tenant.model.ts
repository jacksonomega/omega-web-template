// ─── Block Types ──────────────────────────────────────────────────────────────

export type BlockType =
  | 'hero'
  | 'features'
  | 'pricing'
  | 'contact'
  | 'testimonials'
  | 'footer'
  | 'item-list'
  | 'promo-timer'
  | 'video-embed'
  | 'gallery'
  | 'location'
  | 'faq'
  | 'text'
  | 'timeline'
  | 'business-info'
  | 'restaurant-menu'
  | 'product-showcase'
  | 'booking-cta'
  | 'ai-chat'
  | 'ai-chat-page'
  | 'newsletter';

export interface AiChatPageBlockData {
  title?: string;
  subtitle?: string;
  endpointUrl: string;
  welcomeMessage?: string;
  placeholderText?: string;
  assistantName?: string;
  assistantAvatar?: string;
  userAvatar?: string;
  primaryColor?: string;
  bgColor?: string;
  surfaceColor?: string;
  textColor?: string;
}

// ─── Block Data Interfaces ────────────────────────────────────────────────────

export interface HeroBlockData {
  headline: string;
  subheadline: string;
  ctaText?: string;
  ctaUrl?: string;
  actions?: ActionProp[];
  badge?: string;
  layout?: 'split' | 'centered' | 'full-bg';
  imageUrl?: string;
  backgroundType: 'image' | 'gradient' | 'video';
  backgroundVideoUrl?: string;
}

export interface PromoTimerBlockData {
  title: string;
  description?: string;
  endDate: string; // ISO Date String
  action?: ActionProp;
}

export interface VideoEmbedBlockData {
  url: string;
  platform: 'youtube' | 'tiktok' | 'instagram' | 'generic';
  caption?: string;
}

export interface Feature {
  icon: string;
  title: string;
  description: string;
}

export interface FeaturesBlockData {
  sectionTitle: string;
  features: Feature[];
}

export interface PricingPlan {
  name: string;
  price: number;
  currency: string;
  period: 'monthly' | 'annual';
  features: string[];
  highlighted: boolean;
  ctaText: string;
}

export interface PricingBlockData {
  sectionTitle: string;
  plans: PricingPlan[];
}

export interface ContactBlockData {
  sectionTitle: string;
  email: string;
  phone: string;
  address: string;
  showMap: boolean;
  mapEmbedUrl?: string;
}

export interface Testimonial {
  name: string;
  role: string;
  avatarUrl: string;
  quote: string;
  rating: number;
}

export interface TestimonialsBlockData {
  sectionTitle: string;
  testimonials: Testimonial[];
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

export interface FooterBlockData {
  copyrightText: string;
  links: { label: string; url: string }[];
  socialLinks: SocialLink[];
}

export interface AiChatBlockData {
  floatingPosition?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  buttonIcon?: string;
  buttonColor?: string;
  chatTitle?: string;
  welcomeMessage?: string;
  endpointUrl: string;
  placeholderText?: string;
}

export interface ActionProp {
  type: 'url' | 'whatsapp' | 'email' | 'scroll-to';
  url: string;
  label?: string;
}

export interface ListItem {
  id: string;
  title: string;
  price?: string;
  description?: string;
  imageUrl?: string;
  duration?: string;
  tags?: string[];
  action?: ActionProp;
}

export interface ListCategory {
  id: string;
  name: string;
  items: ListItem[];
}

export interface ItemListBlockData {
  header: { title: string; subtitle?: string };
  displayStyle: 'list' | 'card-grid' | 'menu';
  columns: { mobile: number; desktop: number };
  categories: ListCategory[];
}

export interface GalleryImage {
  url: string;
  caption?: string;
  altText?: string;
}

export interface GalleryBlockData {
  sectionTitle?: string;
  layout: 'grid' | 'carousel';
  images: GalleryImage[];
}

export interface LocationBlockData {
  sectionTitle?: string;
  address: string;
  description?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqBlockData {
  sectionTitle: string;
  subtitle?: string;
  faqs: FaqItem[];
  layout?: 'accordion' | 'grid';
}

export interface TextBlockData {
  sectionTitle?: string;
  subtitle?: string;
  paragraphs: string[];
  alignment?: 'left' | 'center' | 'right';
}

export interface TimelineEvent {
  date: string;
  title: string;
  description: string;
}

export interface TimelineBlockData {
  sectionTitle?: string;
  subtitle?: string;
  events: TimelineEvent[];
}

// ─── Vertical Business Blocks ────────────────────────────────────────────────

export interface BusinessInfoBlockData {
  sectionTitle?: string;
  openingHours: { day: string; hours: string }[];
  isOpenNow?: boolean;
  phone?: string;
  whatsapp?: string;
  email?: string;
  address?: string;
  mapEmbedUrl?: string;
}

export interface MenuItem {
  id: string;
  title: string;
  price: string;
  description?: string;
  allergens?: ('gluten' | 'lactose' | 'nuts' | 'vegan' | 'spicy')[];
  isPopular?: boolean;
}

export interface MenuCategory {
  id: string;
  name: string;
  items: MenuItem[];
}

export interface RestaurantMenuBlockData {
  sectionTitle?: string;
  subtitle?: string;
  categories: MenuCategory[];
}

export interface ProductShowcaseItem {
  id: string;
  title: string;
  price: string;
  originalPrice?: string;
  imageUrl: string;
  badge?: string;
  actionUrl?: string;
}

export interface ProductShowcaseBlockData {
  sectionTitle?: string;
  subtitle?: string;
  layout: 'carousel' | 'grid';
  products: ProductShowcaseItem[];
}

export interface BookingCtaBlockData {
  title: string;
  subtitle?: string;
  widgetType: 'calendly' | 'thefork' | 'custom' | 'button-only';
  widgetUrl?: string;
  buttonLabel?: string;
  buttonUrl?: string;
  imageUrl?: string;
}

export interface NewsletterBlockData {
  title: string;
  subtitle?: string;
  placeholderText?: string;
  buttonText?: string;
  imageUrl?: string;
  layout?: 'split' | 'centered';
  type?: 'email' | 'phone' | 'both';
}

// ─── Discriminated Union ──────────────────────────────────────────────────────

export type BlockData =
  | HeroBlockData
  | FeaturesBlockData
  | PricingBlockData
  | ContactBlockData
  | TestimonialsBlockData
  | FooterBlockData
  | ItemListBlockData
  | PromoTimerBlockData
  | VideoEmbedBlockData
  | GalleryBlockData
  | LocationBlockData
  | FaqBlockData
  | TextBlockData
  | TimelineBlockData
  | BusinessInfoBlockData
  | RestaurantMenuBlockData
  | ProductShowcaseBlockData
  | BookingCtaBlockData
  | AiChatBlockData
  | NewsletterBlockData
  | AiChatPageBlockData;

// ─── Page Block ───────────────────────────────────────────────────────────────

export interface PageBlock<T extends BlockData = BlockData> {
  id: string;
  type: BlockType;
  order: number;
  visible: boolean;
  data: T;
}

// ─── Tenant Theme (CSS Custom Properties map) ─────────────────────────────────

export interface TenantTheme {
  primaryColor: string;    // --color-primary
  secondaryColor: string;  // --color-secondary
  accentColor: string;     // --color-accent
  bgColor: string;         // --color-bg
  surfaceColor: string;    // --color-surface
  textColor: string;       // --color-text
  textMutedColor: string;  // --color-text-muted
  fontFamily: string;      // --font-family
  fontFamilyUrl?: string;  // Google Fonts URL to inject
  borderRadius: string;    // --border-radius
  logoUrl: string;
  faviconUrl: string;
}

// ─── SEO ──────────────────────────────────────────────────────────────────────

export interface TenantSeo {
  title: string;
  description: string;
  ogImage: string;
  keywords: string[];
}

// ─── Site Pages ───────────────────────────────────────────────────────────────

export interface TenantPage {
  id: string;
  path: string;       // e.g., '/' or '/about'
  name: string;       // Display name for navigation menus
  seo?: TenantSeo;    // Page-specific SEO overrides
  blocks: PageBlock[];
}

// ─── Root Tenant Config (JSON Schema from API) ────────────────────────────────

export interface TenantConfig {
  tenantId: string;
  companyPublicId?: string;
  slug: string;
  businessName: string;
  theme: TenantTheme;
  globalSeo: TenantSeo;
  pages: TenantPage[];
}
