import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { TenantService } from '../tenant/tenant.service';

@Injectable({
  providedIn: 'root'
})
export class AiChatService {
  private http = inject(HttpClient);
  private tenantService = inject(TenantService);
  private webhookUrl = 'https://n8n.omega-studio.tech/webhook-test/atencion-al-cliente';

  sendMessage(message: string, configuredEndpoint?: string): Observable<string> {
    // Override whatever the block has configured with the required webhook
    const endpoint = this.webhookUrl;
    
    let params = new HttpParams();
    const publicId = this.tenantService.getCompanyPublicId();
    if (publicId) {
      params = params.set('publicId', publicId);
    }

    return this.http.post<any>(endpoint, { message }, { params }).pipe(
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
