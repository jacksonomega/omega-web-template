import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AiChatService {
  private http = inject(HttpClient);
  private webhookUrl = 'https://n8n.omega-studio.tech/webhook/atencion-al-cliente';

  sendMessage(message: string, configuredEndpoint?: string): Observable<string> {
    // Override whatever the block has configured with the required webhook
    const endpoint = this.webhookUrl;

    return this.http.post<any>(endpoint, { message }).pipe(
      map(response => {
        return response.reply || response.message || response.output || 'Respuesta recibida correctamente.';
      }),
      catchError(error => {
        console.error('Error in AiChatService:', error);
        return of('Disculpa, tuve un error de conexión.');
      })
    );
  }
}
