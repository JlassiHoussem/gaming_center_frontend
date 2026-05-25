import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { DepenseService } from './depense.service';
import { environment } from '../../../environments/environment';

describe('DepenseService', () => {
  let service: DepenseService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/expenses`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(DepenseService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getDepenses', () => {
    it('should fetch all expenses and map to Depense[]', () => {
      const mockResponse = [
        { id: 1, description: 'Électricité', amount: 150.50, expenseDate: '2026-05-24T08:00:00Z', shiftId: 1 },
        { id: 2, description: 'Fournitures', amount: 45.00, expenseDate: '2026-05-24T09:00:00Z', shiftId: 1 },
      ];

      service.getDepenses().subscribe(depenses => {
        expect(depenses.length).toBe(2);
        expect(depenses[0].id).toBe(1);
        expect(depenses[0].libelle).toBe('Électricité');
        expect(depenses[0].montant).toBe(150.50);
        expect(depenses[0].shiftId).toBe(1);
        expect(depenses[1].libelle).toBe('Fournitures');
        expect(depenses[1].montant).toBe(45.00);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should use fallback date when expenseDate is null', () => {
      const mockResponse = [
        { id: 1, description: 'Test', amount: 10, expenseDate: null, shiftId: 1 },
      ];

      service.getDepenses().subscribe(depenses => {
        expect(depenses[0].date).toBeTruthy();
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush(mockResponse);
    });
  });

  describe('addDepense', () => {
    it('should POST a new expense and map the response', () => {
      const newDepense = { libelle: 'Nouvelle dépense', montant: 99.99 };
      const mockResponse = { id: 3, description: 'Nouvelle dépense', amount: 99.99, expenseDate: '2026-05-24T10:00:00Z', shiftId: 1 };

      service.addDepense(newDepense).subscribe(depense => {
        expect(depense.id).toBe(3);
        expect(depense.libelle).toBe('Nouvelle dépense');
        expect(depense.montant).toBe(99.99);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ description: 'Nouvelle dépense', amount: 99.99 });
      req.flush(mockResponse);
    });
  });

  describe('updateDepense', () => {
    it('should PUT updates and map the response', () => {
      const update = { libelle: 'Mis à jour', montant: 75.00 };
      const mockResponse = { id: 1, description: 'Mis à jour', amount: 75.00, expenseDate: '2026-05-24T08:00:00Z', shiftId: 1 };

      service.updateDepense(1, update).subscribe(depense => {
        expect(depense.id).toBe(1);
        expect(depense.libelle).toBe('Mis à jour');
        expect(depense.montant).toBe(75.00);
      });

      const req = httpMock.expectOne(`${apiUrl}/1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual({ description: 'Mis à jour', amount: 75.00 });
      req.flush(mockResponse);
    });
  });

  describe('deleteDepense', () => {
    it('should DELETE the expense', () => {
      service.deleteDepense(1).subscribe(response => {
        expect(response).toBeNull();
      });

      const req = httpMock.expectOne(`${apiUrl}/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });
});
