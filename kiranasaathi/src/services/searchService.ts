// ==========================================
// Search Service
// ==========================================
import type { Product, InventoryEntry, StoreAvailability } from '../types';
import { searchProducts, getAllStores, getInventoryByProduct } from './database';

// Customer reference location (Banjara Hills demo)
const CUSTOMER_LOCATION = { latitude: 17.4156, longitude: 78.4340 };

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10; // Round to 1 decimal
}

export async function searchForProduct(query: string): Promise<Product[]> {
  return searchProducts(query);
}

export async function findStoresWithProduct(productId: string): Promise<StoreAvailability[]> {
  const stores = await getAllStores();
  const inventoryEntries = await getInventoryByProduct(productId);

  const results: StoreAvailability[] = [];

  for (const store of stores) {
    const inventory = inventoryEntries.find((inv) => inv.storeId === store.id) || null;
    if (!inventory) continue; // Only show stores that have/had the product

    const distance = haversineDistance(
      CUSTOMER_LOCATION.latitude,
      CUSTOMER_LOCATION.longitude,
      store.latitude,
      store.longitude
    );

    results.push({ store, inventory, distance });
  }

  // Sort by distance by default
  results.sort((a, b) => a.distance - b.distance);

  return results;
}

export function getStockFreshnessLabel(updatedAt: string): { label: string; isStale: boolean } {
  const now = new Date();
  const updated = new Date(updatedAt);
  const diffMs = now.getTime() - updated.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return { label: 'Updated just now', isStale: false };
  if (diffMins < 60) return { label: `Updated ${diffMins}m ago`, isStale: false };
  if (diffHours < 24) return { label: `Updated ${diffHours}h ago`, isStale: diffHours > 6 };
  if (diffDays === 1) return { label: 'Last reported yesterday', isStale: true };
  return { label: `Last reported ${diffDays} days ago`, isStale: true };
}

export function getAvailabilityDisplay(inventory: InventoryEntry | null): {
  label: string;
  colorClass: string;
  bgClass: string;
  dotClass: string;
  animate: boolean;
} {
  if (!inventory) {
    return {
      label: 'Not Listed',
      colorClass: 'text-on-surface-variant',
      bgClass: 'bg-surface-container-high',
      dotClass: 'bg-outline',
      animate: false,
    };
  }

  switch (inventory.availabilityStatus) {
    case 'in_stock':
      return {
        label: `In Stock (${inventory.quantity} ${inventory.unit}${inventory.quantity !== 1 ? 's' : ''} left)`,
        colorClass: 'text-on-primary-fixed-variant',
        bgClass: 'bg-primary-fixed',
        dotClass: 'bg-primary',
        animate: true,
      };
    case 'low_stock':
      return {
        label: `Low Stock (Only ${inventory.quantity} left)`,
        colorClass: 'text-on-secondary-fixed-variant',
        bgClass: 'bg-secondary-fixed',
        dotClass: 'bg-secondary',
        animate: false,
      };
    case 'out_of_stock':
      return {
        label: 'Out of Stock',
        colorClass: 'text-on-error-container',
        bgClass: 'bg-error-container',
        dotClass: 'bg-error',
        animate: false,
      };
    case 'unconfirmed':
      return {
        label: 'Availability Unconfirmed',
        colorClass: 'text-on-surface-variant',
        bgClass: 'bg-surface-container-high',
        dotClass: 'bg-outline',
        animate: false,
      };
  }
}

export function getCategoryProductCount(category: string): number {
  // Simplified for demo
  const counts: Record<string, number> = {
    'Milk & Dairy': 9,
    'Bread & Bakery': 6,
    'Snacks & Biscuits': 12,
    'Rice & Flour': 8,
    'Cooking Essentials': 15,
    'Spices & Masala': 7,
    'Beverages': 11,
    'Personal Care': 5,
    'Household': 4,
  };
  return counts[category] || 0;
}

export const findStoresCarryingProduct = findStoresWithProduct;

export function getFreshnessLabel(updatedAt: string): string {
  return getStockFreshnessLabel(updatedAt).label;
}

export function getAvailabilityBadgeStyle(status: string): {
  bgClass: string;
  textClass: string;
  dotClass: string;
  animate: boolean;
} {
  switch (status) {
    case 'in_stock':
      return {
        bgClass: 'bg-primary-fixed',
        textClass: 'text-on-primary-fixed-variant',
        dotClass: 'bg-primary',
        animate: true,
      };
    case 'low_stock':
      return {
        bgClass: 'bg-secondary-fixed',
        textClass: 'text-on-secondary-fixed-variant',
        dotClass: 'bg-secondary',
        animate: false,
      };
    case 'out_of_stock':
      return {
        bgClass: 'bg-error-container',
        textClass: 'text-on-error-container',
        dotClass: 'bg-error',
        animate: false,
      };
    default:
      return {
        bgClass: 'bg-surface-container-high',
        textClass: 'text-on-surface-variant',
        dotClass: 'bg-outline',
        animate: false,
      };
  }
}
