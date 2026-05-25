import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { DepensesComponent } from './depenses.component';
import { DepenseService } from '../../core/services/depense.service';
import { Depense } from '../../shared/models/shift.model';

describe('DepensesComponent', () => {
  let component: DepensesComponent;
  let fixture: ComponentFixture<DepensesComponent>;
  let depenseServiceMock: {
    getDepenses: ReturnType<typeof vi.fn>;
    addDepense: ReturnType<typeof vi.fn>;
    updateDepense: ReturnType<typeof vi.fn>;
    deleteDepense: ReturnType<typeof vi.fn>;
  };

  const mockDepenses: Depense[] = [
    { id: 1, libelle: 'Électricité', montant: 150.50, date: new Date('2026-05-24T08:00:00Z'), shiftId: 1 },
    { id: 2, libelle: 'Fournitures', montant: 45.00, date: new Date('2026-05-24T09:00:00Z'), shiftId: 1 },
  ];

  beforeEach(async () => {
    depenseServiceMock = {
      getDepenses: vi.fn().mockReturnValue(of(mockDepenses)),
      addDepense: vi.fn().mockReturnValue(of({ id: 3, libelle: 'Test', montant: 10, date: new Date(), shiftId: 1 })),
      updateDepense: vi.fn().mockReturnValue(of({ id: 1, libelle: 'Modifié', montant: 99, date: new Date(), shiftId: 1 })),
      deleteDepense: vi.fn().mockReturnValue(of(void 0)),
    };

    await TestBed.configureTestingModule({
      imports: [DepensesComponent, ReactiveFormsModule],
      providers: [
        { provide: DepenseService, useValue: depenseServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DepensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load depenses on init', () => {
    expect(depenseServiceMock.getDepenses).toHaveBeenCalled();
    expect(component.depenses.length).toBe(2);
    expect(component.depenses[0].libelle).toBe('Électricité');
    expect(component.total).toBe(195.50);
  });

  it('should display depenses in the table', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const rows = compiled.querySelectorAll('tbody tr');
    expect(rows.length).toBe(2);
    expect(rows[0].textContent).toContain('Électricité');
    expect(rows[1].textContent).toContain('Fournitures');
  });

  it('should show total bar', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const totalValue = compiled.querySelector('.total-value');
    expect(totalValue?.textContent).toContain('195.50');
  });

  it('should initialize form with empty values', () => {
    expect(component.depenseForm.get('libelle')?.value).toBe('');
    expect(component.depenseForm.get('montant')?.value).toBeNull();
  });

  it('should validate form: libelle required', () => {
    const libelleControl = component.depenseForm.get('libelle');
    expect(libelleControl?.valid).toBe(false);
    libelleControl?.setValue('Test');
    expect(libelleControl?.valid).toBe(true);
  });

  it('should validate form: montant required and min 0.01', () => {
    const montantControl = component.depenseForm.get('montant');
    expect(montantControl?.valid).toBe(false);
    montantControl?.setValue(0);
    expect(montantControl?.valid).toBe(false);
    montantControl?.setValue(0.01);
    expect(montantControl?.valid).toBe(true);
  });

  it('should call addDepense on save when not editing', () => {
    component.depenseForm.setValue({ libelle: 'Nouveau', montant: 25 });
    component.saveDepense();
    expect(depenseServiceMock.addDepense).toHaveBeenCalledWith({ libelle: 'Nouveau', montant: 25 });
  });

  it('should call updateDepense on save when editing', () => {
    component.editDepense(mockDepenses[0]);
    fixture.detectChanges();
    component.depenseForm.setValue({ libelle: 'Modifié', montant: 99 });
    component.saveDepense();
    expect(depenseServiceMock.updateDepense).toHaveBeenCalledWith(1, { libelle: 'Modifié', montant: 99 });
  });

  it('should cancel edit and reset form', () => {
    component.editDepense(mockDepenses[0]);
    expect(component.editingDepense).toBeTruthy();
    component.cancelEdit();
    expect(component.editingDepense).toBeNull();
    expect(component.depenseForm.get('libelle')?.value).toBe('');
  });

  it('should call deleteDepense', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    component.deleteDepense(1);
    expect(depenseServiceMock.deleteDepense).toHaveBeenCalledWith(1);
  });

  it('should not call deleteDepense if cancelled', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    component.deleteDepense(1);
    expect(depenseServiceMock.deleteDepense).not.toHaveBeenCalled();
  });

  it('should show edit button for each depense', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const editButtons = compiled.querySelectorAll('.edit-btn');
    expect(editButtons.length).toBe(2);
  });

  it('should show delete button for each depense', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const deleteButtons = compiled.querySelectorAll('.delete-btn');
    expect(deleteButtons.length).toBe(2);
  });
});
