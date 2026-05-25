import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Produit, PanierItem, Commande } from '../../shared/models/buffet.model';

@Injectable({ providedIn: 'root' })
export class BuffetService {
  private apiUrl = `${environment.apiUrl}/products`;
  private orderUrl = `${environment.apiUrl}/orders`;

  private panier: PanierItem[] = [];
  private panierSubject = new BehaviorSubject<PanierItem[]>([]);
  panier$ = this.panierSubject.asObservable();

  constructor(private http: HttpClient) {}

  getProduits(): Observable<Produit[]> {
    return this.http.get<any[]>(`${this.apiUrl}/active`).pipe(
      map(products => products.map(p => ({
        id: p.id,
        nom: p.name,
        categorie: p.category,
        prix: p.price,
        imageUrl: p.imageUrl,
        actif: p.active
      })))
    );
  }

  getCategories(): Observable<string[]> {
    return this.getProduits().pipe(
      map(produits => {
        this._categories = [...new Set(produits.map(p => p.categorie))];
        return this._categories;
      })
    );
  }
  private _categories: string[] = [];
  getCategoriesSync(): string[] { return this._categories; }

  addToPanier(produit: Produit) {
    const existing = this.panier.find(item => item.produit.id === produit.id);
    if (existing) {
      existing.quantite++;
    } else {
      this.panier.push({ produit, quantite: 1 });
    }
    this.panierSubject.next([...this.panier]);
  }

  removeFromPanier(produitId: number) {
    const index = this.panier.findIndex(item => item.produit.id === produitId);
    if (index !== -1) {
      if (this.panier[index].quantite > 1) {
        this.panier[index].quantite--;
      } else {
        this.panier.splice(index, 1);
      }
    }
    this.panierSubject.next([...this.panier]);
  }

  getPanierTotal(): number {
    return this.panier.reduce((total, item) => total + (item.produit.prix * item.quantite), 0);
  }

  encaisser(): Observable<Commande> {
    const orderPayload = {
      items: this.panier.map(item => ({
        productId: item.produit.id,
        quantity: item.quantite
      }))
    };
    return this.http.post<Commande>(this.orderUrl, orderPayload).pipe(
      tap(() => {
        this.panier = [];
        this.panierSubject.next([]);
      })
    );
  }

  addProduit(produit: { name: string; category: string; price: number }): Observable<Produit> {
    return this.http.post<any>(this.apiUrl, produit).pipe(
      map(p => ({
        id: p.id,
        nom: p.name,
        categorie: p.category,
        prix: p.price,
        imageUrl: p.imageUrl,
        actif: p.active
      }))
    );
  }

  updateProduit(id: number, produit: { name: string; category: string; price: number }): Observable<Produit> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, produit).pipe(
      map(p => ({
        id: p.id,
        nom: p.name,
        categorie: p.category,
        prix: p.price,
        imageUrl: p.imageUrl,
        actif: p.active
      }))
    );
  }

  deleteProduit(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getAllProduits(): Observable<Produit[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(products => products.map(p => ({
        id: p.id,
        nom: p.name,
        categorie: p.category,
        prix: p.price,
        imageUrl: p.imageUrl,
        actif: p.active
      })))
    );
  }
}
