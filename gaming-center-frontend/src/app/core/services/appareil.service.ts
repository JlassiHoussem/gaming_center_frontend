import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Appareil, KPI } from '../../shared/models/appareil.model';
import { Produit } from '../../shared/models/produit.model';

@Injectable({ providedIn: 'root' })
export class AppareilService {
  private apiUrl = `${environment.apiUrl}/devices`;
  private sessionUrl = `${environment.apiUrl}/sessions`;
  private productUrl = `${environment.apiUrl}/products`;
  private orderUrl = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) {}

  getAppareils(): Observable<Appareil[]> {
    return forkJoin({
      devices: this.http.get<any[]>(this.apiUrl),
      sessions: this.http.get<any[]>(`${this.sessionUrl}/active`)
    }).pipe(
      map(({ devices, sessions }) => {
        const sessionMap = new Map<number, any>();
        sessions.forEach(s => sessionMap.set(s.deviceId, s));
        return devices.map(d => {
          const session = sessionMap.get(d.id);
          let sessionStart: Date | undefined;
          if (session && session.startTime) {
            const parts = session.startTime;
            if (Array.isArray(parts)) {
              sessionStart = new Date(parts[0], parts[1] - 1, parts[2], parts[3], parts[4], parts[5]);
            } else {
              sessionStart = new Date(session.startTime);
            }
          }
          return {
            id: d.id,
            nom: d.name,
            type: this.mapType(d.type),
            tarifHoraire: d.hourlyRate,
            statut: this.mapStatus(d.status),
            sessionStart
          };
        });
      })
    );
  }

  getKPIs(): Observable<KPI> {
    return this.http.get<KPI>(`${environment.apiUrl}/dashboard/kpis`);
  }

  getProduits(): Observable<Produit[]> {
    return this.http.get<any[]>(this.productUrl).pipe(
      map(products => products.map(p => ({
        id: p.id,
        name: p.name,
        category: p.category,
        price: p.price,
        imageUrl: p.imageUrl,
        active: p.active
      })))
    );
  }

  addProduit(produit: { name: string; category: string; price: number }): Observable<Produit> {
    return this.http.post<any>(this.productUrl, produit).pipe(
      map(p => ({
        id: p.id,
        name: p.name,
        category: p.category,
        price: p.price,
        imageUrl: p.imageUrl,
        active: p.active
      }))
    );
  }

  updateProduit(id: number, produit: { name: string; category: string; price: number }): Observable<Produit> {
    return this.http.put<any>(`${this.productUrl}/${id}`, produit).pipe(
      map(p => ({
        id: p.id,
        name: p.name,
        category: p.category,
        price: p.price,
        imageUrl: p.imageUrl,
        active: p.active
      }))
    );
  }

  deleteProduit(id: number): Observable<void> {
    return this.http.delete<void>(`${this.productUrl}/${id}`);
  }

  createOrder(order: { items: { productId: number; quantity: number; unitPrice: number }[]; sessionId?: number }): Observable<any> {
    const dto = {
      items: order.items,
      sessionId: order.sessionId,
      total: 0
    };
    return this.http.post(this.orderUrl, dto);
  }

  addAppareil(appareil: Appareil): Observable<Appareil> {
    const dto = {
      name: appareil.nom,
      type: appareil.type.toUpperCase(),
      hourlyRate: appareil.tarifHoraire,
      status: appareil.statut ? appareil.statut.toUpperCase() : 'LIBRE'
    };
    return this.http.post<any>(this.apiUrl, dto).pipe(
      map(d => ({
        id: d.id,
        nom: d.name,
        type: this.mapType(d.type),
        tarifHoraire: d.hourlyRate,
        statut: this.mapStatus(d.status)
      }))
    );
  }

  updateAppareil(id: number, appareil: Appareil): Observable<Appareil> {
    const dto = {
      name: appareil.nom,
      type: appareil.type.toUpperCase(),
      hourlyRate: appareil.tarifHoraire,
      status: appareil.statut ? appareil.statut.toUpperCase() : 'LIBRE'
    };
    return this.http.put<any>(`${this.apiUrl}/${id}`, dto).pipe(
      map(d => ({
        id: d.id,
        nom: d.name,
        type: this.mapType(d.type),
        tarifHoraire: d.hourlyRate,
        statut: this.mapStatus(d.status)
      }))
    );
  }

  deleteAppareil(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  startSession(id: number): Observable<any> {
    return this.http.post(`${this.sessionUrl}/start/${id}`, {});
  }

  stopSession(id: number): Observable<any> {
    return this.http.post(`${this.sessionUrl}/stop/device/${id}`, {});
  }

  private mapType(type: string): Appareil['type'] {
    const map: Record<string, Appareil['type']> = {
      'PC': 'PC', 'PS4': 'PS4', 'PS5': 'PS5', 'XBOX': 'Xbox', 'SIMULATEUR': 'Simulateur'
    };
    return map[type.toUpperCase()] || 'PC';
  }

  private mapStatus(status: string): Appareil['statut'] {
    const map: Record<string, Appareil['statut']> = {
      'LIBRE': 'libre', 'OCCUPE': 'occupe', 'MAINTENANCE': 'maintenance'
    };
    return map[status.toUpperCase()] || 'libre';
  }
}
