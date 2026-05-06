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

          const reader = response.body.getReader();
          const decoder = new TextDecoder('utf-8');
          let buffer = '';

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            
            // Split by newline. Both standard SSE and NDJSON use newlines.
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';
            
            for (let line of lines) {
              line = line.trim();
              if (!line) continue;
              
              if (line.startsWith('data:')) {
                line = line.substring(5).trim();
              }
              if (line === '[DONE]') continue;
              
              try {
                const parsed = JSON.parse(line);
                if (parsed.type === 'item' && typeof parsed.content === 'string') {
                  accumulatedText += parsed.content;
                } else if (parsed.token !== undefined) {
                  accumulatedText += parsed.token;
                } else if (parsed.text !== undefined) {
                  accumulatedText += parsed.text;
                } else if (parsed.response !== undefined) {
                  accumulatedText += parsed.response;
                } else if (parsed.output !== undefined) {
                  accumulatedText += parsed.output;
                } else if (parsed.message !== undefined) {
                  accumulatedText += parsed.message;
                } else if (parsed.reply !== undefined) {
                  accumulatedText += parsed.reply;
                }
                // Known NDJSON event types like "begin" and "end" are ignored
              } catch {
                // If it fails to parse, and it doesn't look like JSON, it might just be raw text
                if (!line.startsWith('{"') && !line.startsWith('[{')) {
                  accumulatedText += line;
                }
              }
            }
            observer.next(accumulatedText);
          }

          // If the final buffer has remaining valid JSON, parse it too
          if (buffer.trim()) {
            try {
              const parsed = JSON.parse(buffer.trim());
              const finalMsg = parsed.reply || parsed.message || parsed.output || parsed.text || parsed.response;
              if (finalMsg) accumulatedText += finalMsg;
            } catch {
              if (!buffer.trim().startsWith('{"')) {
                accumulatedText += buffer.trim();
              }
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
