export interface Product {
  id: string;
  name: string;
  quantity: number;
  expiryDate?: string;
  imageUrl?: string;
  category?: string;
  price?: number;
  minStock?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Retailer {
  id: string;
  name: string;
  panNumber: string;
  shopName: string;
  email: string;
  phone?: string;
  address?: string;
  createdAt: Date;
}

export interface StockStatus {
  status: 'healthy' | 'low' | 'out';
  color: string;
  label: string;
}

export interface DemandData {
  product: string;
  demand: number;
  supply: number;
  trend: 'up' | 'down' | 'stable';
  date: Date;
}

export interface Recommendation {
  id: string;
  type: 'stock-up' | 'reduce' | 'seasonal';
  product: string;
  message: string;
  festival?: string;
  urgency: 'high' | 'medium' | 'low';
  icon: string;
}