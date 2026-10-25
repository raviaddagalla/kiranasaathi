// ==========================================
// IndexedDB Persistence Layer for KiranaSaathi
// ==========================================
import { openDB } from 'idb';
import type { DBSchema, IDBPDatabase } from 'idb';
import type { Product, Store, InventoryEntry, DemandEvent, DemandEventType } from '../types';
import { SEED_PRODUCTS, SEED_STORES, SEED_INVENTORY, SEED_DEMAND_EVENTS } from '../data/seedData';

interface KiranaSaathiDB extends DBSchema {
  products: { key: string; value: Product; indexes: { 'by-category': string; 'by-brand': string } };
  stores: { key: string; value: Store; indexes: { 'by-locality': string } };
  inventory: { key: string; value: InventoryEntry; indexes: { 'by-store': string; 'by-product': string; 'by-store-product': string } };
  demandEvents: { key: string; value: DemandEvent; indexes: { 'by-product': string; 'by-locality': string; 'by-dedup': string } };
  appState: { key: string; value: { key: string; value: string } };
}

const DB_NAME = 'kiranasaathi-db';
const DB_VERSION = 1;

let dbInstance: IDBPDatabase<KiranaSaathiDB> | null = null;

export async function getDB(): Promise<IDBPDatabase<KiranaSaathiDB>> {
  if (dbInstance) return dbInstance;

  dbInstance = await openDB<KiranaSaathiDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Products store
      const productStore = db.createObjectStore('products', { keyPath: 'id' });
      productStore.createIndex('by-category', 'category');
      productStore.createIndex('by-brand', 'brand');

      // Stores store
      const storeStore = db.createObjectStore('stores', { keyPath: 'id' });
      storeStore.createIndex('by-locality', 'locality');

      // Inventory store
      const inventoryStore = db.createObjectStore('inventory', { keyPath: 'id' });
      inventoryStore.createIndex('by-store', 'storeId');
      inventoryStore.createIndex('by-product', 'productId');
      inventoryStore.createIndex('by-store-product', ['storeId', 'productId'] as unknown as string);

      // Demand events store
      const demandStore = db.createObjectStore('demandEvents', { keyPath: 'id' });
      demandStore.createIndex('by-product', 'productId');
      demandStore.createIndex('by-locality', 'localityId');
      demandStore.createIndex('by-dedup', 'deduplicationKey');

      // App state (key-value)
      db.createObjectStore('appState', { keyPath: 'key' });
    },
  });

  return dbInstance;
}

// Check if database has been seeded
export async function isDatabaseSeeded(): Promise<boolean> {
  const db = await getDB();
  const state = await db.get('appState', 'seeded');
  return !!state;
}

// Seed the database with demo data
export async function seedDatabase(): Promise<void> {
  const db = await getDB();
  const alreadySeeded = await isDatabaseSeeded();
  if (alreadySeeded) return;

  const tx = db.transaction(['products', 'stores', 'inventory', 'demandEvents', 'appState'], 'readwrite');

  for (const product of SEED_PRODUCTS) {
    await tx.objectStore('products').put(product);
  }
  for (const store of SEED_STORES) {
    await tx.objectStore('stores').put(store);
  }
  for (const inv of SEED_INVENTORY) {
    await tx.objectStore('inventory').put(inv);
  }
  for (const event of SEED_DEMAND_EVENTS) {
    await tx.objectStore('demandEvents').put(event);
  }

  await tx.objectStore('appState').put({ key: 'seeded', value: new Date().toISOString() });
  await tx.done;
}

// Reset database to initial seed state
export async function resetDatabase(): Promise<void> {
  const db = await getDB();

  // Clear all stores
  const tx = db.transaction(['products', 'stores', 'inventory', 'demandEvents', 'appState'], 'readwrite');
  await tx.objectStore('products').clear();
  await tx.objectStore('stores').clear();
  await tx.objectStore('inventory').clear();
  await tx.objectStore('demandEvents').clear();
  await tx.objectStore('appState').clear();
  await tx.done;

  // Re-seed
  await seedDatabase();
}

// ==========================================
// Product Repository
// ==========================================
export async function getAllProducts(): Promise<Product[]> {
  const db = await getDB();
  return db.getAll('products');
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const db = await getDB();
  return db.get('products', id);
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  const db = await getDB();
  return db.getAllFromIndex('products', 'by-category', category);
}

export async function searchProducts(query: string): Promise<Product[]> {
  const normalized = query.toLowerCase().trim();
  if (!normalized) return [];

  const allProducts = await getAllProducts();
  const terms = normalized.split(/\s+/);

  return allProducts.filter((product) => {
    const searchableText = [
      product.name,
      product.brand,
      product.variant,
      product.packageSize,
      product.category,
      product.description,
      ...product.aliases,
    ].join(' ').toLowerCase();

    return terms.every((term) => searchableText.includes(term));
  }).sort((a, b) => {
    // Exact name match first
    const aExact = a.name.toLowerCase().includes(normalized) ? 0 : 1;
    const bExact = b.name.toLowerCase().includes(normalized) ? 0 : 1;
    if (aExact !== bExact) return aExact - bExact;

    // Brand match
    const aBrand = a.brand.toLowerCase().includes(normalized) ? 0 : 1;
    const bBrand = b.brand.toLowerCase().includes(normalized) ? 0 : 1;
    return aBrand - bBrand;
  });
}

