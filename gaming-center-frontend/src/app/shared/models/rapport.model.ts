export interface RapportData {
  periode: string;
  totalVentes: number;
  totalDepenses: number;
  beneficeNet: number;
  revenusParJour: RevenuJour[];
  heuresParAppareil: HeureAppareil[];
  topProduits: TopProduit[];
  shifts: ShiftSummary[];
}

export interface RevenuJour {
  jour: string;
  sessions: number;
  buffet: number;
}

export interface HeureAppareil {
  nom: string;
  heures: number;
}

export interface TopProduit {
  rang: number;
  nom: string;
  quantite: number;
  revenus: number;
}

export interface ShiftSummary {
  date: string;
  ouverture: string;
  fermeture: string;
  sessions: number;
  buffet: number;
  depenses: number;
  benefice: number;
}

export interface Parametres {
  nomEtablissement: string;
  devise: string;
  fuseauHoraire: string;
  typesAppareils: string[];
  categoriesBuffet: string[];
}
