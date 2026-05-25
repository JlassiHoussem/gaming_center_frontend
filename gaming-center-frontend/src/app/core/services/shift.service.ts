import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Shift } from '../../shared/models/shift.model';

@Injectable({ providedIn: 'root' })
export class ShiftService {
  private apiUrl = `${environment.apiUrl}/shifts`;

  constructor(private http: HttpClient) {}

  getCurrentShift(): Observable<Shift | null> {
    return this.http.get<any>(`${this.apiUrl}/current`).pipe(
      map(shift => shift ? this.mapShift(shift) : null)
    );
  }

  openShift(): Observable<Shift> {
    return this.http.post<any>(`${this.apiUrl}/open`, {}).pipe(
      map(res => this.mapShift(res))
    );
  }

  closeShift(): Observable<Shift> {
    return this.http.post<any>(`${this.apiUrl}/close`, {}).pipe(
      map(res => this.mapShift(res))
    );
  }

  getHistorique(): Observable<Shift[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(shifts => shifts.map(s => this.mapShift(s)))
    );
  }

  private mapShift(data: any): Shift {
    return {
      id: data.id,
      dateOuverture: new Date(data.openedAt),
      dateFermeture: data.closedAt ? new Date(data.closedAt) : undefined,
      revenusSessions: data.sessionRevenue || 0,
      revenusBuffet: data.buffetRevenue || 0,
      totalDepenses: data.totalExpenses || 0,
      benefice: data.netProfit || 0,
      actif: data.active
    };
  }
}
