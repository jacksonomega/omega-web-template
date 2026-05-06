import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TenantService } from '../tenant/tenant.service';

@Injectable({
  providedIn: 'root'
})
export class AiChatService {
  private http = inject(HttpClient);
  private tenantService = inject(TenantService);
  private webhookUrl = 'https://n8n.omega-studio.tech/webhook/atencion-al-cliente';
  private sessionId = crypto.randomUUID();

  sendMessage(message: string, configuredEndpoint?: string): Observable<string> {
    const endpoint = this.webhookUrl;
    const publicId = this.tenantService.getCompanyPublicId();
    let url = endpoint;
    if (publicId) {
      url += `?publicId=${encodeURIComponent(publicId)}`;
    }

    return new Observable<string>(observer => {
      const controller = new AbortController();
      let accumulatedText = '';

      async function processStream(sessionId: string) {
        try {
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'text/event-stream, application/json, text/plain'
            },
            body: JSON.stringify({ message, sessionId }),
            signal: controller.signal
          });

          if (!response.ok || !response.body) {
            throw new Error(`HTTP Error: ${response.status}`);
          }

          const isSSE = response.headers.get('content-type')?.includes('text/event-stream');
          const reader = response.body.getReader();
          const decoder = new TextDecoder('utf-8');
          let buffer = '';

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunkStr = decoder.decode(value, { stream: true });
            
            if (isSSE) {
              buffer += chunkStr;
              const events = buffer.split('\n\n');
              buffer = events.pop() || '';
              
              for (const ev of events) {
                const lines = ev.split('\n');
                for (const line of lines) {
                  if (line.startsWith('data:')) {
                    const dataStr = line.substring(5).trim();
                    if (dataStr === '[DONE]') continue;
                    try {
                      const parsed = JSON.parse(dataStr);
                      const token = parsed.token ?? parsed.text ?? parsed.response ?? parsed.output ?? parsed.message ?? parsed.reply ?? dataStr;
                      accumulatedText += token;
                    } catch {
                      accumulatedText += dataStr;
                    }
                  }
                }
              }
              observer.next(accumulatedText);
            } else {
              // Raw streams
              accumulatedText += chunkStr;
              observer.next(accumulatedText);
            }
          }

          // If not SSE, and it replied with a single JSON block
          if (!isSSE && accumulatedText) {
            try {
              const parsed = JSON.parse(accumulatedText);
              const finalMsg = parsed.reply || parsed.message || parsed.output || parsed.text || parsed.response;
              if (finalMsg) accumulatedText = finalMsg;
            } catch {
              // Was not JSON, just plain text
            }
          }

          if (!accumulatedText) {
            accumulatedText = 'Respuesta recibida correctamente.';
          }
          
          observer.next(accumulatedText);
          observer.complete();
        } catch (error: any) {
          if (error.name !== 'AbortError') {
            console.error('Error in AiChatService:', error);
            observer.next('Disculpa, tuve un error de conexión.');
            observer.complete();
          }
        }
      }

      processStream(this.sessionId);

      return () => controller.abort();
    });
  }
}
