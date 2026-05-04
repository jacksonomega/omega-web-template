import { Component, ChangeDetectionStrategy, Input, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BlockBase } from '../../shared/block-base.interface';
import { AiChatBlockData } from '../../core/tenant/tenant.model';
import { AiChatService } from '../../core/ai-chat/ai-chat.service';

interface ChatMessage {
  text: string;
  sender: 'user' | 'bot';
}

@Component({
  selector: 'app-ai-chat-block',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="ai-chat-container"
      [class.open]="isOpen()"
      [ngClass]="positionClass()"
      [style.--chat-theme]="data.buttonColor || 'var(--primaryColor)'"
    >
      <!-- Chat Toggle Button -->
      @if (!isOpen()) {
        <button
          class="chat-toggle-btn"
          (click)="toggleChat()"
        >
          <span class="icon">{{ data.buttonIcon || '💬' }}</span>
        </button>
      }

      <!-- Chat Panel -->
      @if (isOpen()) {
        <div class="chat-panel">
          <div class="chat-header">
            <h3 class="chat-title">{{ data.chatTitle || 'Asistente Virtual' }}</h3>
            <button class="close-btn" (click)="toggleChat()">✕</button>
          </div>

          <div class="chat-messages">
            @for (msg of messages(); track $index) {
              <div class="message" [class.user]="msg.sender === 'user'" [class.bot]="msg.sender === 'bot'">
                <div class="message-bubble">{{ msg.text }}</div>
              </div>
            }

            @if (isLoading()) {
              <div class="message bot loading">
                <div class="message-bubble">...</div>
              </div>
            }
          </div>

          <form class="chat-input-area" (ngSubmit)="sendMessage($event)">
            <input
              type="text"
              name="message"
              [(ngModel)]="newMessage"
              [placeholder]="data.placeholderText || 'Type a message...'"
              [disabled]="isLoading()"
              class="chat-input"
              autocomplete="off"
            />
            <button
              type="submit"
              class="send-btn"
              [disabled]="!newMessage || isLoading()"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </form>
        </div>
      }
    </div>
  `,
  styles: [
    `
      .ai-chat-container {
        position: fixed;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
      }

      /* Positions */
      .pos-bottom-right { bottom: 20px; right: 20px; }
      .pos-bottom-left { bottom: 20px; left: 20px; align-items: flex-start; }
      .pos-top-right { top: 20px; right: 20px; flex-direction: column-reverse; }
      .pos-top-left { top: 20px; left: 20px; align-items: flex-start; flex-direction: column-reverse; }

      .chat-toggle-btn {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        border: none;
        background-color: var(--chat-theme, #007bff);
        color: white;
        font-size: 24px;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0,0,0,0.25);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      }
      .chat-toggle-btn:hover {
        transform: scale(1.1);
      }

      .chat-panel {
        width: 350px;
        height: 500px;
        max-height: 80vh;
        max-width: 90vw;
        background: white;
        border-radius: 16px;
        box-shadow: 0 12px 32px rgba(0,0,0,0.3);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        font-family: inherit;
        border: 1px solid rgba(0,0,0,0.05);
        animation: chatSlideIn 0.3s ease-out forwards;
      }
      
      @keyframes chatSlideIn {
        from { opacity: 0; transform: translateY(20px) scale(0.95); }
        to { opacity: 1; transform: translateY(0) scale(1); }
      }

      .pos-bottom-right .chat-panel, .pos-bottom-left .chat-panel { margin-bottom: 20px; }
      .pos-top-right .chat-panel, .pos-top-left .chat-panel { margin-top: 20px; }

      .chat-header {
        background-color: var(--chat-theme, #007bff);
        color: white;
        padding: 16px 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        z-index: 2;
      }
      .chat-title {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
        letter-spacing: 0.3px;
      }
      .close-btn {
        background: none;
        border: none;
        color: white;
        font-size: 18px;
        cursor: pointer;
      }

      .chat-messages {
        flex: 1;
        padding: 20px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 14px;
        background: var(--surfaceColor, #f8f9fa);
      }

      .message {
        display: flex;
        max-width: 82%;
      }
      .message.user {
        align-self: flex-end;
      }
      .message.bot {
        align-self: flex-start;
      }

      .message-bubble {
        padding: 12px 16px;
        border-radius: 18px;
        font-size: 14px;
        line-height: 1.5;
        word-wrap: break-word;
        box-shadow: 0 1px 2px rgba(0,0,0,0.05);
      }
      .message.user .message-bubble {
        background-color: var(--chat-theme, #007bff);
        color: white;
        border-bottom-right-radius: 4px;
      }
      .message.bot .message-bubble {
        background-color: white;
        color: var(--textColor, #222);
        border: 1px solid rgba(0,0,0,0.05);
        border-bottom-left-radius: 4px;
      }

      .chat-input-area {
        display: flex;
        padding: 16px;
        border-top: 1px solid rgba(0,0,0,0.08);
        background: white;
        align-items: center;
      }
      .chat-input {
        flex: 1;
        border: 1px solid rgba(0,0,0,0.1);
        border-radius: 24px;
        padding: 10px 18px;
        font-size: 15px;
        outline: none;
        background: var(--surfaceColor, #f8f9fa);
        color: var(--textColor, #222);
        transition: border-color 0.2s;
      }
      .chat-input:focus {
        border-color: var(--chat-theme, #007bff);
      }
      .send-btn {
        background: none;
        border: none;
        color: var(--chat-theme, #007bff);
        font-size: 22px;
        cursor: pointer;
        padding: 0 4px 0 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: opacity 0.2s;
      }
      .send-btn:disabled {
        opacity: 0.3;
        cursor: not-allowed;
      }
    `
  ]
})
export class AiChatBlockComponent implements OnInit, BlockBase<AiChatBlockData> {
  @Input({ required: true }) data!: AiChatBlockData;

  isOpen = signal(false);
  messages = signal<ChatMessage[]>([]);
  isLoading = signal(false);
  newMessage = '';

  private chatService = inject(AiChatService);

  ngOnInit() {
    // Add effect or init to set welcome message if any
    setTimeout(() => {
      const welcome = this.data.welcomeMessage;
      if (welcome) {
        this.messages.update(m => [...m, { text: welcome, sender: 'bot' }]);
      }
    }, 0);
  }

  positionClass(): string {
    const pos = this.data.floatingPosition || 'bottom-right';
    return `pos-${pos}`;
  }

  toggleChat() {
    this.isOpen.update(v => !v);
  }

  sendMessage(event: Event) {
    event.preventDefault();
    const text = this.newMessage.trim();
    if (!text) return;

    // Add user message to UI
    this.messages.update(m => [...m, { text, sender: 'user' }]);
    this.newMessage = '';
    this.isLoading.set(true);

    const endpoint = this.data.endpointUrl;

    // Call the external API
    this.chatService.sendMessage(text, endpoint).subscribe(botReply => {
      this.messages.update(m => [...m, { text: botReply, sender: 'bot' }]);
      this.isLoading.set(false);
    });
  }
}
