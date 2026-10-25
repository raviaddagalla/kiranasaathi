// ==========================================
// Demand Aggregation Service
// ==========================================
import type { DemandEvent, DemandInsight, Product, RecommendationStatus } from '../types';
import { getAllDemandEvents, getInventoryByStore } from './database';

const RECURRING_DEMAND_MIN_EVENTS = 10;
const RECURRING_DEMAND_MIN_DAYS = 2;

export interface DemandAggregationResult {
  insights: DemandInsight[];
  totalUnmetRequests: number;
  emergingSKUs: number;
  persistentShortages: number;
}

function getDateKey(dateStr: string): string {
  return new Date(dateStr).toISOString().split('T')[0];
}

export async function aggregateDemand(
  storeId: string,
  periodStart: Date,
  periodEnd: Date
): Promise<DemandAggregationResult> {
  const allEvents = await getAllDemandEvents();
  const storeInventory = await getInventoryByStore(storeId);

  // Filter events within the period
  const periodEvents = allEvents.filter((event) => {
    const eventDate = new Date(event.occurredAt);
    return eventDate >= periodStart && eventDate <= periodEnd;
  });

  // Group events by product
  const eventsByProduct = new Map<string, DemandEvent[]>();
  for (const event of periodEvents) {
    const existing = eventsByProduct.get(event.productId) || [];
    existing.push(event);
    eventsByProduct.set(event.productId, existing);
  }

  const insights: DemandInsight[] = [];
  let totalUnmetRequests = 0;
  let emergingSKUs = 0;
  let persistentShortages = 0;

  for (const [productId, events] of eventsByProduct) {
    // Deduplicate events
    const uniqueKeys = new Set(events.map((e) => e.deduplicationKey));
    const eligibleEventCount = uniqueKeys.size;
    totalUnmetRequests += eligibleEventCount;

    // Count distinct days
    const distinctDays = new Set(events.map((e) => getDateKey(e.occurredAt)));
    const distinctDemandDays = distinctDays.size;

    // Sort events by time
    const sortedEvents = [...events].sort(
      (a, b) => new Date(a.occurredAt).getTime() - new Date(b.occurredAt).getTime()
    );

    // Check if store has this product
    const storeHasProduct = storeInventory.some(
      (inv) => inv.productId === productId && inv.availabilityStatus !== 'out_of_stock'
    );

    // Determine recommendation status
    let recommendationStatus: RecommendationStatus;
    if (eligibleEventCount >= RECURRING_DEMAND_MIN_EVENTS && distinctDemandDays >= RECURRING_DEMAND_MIN_DAYS) {
      recommendationStatus = 'recurring_demand';
      persistentShortages++;
    } else if (eligibleEventCount >= 3) {
      recommendationStatus = 'emerging';
      emergingSKUs++;
    } else {
      recommendationStatus = 'insufficient_data';
    }

    insights.push({
      productId,
      periodStart: periodStart.toISOString(),
      periodEnd: periodEnd.toISOString(),
      eligibleEventCount,
      distinctDemandDays,
      firstObserved: sortedEvents[0].occurredAt,
      lastObserved: sortedEvents[sortedEvents.length - 1].occurredAt,
      recommendationStatus,
      storeHasProduct,
    });
  }

  // Sort: recurring_demand first, then emerging, then by event count
  insights.sort((a, b) => {
    const statusOrder: Record<RecommendationStatus, number> = {
      recurring_demand: 0,
      emerging: 1,
      insufficient_data: 2,
      dismissed: 3,
    };
    const orderDiff = statusOrder[a.recommendationStatus] - statusOrder[b.recommendationStatus];
    if (orderDiff !== 0) return orderDiff;
    return b.eligibleEventCount - a.eligibleEventCount;
  });

  return {
    insights,
    totalUnmetRequests,
    emergingSKUs,
    persistentShortages,
  };
}

export function getRecommendationExplanation(insight: DemandInsight, product: Product | undefined): string {
  if (!product) return 'Product data unavailable.';

  switch (insight.recommendationStatus) {
    case 'recurring_demand':
      return `Customers searched for ${product.name} (${product.packageSize}) on ${insight.distinctDemandDays} separate days. ${insight.eligibleEventCount} total demand signals recorded. ${insight.storeHasProduct ? 'Your stock ran out before demand was met.' : 'Your store does not currently list it.'}`;
    case 'emerging':
      return `${product.name} (${product.packageSize}) is showing new demand with ${insight.eligibleEventCount} searches. ${insight.storeHasProduct ? 'Consider increasing stock.' : 'Consider adding it to your inventory.'}`;
    case 'insufficient_data':
      return `Only ${insight.eligibleEventCount} search${insight.eligibleEventCount === 1 ? '' : 'es'} recorded for ${product.name}. Not enough data to recommend stocking.`;
    case 'dismissed':
      return 'This product has been reviewed and dismissed.';
    default:
      return '';
  }
}

export function getPeriodDates(period: 'today' | '3days' | '7days'): { start: Date; end: Date } {
  const end = new Date();
  end.setHours(23, 59, 59, 999);

  const start = new Date();
  start.setHours(0, 0, 0, 0);

  switch (period) {
    case 'today':
      break;
    case '3days':
      start.setDate(start.getDate() - 2);
      break;
    case '7days':
      start.setDate(start.getDate() - 6);
      break;
  }

  return { start, end };
}
