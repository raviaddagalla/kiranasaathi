// ==========================================
// KiranaSaathi Domain Types
// ==========================================

export type AvailabilityStatus = 'in_stock' | 'low_stock' | 'out_of_stock' | 'unconfirmed';
export type DemandEventType = 'not_listed' | 'out_of_stock' | 'unconfirmed';
export type RecommendationStatus = 'recurring_demand' | 'emerging' | 'insufficient_data' | 'dismissed';
export type UserRole = 'customer' | 'shopkeeper';

export interface Product {
  id: string;
  name: string;
  brand: string;
  variant: string;
  packageSize: string;
  category: string;
  image: string;
  description: string;
  mrp: number;
  aliases: string[];
}

export interface Store {
  id: string;
  name: string;
  address: string;
  locality: string;
  latitude: number;
  longitude: number;
  operatingHours: string;
  phone: string;
  ownerName: string;
  verified: boolean;
}

export interface InventoryEntry {
  id: string;
  storeId: string;
  productId: string;
  quantity: number;
  unit: string;
  minimumStock: number;
  listedPrice: number | null;
  availabilityStatus: AvailabilityStatus;
  updatedAt: string; // ISO timestamp
}

export interface DemandEvent {
  id: string;
  productId: string;
  localityId: string;
  eventType: DemandEventType;
  occurredAt: string; // ISO timestamp
  deduplicationKey: string;
}

export interface DemandInsight {
  productId: string;
  periodStart: string;
  periodEnd: string;
  eligibleEventCount: number;
  distinctDemandDays: number;
  firstObserved: string;
  lastObserved: string;
  recommendationStatus: RecommendationStatus;
  storeHasProduct: boolean;
}

export interface SearchResult {
  product: Product;
  stores: StoreAvailability[];
}

export interface StoreAvailability {
  store: Store;
  inventory: InventoryEntry | null;
  distance: number; // km
}

export interface VoiceCommand {
  action: 'set' | 'add' | 'reduce' | 'show';
  productQuery?: string;
  quantity?: number;
  unit?: string;
}

export interface DemandReportItem {
  product: Product;
  insight: DemandInsight;
  storeInventory: InventoryEntry | null;
}
