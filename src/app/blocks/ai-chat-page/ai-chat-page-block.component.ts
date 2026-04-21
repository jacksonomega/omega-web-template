import { Component, ChangeDetectionStrategy, Input, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BlockBase } from '../../shared/block-base.interface';
import { AiChatPageBlockData } from '../../core/tenant/tenant.model';

interface ChatMessage {
  text: string;
  sender: 'user' | 'bot';
}

@Component({
  selector: 'app-ai-chat-page-block',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="ai-chat-page" 
         [style.--primaryColor]="data.primaryColor"
         [style.--bgColor]="data.bgColor"
         [style.--surfaceColor]="data.surfaceColor"
         [style.--textColor]="data.textColor">
      <div class="chat-sidebar">
        <!-- Sidebar placeholder to look like ChatGPT -->
        <button class="new-chat-btn" (click)="resetChat()">
          <span class="icon">+</span> {{ data.title || 'Nuevo Chat' }}
        </button>
        <div class="sidebar-info">
          <p class="sidebar-subtitle">{{ data.subtitle || 'Asistencia Inteligente' }}</p>
        </div>
      </div>
      
      <div class="chat-main">
        <div class="chat-messages" #scrollMe>
          @for (msg of messages(); track $index) {
            <div class="message-row" [class.user-row]="msg.sender === 'user'" [class.bot-row]="msg.sender === 'bot'">
              <div class="message-content">
                <div class="avatar">
                  @if (msg.sender === 'bot') {
                    <img [src]="data.assistantAvatar || 'https://ui-avatars.com/api/?name=AI&background=10b981&color=fff'" alt="AI Avatar">
                  } @else {
                    <img [src]="data.userAvatar || 'https://ui-avatars.com/api/?name=U&background=f3f4f6&color=333'" alt="User Avatar">
                  }
                </div>
                <div class="text">
                  <div class="sender-name">{{ msg.sender === 'bot' ? (data.assistantName || 'Asistente IA') : 'Tú' }}</div>
                  <div class="bubble">{{ msg.text }}</div>
                </div>
              </div>
            </div>
          }
          
          @if (isLoading()) {
            <div class="message-row bot-row">
              <div class="message-content">
                 <div class="avatar">
                    <img [src]="data.assistantAvatar || 'https://ui-avatars.com/api/?name=AI&background=10b981&color=fff'" alt="AI Avatar">
                 </div>
                 <div class="text">
                    <div class="sender-name">{{ data.assistantName || 'Asistente IA' }}</div>
                    <div class="bubble loading-bubble">Pensando...</div>
                 </div>
              </div>
            </div>
          }
        </div>
        
        <div class="chat-input-container">
          <form class="input-form" (ngSubmit)="sendMessage($event)">
            <input 
              type="text" 
              name="message" 
              [(ngModel)]="newMessage" 
              [placeholder]="data.placeholderText || 'Envía un mensaje...'" 
              [disabled]="isLoading()"
              autocomplete="off"
            />
            <button type="submit" [disabled]="!newMessage || isLoading()">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
    .ai-chat-page {
      display: flex;
      height: 100vh;
      height: 100dvh;
      min-height: 600px;
      width: 100%;
      background-color: var(--bgColor, #ffffff);
      color: var(--textColor, #333333);
      font-family: var(--fontFamily, inherit);
      margin-bottom: 0;
    }
    
    .chat-sidebar {
      width: 280px;
      background-color: var(--surfaceColor, #f9f9f9);
      padding: 20px;
      display: flex;
      flex-direction: column;
      border-right: 1px solid rgba(128,128,128,0.1);
    }
    
    @media (max-width: 768px) {
      .chat-sidebar {
        display: none;
      }
    }
    
    .new-chat-btn {
      background-color: var(--primaryColor, #10b981);
      color: #ffffff;
      border: none;
      padding: 14px 16px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 16px;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 12px;
      transition: all 0.2s ease;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .new-chat-btn:hover {
      filter: brightness(1.1);
      transform: translateY(-1px);
    }
    .new-chat-btn .icon {
      font-size: 22px;
      font-weight: 300;
    }
    
    .sidebar-info {
      margin-top: auto;
      padding-top: 16px;
      border-top: 1px solid rgba(128,128,128,0.1);
    }
    .sidebar-subtitle {
      font-size: 13px;
      color: var(--textMutedColor, #666);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-weight: 600;
    }
    
    .chat-main {
      flex: 1;
      display: flex;
      flex-direction: column;
      position: relative;
      background-color: var(--bgColor, #ffffff);
    }
    
    .chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 0 0 40px 0;
      scroll-behavior: smooth;
    }
    
    .message-row {
      padding: 32px 24px;
      display: flex;
      justify-content: center;
      border-bottom: 1px solid rgba(128,128,128,0.05);
    }
    
    .message-row.bot-row {
      background-color: var(--surfaceColor, #f9f9f9);
    }

    .message-row.user-row {
      background-color: transparent;
    }
    
    .message-content {
      width: 100%;
      max-width: 768px;
      display: flex;
      gap: 20px;
    }
    
    .avatar img {
      width: 32px;
      height: 32px;
      border-radius: 4px;
      object-fit: cover;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    
    .text {
      flex: 1;
      padding-top: 4px;
    }
    
    .sender-name {
      font-weight: 600;
      margin-bottom: 8px;
      font-size: 15px;
      color: var(--textColor, #333);
    }
    
    .bubble {
      font-size: 16px;
      line-height: 1.7;
      white-space: pre-wrap;
      color: var(--textColor, #333);
    }
    
    .loading-bubble {
      color: var(--textMutedColor, #666);
      font-style: italic;
      animation: pulse 1.5s infinite ease-in-out;
    }
    
    @keyframes pulse {
      0% { opacity: 0.4; }
      50% { opacity: 1; }
      100% { opacity: 0.4; }
    }
    
    .chat-input-container {
      padding: 24px;
      display: flex;
      justify-content: center;
      background: linear-gradient(0deg, var(--bgColor, #ffffff) 60%, transparent 100%);
      position: sticky;
      bottom: 0;
    }
    
    .input-form {
      width: 100%;
      max-width: 768px;
      display: flex;
      align-items: center;
      background-color: var(--surfaceColor, #ffffff);
      border: 1px solid rgba(128,128,128,0.2);
      border-radius: 16px;
      padding: 10px 16px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
      transition: border-color 0.2s;
    }

    .input-form:focus-within {
      border-color: var(--primaryColor, #10b981);
    }
    
    .input-form input {
      flex: 1;
      border: none;
      background: transparent;
      padding: 10px 8px;
      font-size: 16px;
      color: var(--textColor, #333333);
      outline: none;
      font-family: inherit;
    }
    
    .input-form button {
      background: var(--primaryColor, #10b981);
      border: none;
      color: white;
      cursor: pointer;
      padding: 8px;
      height: 36px;
      width: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      transition: all 0.2s;
    }
    
    .input-form button:hover:not(:disabled) {
      filter: brightness(1.1);
      transform: translateY(-1px);
    }
    
    .input-form button:disabled {
      opacity: 0.4;
      background: rgba(128,128,128,0.2);
      color: var(--textMutedColor, #666);
      cursor: not-allowed;
      transform: none;
    }
  `
  ]
})
export class AiChatPageBlockComponent implements OnInit, BlockBase<AiChatPageBlockData> {
  @Input({ required: true }) data!: AiChatPageBlockData;

  messages = signal<ChatMessage[]>([]);
  isLoading = signal(false);
  newMessage = '';

  private http = inject(HttpClient);

  ngOnInit() {
    this.resetChat();
  }

  resetChat() {
    this.messages.set([]);
    const welcome = this.data.welcomeMessage || '¡Hola! Soy tu asistente. ¿En qué te puedo ayudar?';
    if (welcome) {
      this.messages.update(m => [...m, { text: welcome, sender: 'bot' }]);
    }
  }

  sendMessage(event: Event) {
    event.preventDefault();
    const text = this.newMessage.trim();
    if (!text) return;

    this.messages.update(m => [...m, { text, sender: 'user' }]);
    this.newMessage = '';
    this.isLoading.set(true);

    const endpoint = this.data.endpointUrl;
    if (!endpoint) {
      this.isLoading.set(false);
      this.messages.update(m => [...m, { text: 'Endpoint no configurado.', sender: 'bot' }]);
      return;
    }

    this.http.post<{reply?: string; message?: string}>(endpoint, { message: text }).subscribe({
      next: (response) => {
        const botReply = response.reply || response.message || 'Respuesta de IA simulada.';
        this.messages.update(m => [...m, { text: botReply, sender: 'bot' }]);
        this.isLoading.set(false);
      },
      error: () => {
        this.messages.update(m => [...m, { text: 'Disculpa, tuve un error de conexión.', sender: 'bot' }]);
        this.isLoading.set(false);
      }
    });
  }
}
