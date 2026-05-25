import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Depense } from '../../shared/models/shift.model';

@Injectable({ providedIn: 'root' })
export class DepenseService {
  private apiUrl = `${environment.apiUrl}/expenses`;

  constructor(private http: HttpClient) {}

  getDepenses(): Observable<Depense[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(expenses => expenses.map(e => ({
        id: e.id,
        libelle: e.description,
        montant: e.amount,
        date: new Date(e.expenseDate || Date.now()),
        shiftId: e.shiftId
      })))
    );
  }

  addDepense(depense: { libelle: string; montant: number }): Observable<Depense> {
    return this.http.post<any>(this.apiUrl, {
      description: depense.libelle,
      amount: depense.montant
    }).pipe(map(e => ({
      id: e.id,
      libelle: e.description,
      montant: e.amount,
      date: new Date(e.expenseDate || Date.now()),
      shiftId: e.shiftId
    })));
  }

  updateDepense(id: number, depense: { libelle: string; montant: number }): Observable<Depense> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, {
      description: depense.libelle,
      amount: depense.montant
    }).pipe(map(e => ({
      id: e.id,
      libelle: e.description,
      montant: e.amount,
      date: new Date(e.expenseDate || Date.now()),
      shiftId: e.shiftId
    })));
  }

  deleteDepense(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
