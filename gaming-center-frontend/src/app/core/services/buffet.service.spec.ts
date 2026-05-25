import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { BuffetService } from './buffet.service';
import { environment } from '../../../environments/environment';
import { Produit } from '../../shared/models/buffet.model';

describe('BuffetService', () => {
  let service: BuffetService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/products`;
  const orderUrl = `${environment.apiUrl}/orders`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(BuffetService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getProduits', () => {
    it('should fetch active products and map to Produit[]', () => {
      const mockResponse = [
        { id: 1, name: 'Coca', category: 'Boissons', price: 3.50, imageUrl: null, active: true },
        { id: 2, name: 'Chips', category: 'Snacks', price: 2.00, imageUrl: null, active: true },
      ];

      service.getProduits().subscribe(produits => {
        expect(produits.length).toBe(2);
        expect(produits[0].nom).toBe('Coca');
        expect(produits[0].categorie).toBe('Boissons');
        expect(produits[0].prix).toBe(3.50);
        expect(produits[0].actif).toBe(true);
        expect(produits[1].nom).toBe('Chips');
      });

      const req = httpMock.expectOne(`${apiUrl}/active`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('getAllProduits', () => {
    it('should fetch all products', () => {
      const mockResponse = [
        { id: 1, name: 'Coca', category: 'Boissons', price: 3.50, imageUrl: null, active: true },
        { id: 2, name: 'Fanta', category: 'Boissons', price: 3.50, imageUrl: null, active: false },
      ];

      service.getAllProduits().subscribe(produits => {
        expect(produits.length).toBe(2);
        expect(produits[1].actif).toBe(false);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('panier management', () => {
    const coca: Produit = { id: 1, nom: 'Coca', categorie: 'Boissons', prix: 3.50, actif: true };
    const chips: Produit = { id: 2, nom: 'Chips', categorie: 'Snacks', prix: 2.00, actif: true };

    it('should add item to panier', () => {
      service.addToPanier(coca);
      service.panier$.subscribe(panier => {
        expect(panier.length).toBe(1);
        expect(panier[0].produit.nom).toBe('Coca');
        expect(panier[0].quantite).toBe(1);
      });
    });

    it('should increment quantity when adding same item twice', () => {
      service.addToPanier(coca);
      service.addToPanier(coca);
      service.panier$.subscribe(panier => {
        expect(panier.length).toBe(1);
        expect(panier[0].quantite).toBe(2);
      });
    });

    it('should add different items separately', () => {
      service.addToPanier(coca);
      service.addToPanier(chips);
      service.panier$.subscribe(panier => {
        expect(panier.length).toBe(2);
      });
    });

    it('should decrement quantity on removeFromPanier', () => {
      service.addToPanier(coca);
      service.addToPanier(coca);
      service.removeFromPanier(1);
      service.panier$.subscribe(panier => {
        expect(panier[0].quantite).toBe(1);
      });
    });

    it('should remove item when quantity reaches 0', () => {
      service.addToPanier(coca);
      service.removeFromPanier(1);
      service.panier$.subscribe(panier => {
        expect(panier.length).toBe(0);
      });
    });

    it('should calculate panier total correctly', () => {
      service.addToPanier(coca);
      service.addToPanier(coca);
      service.addToPanier(chips);
      expect(service.getPanierTotal()).toBe(9.00);
    });
  });

  describe('encaisser', () => {
    it('should POST order and clear panier', () => {
      const coca: Produit = { id: 1, nom: 'Coca', categorie: 'Boissons', prix: 3.50, actif: true };
      service.addToPanier(coca);

      service.encaisser().subscribe(() => {
        service.panier$.subscribe(panier => {
          expect(panier.length).toBe(0);
        });
      });

      const req = httpMock.expectOne(orderUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ items: [{ productId: 1, quantity: 1 }] });
      req.flush({ id: 1, items: [], total: 3.50, date: new Date() });
    });
  });

  describe('addProduit', () => {
    it('should POST and map response', () => {
      const payload = { name: 'Nouveau', category: 'Snacks', price: 5.00 };
      const mockResponse = { id: 10, name: 'Nouveau', category: 'Snacks', price: 5.00, imageUrl: null, active: true };

      service.addProduit(payload).subscribe(produit => {
        expect(produit.id).toBe(10);
        expect(produit.nom).toBe('Nouveau');
        expect(produit.prix).toBe(5.00);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(payload);
      req.flush(mockResponse);
    });
  });

  describe('updateProduit', () => {
    it('should PUT and map response', () => {
      const payload = { name: 'Modifié', category: 'Boissons', price: 4.00 };
      const mockResponse = { id: 1, name: 'Modifié', category: 'Boissons', price: 4.00, imageUrl: null, active: true };

      service.updateProduit(1, payload).subscribe(produit => {
        expect(produit.nom).toBe('Modifié');
        expect(produit.prix).toBe(4.00);
      });

      const req = httpMock.expectOne(`${apiUrl}/1`);
      expect(req.request.method).toBe('PUT');
      req.flush(mockResponse);
    });
  });

  describe('deleteProduit', () => {
    it('should DELETE the product', () => {
      service.deleteProduit(1).subscribe(response => {
        expect(response).toBeNull();
      });

      const req = httpMock.expectOne(`${apiUrl}/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });
});
