import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { of, Observable } from 'rxjs';
import { BuffetComponent } from './buffet.component';
import { BuffetService } from '../../core/services/buffet.service';
import { Produit, PanierItem } from '../../shared/models/buffet.model';

describe('BuffetComponent', () => {
  let component: BuffetComponent;
  let fixture: ComponentFixture<BuffetComponent>;
  let buffetServiceMock: {
    getProduits: ReturnType<typeof vi.fn>;
    getAllProduits: ReturnType<typeof vi.fn>;
    addToPanier: ReturnType<typeof vi.fn>;
    removeFromPanier: ReturnType<typeof vi.fn>;
    getPanierTotal: ReturnType<typeof vi.fn>;
    encaisser: ReturnType<typeof vi.fn>;
    addProduit: ReturnType<typeof vi.fn>;
    updateProduit: ReturnType<typeof vi.fn>;
    deleteProduit: ReturnType<typeof vi.fn>;
    panier$: Observable<PanierItem[]>;
  };

  const mockProduits: Produit[] = [
    { id: 1, nom: 'Coca', categorie: 'Boissons', prix: 3.50, actif: true },
    { id: 2, nom: 'Chips', categorie: 'Snacks', prix: 2.00, actif: true },
    { id: 3, nom: 'Fanta', categorie: 'Boissons', prix: 3.50, actif: true },
  ];

  const mockAllProduits: Produit[] = [
    ...mockProduits,
    { id: 4, nom: 'Burger', categorie: 'Repas', prix: 8.00, actif: true },
  ];

  beforeEach(async () => {
    buffetServiceMock = {
      getProduits: vi.fn().mockReturnValue(of(mockProduits)),
      getAllProduits: vi.fn().mockReturnValue(of(mockAllProduits)),
      addToPanier: vi.fn(),
      removeFromPanier: vi.fn(),
      getPanierTotal: vi.fn().mockReturnValue(0),
      encaisser: vi.fn().mockReturnValue(of({ id: 1, items: [], total: 0, date: new Date() })),
      addProduit: vi.fn().mockReturnValue(of({ id: 5, nom: 'Nouveau', categorie: 'Snacks', prix: 4, actif: true })),
      updateProduit: vi.fn().mockReturnValue(of({ id: 1, nom: 'Modifié', categorie: 'Boissons', prix: 4, actif: true })),
      deleteProduit: vi.fn().mockReturnValue(of(void 0)),
      panier$: of<PanierItem[]>([]),
    };

    await TestBed.configureTestingModule({
      imports: [BuffetComponent, FormsModule],
      providers: [
        { provide: BuffetService, useValue: buffetServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BuffetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load produits on init', () => {
    expect(buffetServiceMock.getProduits).toHaveBeenCalled();
    expect(buffetServiceMock.getAllProduits).toHaveBeenCalled();
    expect(component.produits.length).toBe(3);
    expect(component.allProduits.length).toBe(4);
  });

  it('should extract categories from produits', () => {
    expect(component.categories).toContain('Boissons');
    expect(component.categories).toContain('Snacks');
    expect(component.categories.length).toBe(2);
  });

  it('should filter produits by category', () => {
    component.categorieFilter = 'Boissons';
    fixture.detectChanges();
    expect(component.filteredProduits.length).toBe(2);
    expect(component.filteredProduits.every(p => p.categorie === 'Boissons')).toBe(true);
  });

  it('should show all produits when filter is "all"', () => {
    component.categorieFilter = 'all';
    expect(component.filteredProduits.length).toBe(3);
  });

  it('should display product cards', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const cards = compiled.querySelectorAll('.produit-card');
    expect(cards.length).toBe(3);
    expect(cards[0].textContent).toContain('Coca');
    expect(cards[0].textContent).toContain('3.50');
  });

  it('should show categories as filter buttons', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const filterButtons = compiled.querySelectorAll('.filter-btn');
    expect(filterButtons.length).toBe(3);
    expect(filterButtons[1].textContent).toContain('Boissons');
    expect(filterButtons[2].textContent).toContain('Snacks');
  });

  it('should return emoji for known categories', () => {
    expect(component.getEmoji('Boissons')).toBe('🥤');
    expect(component.getEmoji('Snacks')).toBe('🍿');
    expect(component.getEmoji('Repas')).toBe('🍔');
    expect(component.getEmoji('Unknown')).toBe('🍴');
  });

  it('should call addToPanier when product card is clicked', () => {
    component.addToPanier(mockProduits[0]);
    expect(buffetServiceMock.addToPanier).toHaveBeenCalledWith(mockProduits[0]);
  });

  it('should call removeFromPanier', () => {
    component.removeFromPanier(1);
    expect(buffetServiceMock.removeFromPanier).toHaveBeenCalledWith(1);
  });

  it('should call encaisser and show modal', () => {
    component.encaisser();
    expect(buffetServiceMock.encaisser).toHaveBeenCalled();
    expect(component.showEncaissementModal).toBe(true);
  });

  it('should close encaissement modal', () => {
    component.showEncaissementModal = true;
    component.closeEncaissementModal();
    expect(component.showEncaissementModal).toBe(false);
  });

  it('should open catalog modal', () => {
    component.openCatalogModal();
    expect(component.showCatalogModal).toBe(true);
    expect(component.editingProduit).toBeNull();
    expect(component.productForm).toEqual({ nom: '', categorie: '', prix: 0 });
  });

  it('should close catalog modal', () => {
    component.showCatalogModal = true;
    component.editingProduit = mockProduits[0];
    component.closeCatalogModal();
    expect(component.showCatalogModal).toBe(false);
    expect(component.editingProduit).toBeNull();
  });

  it('should populate productForm on edit', () => {
    component.editProduit(mockProduits[0]);
    expect(component.editingProduit).toEqual(mockProduits[0]);
    expect(component.productForm).toEqual({ nom: 'Coca', categorie: 'Boissons', prix: 3.50 });
  });

  it('should call addProduit on save when not editing', () => {
    component.productForm = { nom: 'Nouveau', categorie: 'Snacks', prix: 4.00 };
    component.saveProduit();
    expect(buffetServiceMock.addProduit).toHaveBeenCalledWith({ name: 'Nouveau', category: 'Snacks', price: 4.00 });
  });

  it('should call updateProduit on save when editing', () => {
    component.editingProduit = mockProduits[0];
    component.productForm = { nom: 'Modifié', categorie: 'Boissons', prix: 4.00 };
    component.saveProduit();
    expect(buffetServiceMock.updateProduit).toHaveBeenCalledWith(1, { name: 'Modifié', category: 'Boissons', price: 4.00 });
  });

  it('should call deleteProduit when confirmed', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    component.deleteProduit(mockProduits[0]);
    expect(buffetServiceMock.deleteProduit).toHaveBeenCalledWith(1);
  });

  it('should not call deleteProduit if cancelled', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    component.deleteProduit(mockProduits[0]);
    expect(buffetServiceMock.deleteProduit).not.toHaveBeenCalled();
  });
});
