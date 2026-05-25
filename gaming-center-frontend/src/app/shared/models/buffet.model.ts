export interface Produit {
  id: number;
  nom: string;
  categorie: string;
  prix: number;
  imageUrl?: string;
  actif: boolean;
}

export interface PanierItem {
  produit: Produit;
  quantite: number;
}

export interface Commande {
  id: number;
  items: PanierItem[];
  total: number;
  date: Date;
}
