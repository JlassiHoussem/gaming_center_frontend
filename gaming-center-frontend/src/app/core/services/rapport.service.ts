import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { RapportData, Parametres } from '../../shared/models/rapport.model';

@Injectable({ providedIn: 'root' })
export class RapportService {
  private apiUrl = `${environment.apiUrl}/reports`;

  constructor(private http: HttpClient) {}

  getRapport(period: string): Observable<RapportData> {
    const endpoint = period === 'weekly' ? 'weekly' : period === 'monthly' ? 'monthly' : 'annual';
    return this.http.get<any>(`${this.apiUrl}/${endpoint}`).pipe(
      map(data => ({
        periode: data.period,
        totalVentes: data.totalSales || 0,
        totalDepenses: data.totalExpenses || 0,
        beneficeNet: data.netProfit || 0,
        revenusParJour: (data.revenuePerDay || []).map((r: any) => ({
          jour: r.day,
          sessions: r.sessions || 0,
          buffet: r.buffet || 0
        })),
        heuresParAppareil: (data.deviceHours || []).map((h: any) => ({
          nom: h.deviceName,
          heures: h.hours || 0
        })),
        topProduits: (data.topProducts || []).map((p: any, i: number) => ({
          rang: i + 1,
          nom: p.name,
          quantite: p.quantity || 0,
          revenus: p.revenue || 0
        })),
        shifts: (data.shifts || []).map((s: any) => ({
          date: s.date,
          ouverture: s.openedAt,
          fermeture: s.closedAt,
          sessions: s.sessionRevenue || 0,
          buffet: s.buffetRevenue || 0,
          depenses: s.expenses || 0,
          benefice: s.netProfit || 0
        }))
      }))
    );
  }

  private settingsUrl = `${environment.apiUrl}/settings`;

  getParametres(): Observable<Parametres> {
    return this.http.get<any>(this.settingsUrl).pipe(
      map(s => ({
        nomEtablissement: s.establishmentName,
        devise: s.currency,
        fuseauHoraire: s.timezone,
        typesAppareils: s.deviceTypes || [],
        categoriesBuffet: s.buffetCategories || []
      }))
    );
  }

  saveParametres(params: Parametres): Observable<void> {
    return this.http.put<void>(this.settingsUrl, {
      establishmentName: params.nomEtablissement,
      currency: params.devise,
      timezone: params.fuseauHoraire,
      deviceTypes: params.typesAppareils,
      buffetCategories: params.categoriesBuffet
    });
  }
}
