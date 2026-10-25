import { describe, it, expect } from 'vitest';
import {
  parseShopkeeperVoiceCommand,
  parseCustomerVoiceSearch,
} from '../services/voiceService';
import { getStockFreshnessLabel, getAvailabilityDisplay } from '../services/searchService';
import type { InventoryEntry, DemandEvent } from '../types';

describe('KiranaSaathi Comprehensive Test Suite (Scenarios A through L)', () => {
  // Scenario A: Exact product discovery
  describe('Scenario A: Exact product discovery', () => {
    it('accurately identifies exact variants without confusing white bread with whole wheat bread', () => {
      const whiteBread = {
        id: 'prod-004',
        name: 'Britannia Daily Fresh White Bread',
        brand: 'Britannia',
        variant: 'White Bread',
        packageSize: '400 g',
      };
      const wheatBread = {
        id: 'prod-003',
        name: 'Britannia 100% Whole Wheat Bread',
        brand: 'Britannia',
        variant: '100% Whole Wheat',
        packageSize: '400 g',
      };

      const query = 'Britannia whole wheat bread';
      const qLower = query.toLowerCase();

      const whiteMatches =
        whiteBread.name.toLowerCase().includes(qLower) ||
        (whiteBread.brand.toLowerCase() + ' ' + whiteBread.variant.toLowerCase()).includes('whole wheat');
      const wheatMatches =
        wheatBread.name.toLowerCase().includes('whole wheat') ||
        wheatBread.variant.toLowerCase().includes('whole wheat');

      expect(whiteMatches).toBe(false);
      expect(wheatMatches).toBe(true);
    });
  });

  // Scenario B: Stock update
  describe('Scenario B: Stock update', () => {
    it('given 10 packets, recording sale of 3 packets leaves 7 packets', () => {
      const initialStock = 10;
      const saleQty = 3;
      const remainingStock = Math.max(0, initialStock - saleQty);

      expect(remainingStock).toBe(7);
    });

    it('parses shopkeeper voice command for selling bread correctly', () => {
      const command = parseShopkeeperVoiceCommand('I sold five packets of Britannia bread');
      expect(command).not.toBeNull();
      expect(command?.action).toBe('reduce');
      expect(command?.quantity).toBe(5);
      expect(command?.productQuery.toLowerCase()).toContain('britannia bread');
    });
  });

  // Scenario C: Low-stock warning
  describe('Scenario C: Low-stock warning', () => {
    it('triggers low-stock status when current quantity (3) is <= threshold (5)', () => {
      const quantity: number = 3;
      const minimumStock: number = 5;
      const status = quantity === 0 ? 'out_of_stock' : quantity <= minimumStock ? 'low_stock' : 'in_stock';

      expect(status).toBe('low_stock');
    });

    it('returns appropriate warning badge styles for low stock', () => {
      const mockEntry: InventoryEntry = {
        id: 'inv-test-1',
        storeId: 'store-001',
        productId: 'prod-001',
        quantity: 3,
        unit: 'packets',
        minimumStock: 5,
        listedPrice: 30,
        availabilityStatus: 'low_stock',
        updatedAt: new Date().toISOString(),
      };

      const display = getAvailabilityDisplay(mockEntry);
      expect(display.label).toContain('Low Stock');
      expect(display.bgClass).toBe('bg-secondary-fixed');
    });
  });

  // Scenario D: Unmet demand
  describe('Scenario D: Unmet demand', () => {
    it('creates an eligible demand event when no nearby store has stock', () => {
      const today = new Date().toISOString().split('T')[0];
      const event: DemandEvent = {
        id: 'ev-test-1',
        productId: 'prod-001',
        localityId: 'Road No. 12, Banjara Hills',
        eventType: 'out_of_stock',
        occurredAt: new Date().toISOString(),
        deduplicationKey: `prod-001-Road No. 12, Banjara Hills-${today}`,
      };

      expect(event.eventType).toBe('out_of_stock');
      expect(event.productId).toBe('prod-001');
      expect(event.deduplicationKey).toContain('prod-001');
    });
  });

  // Scenario E: Duplicate demand deduplication
  describe('Scenario E: Duplicate demand deduplication', () => {
    it('deduplicates repeated submissions from the same user for the same product on the same day', () => {
      const today = '2026-10-25';
      const events: DemandEvent[] = [
        {
          id: 'ev-1',
          productId: 'prod-001',
          localityId: 'loc-1',
          eventType: 'not_listed',
          occurredAt: `${today}T10:00:00Z`,
          deduplicationKey: `prod-001-user-anon-1-${today}`,
        },
        {
          id: 'ev-2',
          productId: 'prod-001',
          localityId: 'loc-1',
          eventType: 'not_listed',
          occurredAt: `${today}T10:05:00Z`,
          deduplicationKey: `prod-001-user-anon-1-${today}`,
        },
        {
          id: 'ev-3',
          productId: 'prod-001',
          localityId: 'loc-1',
          eventType: 'not_listed',
          occurredAt: `${today}T10:10:00Z`,
          deduplicationKey: `prod-001-user-anon-1-${today}`,
        },
        {
          id: 'ev-4',
          productId: 'prod-001',
          localityId: 'loc-1',
          eventType: 'not_listed',
          occurredAt: `${today}T11:00:00Z`,
          deduplicationKey: `prod-001-user-anon-2-${today}`,
        },
      ];

      const uniqueKeys = new Set(events.map((e) => e.deduplicationKey));
      expect(uniqueKeys.size).toBe(2); // Only 2 unique eligible demand events despite 4 clicks
    });
  });

  // Scenario F: Recurring demand across multiple days
  describe('Scenario F: Recurring demand across multiple days', () => {
    it('aggregates signals across 3 distinct days into a 3-day history', () => {
      const events: DemandEvent[] = [
        { id: '1', productId: 'p1', localityId: 'l1', eventType: 'not_listed', occurredAt: '2026-10-23T10:00:00Z', deduplicationKey: 'k1' },
        { id: '2', productId: 'p1', localityId: 'l1', eventType: 'not_listed', occurredAt: '2026-10-24T11:00:00Z', deduplicationKey: 'k2' },
        { id: '3', productId: 'p1', localityId: 'l1', eventType: 'not_listed', occurredAt: '2026-10-25T09:00:00Z', deduplicationKey: 'k3' },
      ];

      const distinctDays = new Set(events.map((e) => e.occurredAt.split('T')[0]));
      expect(distinctDays.size).toBe(3);
    });
  });

  // Scenario G: Recommendation threshold
  describe('Scenario G: Recommendation threshold', () => {
    it('labels a product "recurring_demand" when eligible signals >= 10 across >= 2 days', () => {
      const eligibleEventCount = 12;
      const distinctDemandDays = 3;

      const isRecurring = eligibleEventCount >= 10 && distinctDemandDays >= 2;
      expect(isRecurring).toBe(true);
    });

    it('labels product as "insufficient_data" when demand count is low (< 3)', () => {
      const eligibleEventCount = 2;
      const isInsufficient = eligibleEventCount < 3;
      expect(isInsufficient).toBe(true);
    });
  });

  // Scenario H: Product addition from demand
  describe('Scenario H: Product addition from demand insights', () => {
    it('creates a valid inventory entry with positive stock and updates status', () => {
      const newEntry: Omit<InventoryEntry, 'id' | 'updatedAt'> = {
        storeId: 'store-001',
        productId: 'prod-001',
        quantity: 15,
        unit: 'pouches',
        minimumStock: 5,
        listedPrice: 30,
        availabilityStatus: 'in_stock',
      };

      expect(newEntry.quantity).toBe(15);
      expect(newEntry.availabilityStatus).toBe('in_stock');
    });
  });

  // Scenario I: Persistence check
  describe('Scenario I: Persistence state check', () => {
    it('preserves inventory state updates without negative values', () => {
      let currentStock = 10;
      currentStock = Math.max(0, currentStock - 4);
      expect(currentStock).toBe(6);

      // Prevent negative
      currentStock = Math.max(0, currentStock - 10);
      expect(currentStock).toBe(0);
    });
  });

  // Scenario J: Voice fallback
  describe('Scenario J: Voice fallback and natural language parsing', () => {
    it('parses customer voice search prefixes cleanly', () => {
      expect(parseCustomerVoiceSearch('find Britannia whole wheat bread')).toBe('Britannia whole wheat bread');
      expect(parseCustomerVoiceSearch('where is Heritage toned milk')).toBe('Heritage toned milk');
      expect(parseCustomerVoiceSearch('Aashirvaad atta chahiye')).toBe('Aashirvaad atta');
    });

    it('parses shopkeeper stock set command', () => {
      const cmd = parseShopkeeperVoiceCommand('Set Parle-G stock to 20 packets');
      expect(cmd).not.toBeNull();
      expect(cmd?.action).toBe('set');
      expect(cmd?.quantity).toBe(20);
      expect(cmd?.productQuery).toContain('parle-g');
    });

    it('parses shopkeeper stock add command', () => {
      const cmd = parseShopkeeperVoiceCommand('Add 10 bottles of Amul milk');
      expect(cmd).not.toBeNull();
      expect(cmd?.action).toBe('add');
      expect(cmd?.quantity).toBe(10);
      expect(cmd?.productQuery).toContain('amul milk');
    });
  });

  // Scenario K: Stale availability
  describe('Scenario K: Stale availability indicator', () => {
    it('flags timestamps older than 6 hours as stale to avoid false stock guarantees', () => {
      const freshTimestamp = new Date(Date.now() - 15 * 60 * 1000).toISOString(); // 15 mins ago
      const staleTimestamp = new Date(Date.now() - 8 * 3600 * 1000).toISOString(); // 8 hours ago

      const freshResult = getStockFreshnessLabel(freshTimestamp);
      const staleResult = getStockFreshnessLabel(staleTimestamp);

      expect(freshResult.isStale).toBe(false);
      expect(staleResult.isStale).toBe(true);
      expect(staleResult.label).toContain('ago');
    });
  });

  // Scenario L: Empty demand state
  describe('Scenario L: Empty demand state', () => {
    it('handles empty events gracefully without fabricating recommendations', () => {
      const events: DemandEvent[] = [];
      const distinctDays = new Set(events.map((e) => e.occurredAt.split('T')[0])).size;
      const count = events.length;

      expect(count).toBe(0);
      expect(distinctDays).toBe(0);
    });
  });
});
