export interface Appareil {
  id: number;
  nom: string;
  type: string;
  tarifHoraire: number;
  statut: 'libre' | 'occupe' | 'maintenance';
  sessionStart?: Date;
}

export interface KPI {
  revenusTotaux: number;
  appareilsActifs: number;
  ventesBuffet: number;
  beneficeNet: number;
}
