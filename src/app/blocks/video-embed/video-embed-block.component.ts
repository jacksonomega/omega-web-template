import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { VideoEmbedBlockData } from '../../core/tenant/tenant.model';

@Component({
  selector: 'app-video-embed-block',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="video-embed">
      <div class="video-embed__container" [attr.data-platform]="data.platform">
        
        <div class="video-embed__wrapper">
          <iframe 
            [src]="safeUrl" 
            class="video-embed__iframe"
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen>
          </iframe>
        </div>

        @if (data.caption) {
          <p class="video-embed__caption">{{ data.caption }}</p>
        }
      </div>
    </section>
  `,
  styles: [`
    .video-embed {
      background: var(--color-bg);
      padding: 4rem 2rem;
    }

    .video-embed__container {
      max-width: 800px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;
    }

    .video-embed__wrapper {
      width: 100%;
      position: relative;
      border-radius: var(--border-radius);
      overflow: hidden;
      background: color-mix(in srgb, var(--color-text-muted) 10%, transparent);
      box-shadow: 0 10px 30px color-mix(in srgb, var(--color-primary) 10%, transparent);
    }
    
    /* Horizontal Aspect Ratio (YouTube, Generic) */
    .video-embed__wrapper {
      aspect-ratio: 16 / 9;
    }
    
    /* Vertical Aspect Ratio (TikTok, Instagram) */
    [data-platform="tiktok"] .video-embed__wrapper,
    [data-platform="instagram"] .video-embed__wrapper {
      max-width: 400px;
      aspect-ratio: 9 / 16;
    }

    .video-embed__iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border: 0;
    }

    .video-embed__caption {
      font-size: 1rem;
      color: var(--color-text-muted);
      text-align: center;
      max-width: 600px;
      margin: 0;
      font-style: italic;
    }
  `]
})
export class VideoEmbedBlockComponent implements OnInit {
  @Input({ required: true }) data!: VideoEmbedBlockData;
  private sanitizer = inject(DomSanitizer);
  safeUrl!: SafeResourceUrl;

  ngOnInit() {
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.data.url);
  }
}
