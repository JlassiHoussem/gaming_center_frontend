export interface Produit {
  id: number;
  name: string;
  category: string;
  price: number;
  imageUrl?: string;
  active: boolean;
}

export interface OrderItem {
  produit: Produit;
  quantity: number;
}
