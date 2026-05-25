export interface Depense {
  id: number;
  libelle: string;
  montant: number;
  date: Date;
  shiftId?: number;
}

export interface Shift {
  id: number;
  dateOuverture: Date;
  dateFermeture?: Date;
  revenusSessions: number;
  revenusBuffet: number;
  totalDepenses: number;
  benefice: number;
  actif: boolean;
}