export async function addProduct(product: Product): Promise<void> {
  const db = await getDB();
  await db.put('products', product);
}

// ==========================================
// Store Repository
// ==========================================
export async function getAllStores(): Promise<Store[]> {
  const db = await getDB();
  return db.getAll('stores');
}

export async function getStoreById(id: string): Promise<Store | undefined> {
  const db = await getDB();
  return db.get('stores', id);
}

// ==========================================
// Inventory Repository
// ==========================================
export async function getInventoryByStore(storeId: string): Promise<InventoryEntry[]> {
  const db = await getDB();
  return db.getAllFromIndex('inventory', 'by-store', storeId);
}

export async function getInventoryByProduct(productId: string): Promise<InventoryEntry[]> {
  const db = await getDB();
  return db.getAllFromIndex('inventory', 'by-product', productId);
}

export async function getInventoryEntry(id: string): Promise<InventoryEntry | undefined> {
  const db = await getDB();
  return db.get('inventory', id);
}

export async function findInventoryByStoreAndProduct(storeId: string, productId: string): Promise<InventoryEntry | undefined> {
  const allForStore = await getInventoryByStore(storeId);
  return allForStore.find(inv => inv.productId === productId);
}

export async function updateInventoryEntry(entry: InventoryEntry): Promise<void> {
  const db = await getDB();
  // Auto-calculate availability status
  if (entry.quantity <= 0) {
    entry.availabilityStatus = 'out_of_stock';
    entry.quantity = 0;
  } else if (entry.quantity <= entry.minimumStock) {
    entry.availabilityStatus = 'low_stock';
  } else {
    entry.availabilityStatus = 'in_stock';
  }
  entry.updatedAt = new Date().toISOString();
  await db.put('inventory', entry);
}

export async function addInventoryEntry(entry: InventoryEntry): Promise<void> {
  const db = await getDB();
  entry.updatedAt = new Date().toISOString();
  if (entry.quantity <= 0) {
    entry.availabilityStatus = 'out_of_stock';
  } else if (entry.quantity <= entry.minimumStock) {
    entry.availabilityStatus = 'low_stock';
  } else {
    entry.availabilityStatus = 'in_stock';
  }
  await db.put('inventory', entry);
}

export async function getLowStockItems(storeId: string): Promise<InventoryEntry[]> {
  const inventory = await getInventoryByStore(storeId);
  return inventory.filter(
    (entry) => entry.availabilityStatus === 'low_stock' || entry.availabilityStatus === 'out_of_stock'
  );
}

// ==========================================
// Demand Event Repository
// ==========================================
export async function getAllDemandEvents(): Promise<DemandEvent[]> {
  const db = await getDB();
  return db.getAll('demandEvents');
}

export async function getDemandEventsByProduct(productId: string): Promise<DemandEvent[]> {
  const db = await getDB();
  return db.getAllFromIndex('demandEvents', 'by-product', productId);
}

export async function addDemandEvent(event: DemandEvent): Promise<void> {
  const db = await getDB();
  // Check for deduplication
  const existing = await db.getFromIndex('demandEvents', 'by-dedup', event.deduplicationKey);
  if (existing) {
    // Duplicate within dedup window, skip
    return;
  }
  await db.put('demandEvents', event);
}

export async function getDemandEventsInPeriod(startDate: Date, endDate: Date): Promise<DemandEvent[]> {
  const allEvents = await getAllDemandEvents();
  return allEvents.filter((event) => {
    const eventDate = new Date(event.occurredAt);
    return eventDate >= startDate && eventDate <= endDate;
  });
}

// App state helpers
export async function getAppState(key: string): Promise<string | undefined> {
  const db = await getDB();
  const state = await db.get('appState', key);
  return state?.value;
}

export async function setAppState(key: string, value: string): Promise<void> {
  const db = await getDB();
  await db.put('appState', { key, value });
}

// Aliases and convenience methods
export const initDatabase = seedDatabase;
export const resetDemoData = resetDatabase;
export const saveInventoryEntry = addInventoryEntry;

export async function updateInventoryQuantity(id: string, quantity: number, minimumStock: number): Promise<void> {
  const entry = await getInventoryEntry(id);
  if (!entry) return;
  entry.quantity = quantity;
  entry.minimumStock = minimumStock;
  await updateInventoryEntry(entry);
}

export async function recordDemandEvent(params: {
  productId: string;
  localityId: string;
  eventType: DemandEventType;
}): Promise<void> {
  const today = new Date().toISOString().split('T')[0];
  const dedupKey = `${params.productId}-${params.localityId}-${today}`;
  const event: DemandEvent = {
    id: `ev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    productId: params.productId,
    localityId: params.localityId,
    eventType: params.eventType,
    occurredAt: new Date().toISOString(),
    deduplicationKey: dedupKey,
  };
  await addDemandEvent(event);
}
