import React, { useState, useEffect } from 'react';
import type { Product, StoreAvailability } from '../types';
import { findStoresCarryingProduct, getFreshnessLabel, getAvailabilityBadgeStyle } from '../services/searchService';
import { recordDemandEvent } from '../services/database';

interface NearbyStoresScreenProps {
  product: Product;
  onBack: () => void;
  onSelectStore?: (storeId: string) => void;
  currentLocality: string;
}

export const NearbyStoresScreen: React.FC<NearbyStoresScreenProps> = ({
  product,
  onBack,
  currentLocality,
}) => {
  const [storeAvailabilities, setStoreAvailabilities] = useState<StoreAvailability[]>([]);
  const [filter, setFilter] = useState<'all' | 'in_stock' | 'closest' | 'price' | 'fresh'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [demandRegistered, setDemandRegistered] = useState(false);
  const [isRegisteringDemand, setIsRegisteringDemand] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  useEffect(() => {
    async function loadStores() {
      setIsLoading(true);
      try {
        const stores = await findStoresCarryingProduct(product.id);
        setStoreAvailabilities(stores);
      } finally {
        setIsLoading(false);
      }
    }
    loadStores();
  }, [product.id]);

  // Count available stores
  const inStockStoresCount = storeAvailabilities.filter(
    (sa) => sa.inventory && (sa.inventory.availabilityStatus === 'in_stock' || sa.inventory.availabilityStatus === 'low_stock')
  ).length;

  // Filtered & sorted list
  const filteredStores = [...storeAvailabilities].filter((sa) => {
    if (filter === 'in_stock') {
      return sa.inventory && (sa.inventory.availabilityStatus === 'in_stock' || sa.inventory.availabilityStatus === 'low_stock');
    }
    return true;
  }).sort((a, b) => {
    if (filter === 'closest') return a.distance - b.distance;
    if (filter === 'price') {
      const pA = a.inventory?.listedPrice ?? a.inventory?.quantity ?? 999;
      const pB = b.inventory?.listedPrice ?? b.inventory?.quantity ?? 999;
      return pA - pB;
    }
    if (filter === 'fresh') {
      const timeA = a.inventory ? new Date(a.inventory.updatedAt).getTime() : 0;
      const timeB = b.inventory ? new Date(b.inventory.updatedAt).getTime() : 0;
      return timeB - timeA;
    }
    return a.distance - b.distance; // Default closest
  });

  const handleRegisterDemand = async (eventType: 'not_listed' | 'out_of_stock' | 'unconfirmed') => {
    setIsRegisteringDemand(true);
    try {
      await recordDemandEvent({
        productId: product.id,
        localityId: currentLocality,
        eventType,
      });
      setDemandRegistered(true);
      setActionNotice('Your unmet demand signal was registered and anonymized for neighborhood kiranas!');
    } catch {
      setActionNotice('Failed to record demand signal.');
    } finally {
      setIsRegisteringDemand(false);
    }
  };

  const handleDirections = (storeName: string, distance: number) => {
    const walkMinutes = Math.max(2, Math.round(distance * 12));
    setActionNotice(`Directions to ${storeName}: ~${walkMinutes} min walk (${distance} km). Walking route plotted.`);
  };

  const handleCallStore = (storeName: string, phone: string) => {
    setActionNotice(`Connecting call to ${storeName} at ${phone}...`);
  };

  return (
    <div className="flex flex-col relative w-full pt-16 pb-20 px-4 bg-surface min-h-screen max-w-md mx-auto">
      {/* Toast Notice */}
      {actionNotice && (
        <div className="fixed top-20 left-4 right-4 z-50 bg-inverse-surface text-inverse-on-surface p-3.5 rounded-2xl shadow-xl flex items-center justify-between gap-2 text-xs font-semibold animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary-fixed text-[18px]">info</span>
            <span>{actionNotice}</span>
          </div>
          <button onClick={() => setActionNotice(null)} className="text-on-surface-variant hover:text-white">
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      )}

      <div className="flex flex-col w-full space-y-4 pt-1">
        {/* Top Header / Back Bar */}
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-xs font-bold text-primary hover:underline bg-surface-container px-3 py-1.5 rounded-full"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>Back to Discovery</span>
          </button>
          <span className="text-[11px] font-bold text-on-surface-variant bg-surface-container-high px-2.5 py-1 rounded-full">
            {currentLocality}
          </span>
        </div>

        {/* Product Anchor Card */}
        <div className="bg-surface-container-lowest p-4 rounded-2xl shadow-sm border border-surface-container flex flex-col gap-3">
          <div className="flex gap-3 items-center">
            <div className="w-20 h-20 rounded-xl overflow-hidden bg-surface-container flex-shrink-0 relative">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              <div className="absolute bottom-1 right-1 bg-surface-container-lowest/90 px-1.5 py-0.5 rounded text-[10px] font-bold text-on-surface">
                {product.packageSize}
              </div>
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-xs text-primary font-bold">{product.brand}</span>
                <span className="text-on-surface-variant/40">•</span>
                <span className="text-xs text-on-surface-variant">{product.category}</span>
              </div>
              <h2 className="text-base font-bold text-on-surface truncate">{product.name}</h2>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-lg font-black text-primary">₹{product.mrp}</span>
                <span className="text-xs text-on-surface-variant">MRP (Incl. taxes)</span>
              </div>
            </div>
          </div>

          <div className="bg-primary-fixed/30 rounded-xl px-3 py-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
            <p className="text-xs text-on-primary-fixed-variant font-bold">
              {inStockStoresCount} of {storeAvailabilities.length} nearby stores list this exact variant
            </p>
          </div>
        </div>

        {/* Filter & Sort Chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 py-1">
          <button
            onClick={() => setFilter('all')}
            className={`h-9 px-3.5 rounded-full text-xs font-bold flex items-center gap-1.5 flex-shrink-0 transition-all ${
              filter === 'all'
                ? 'bg-primary text-on-primary shadow-xs'
                : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
            }`}
          >
            <span>All Stores ({storeAvailabilities.length})</span>
          </button>
          <button
            onClick={() => setFilter('in_stock')}
            className={`h-9 px-3.5 rounded-full text-xs font-bold flex items-center gap-1.5 flex-shrink-0 transition-all ${
              filter === 'in_stock'
                ? 'bg-primary text-on-primary shadow-xs'
                : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">check_circle</span>
            <span>In Stock Now ({inStockStoresCount})</span>
          </button>
          <button
            onClick={() => setFilter('closest')}
            className={`h-9 px-3.5 rounded-full text-xs font-bold flex items-center gap-1.5 flex-shrink-0 transition-all ${
              filter === 'closest'
                ? 'bg-primary text-on-primary shadow-xs'
                : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">near_me</span>
            <span>Closest First</span>
          </button>
          <button
            onClick={() => setFilter('price')}
            className={`h-9 px-3.5 rounded-full text-xs font-bold flex items-center gap-1.5 flex-shrink-0 transition-all ${
              filter === 'price'
                ? 'bg-primary text-on-primary shadow-xs'
                : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
            }`}
          >
            <span>Lowest Price</span>
          </button>
          <button
            onClick={() => setFilter('fresh')}
            className={`h-9 px-3.5 rounded-full text-xs font-bold flex items-center gap-1.5 flex-shrink-0 transition-all ${
              filter === 'fresh'
                ? 'bg-primary text-on-primary shadow-xs'
                : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">schedule</span>
            <span>Freshly Updated</span>
          </button>
        </div>

        {/* Store Results List */}
        {isLoading ? (
          <div className="py-12 text-center flex flex-col items-center justify-center gap-3">
            <span className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></span>
            <p className="text-xs font-semibold text-on-surface-variant">Checking live store inventories...</p>
          </div>
        ) : filteredStores.length === 0 ? (
          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-surface-container text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-error-container text-on-error-container flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-[24px]">store_mall_directory</span>
            </div>
            <h3 className="text-sm font-bold text-on-surface">No stores match the active filter</h3>
            <p className="text-xs text-on-surface-variant">Try selecting "All Stores" to see out-of-stock or nearby shops.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredStores.map(({ store, inventory, distance }) => {
              const status = inventory ? inventory.availabilityStatus : 'unconfirmed';
              const badgeStyle = getAvailabilityBadgeStyle(status);
              const freshness = inventory ? getFreshnessLabel(inventory.updatedAt) : 'Availability unconfirmed';
              const price = inventory?.listedPrice || product.mrp;
              const isOutOfStock = status === 'out_of_stock';

              return (
                <div
                  key={store.id}
                  className={`rounded-2xl p-4 shadow-xs border transition-all ${
                    isOutOfStock
                      ? 'bg-surface-container-low border-surface-container opacity-85'
                      : 'bg-surface-container-lowest border-surface-container hover:shadow-sm'
                  }`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-sm font-bold text-on-surface truncate">{store.name}</h3>
                        {store.verified && (
                          <span className="material-symbols-outlined text-primary text-[16px]" title="Verified Kirana">
                            verified
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-on-surface-variant flex items-center gap-1 mt-0.5">
                        <span className="material-symbols-outlined text-[13px] text-primary">navigation</span>
                        <strong className="text-on-surface font-semibold">{distance} km away</strong> • {store.locality}
                      </p>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <p className={`text-base font-bold ${isOutOfStock ? 'text-on-surface-variant line-through' : 'text-primary'}`}>
                        ₹{price}
                      </p>
                      <span className="text-[10px] text-on-surface-variant">MRP</span>
                    </div>
                  </div>

                  {/* Status & Freshness Chips */}
                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${badgeStyle.bgClass} ${badgeStyle.textClass}`}>
                      <span className={`w-2 h-2 rounded-full ${badgeStyle.dotClass} ${badgeStyle.animate ? 'animate-pulse' : ''}`}></span>
                      {status === 'in_stock' && `In Stock (${inventory?.quantity || 1} available)`}
                      {status === 'low_stock' && `Low Stock (Only ${inventory?.quantity} left)`}
                      {status === 'out_of_stock' && 'Out of Stock'}
                      {status === 'unconfirmed' && 'Availability Unconfirmed'}
                    </span>

                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant text-[11px]">
                      <span className="material-symbols-outlined text-[13px]">schedule</span>
                      <span>{freshness}</span>
                    </span>
                  </div>

                  {/* Store Actions */}
                  <div className="grid grid-cols-2 gap-2 pt-3">
                    <button
                      onClick={() => handleDirections(store.name, distance)}
                      className="h-11 rounded-xl bg-primary text-on-primary text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs active:bg-primary-container transition-all"
                    >
                      <span className="material-symbols-outlined text-[18px]">directions_walk</span>
                      <span>Directions (~{Math.max(2, Math.round(distance * 12))}m)</span>
                    </button>

                    <button
                      onClick={() => handleCallStore(store.name, store.phone)}
                      className="h-11 rounded-xl bg-surface-container text-on-surface text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-surface-container-high transition-all"
                    >
                      <span className="material-symbols-outlined text-[18px] text-primary">call</span>
                      <span>Call Kirana</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Unmet Demand Registration Section (Crucial Feature!) */}
        <div className="bg-secondary-fixed/20 border border-secondary-fixed rounded-2xl p-4 flex flex-col gap-2.5">
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-[20px]">notification_add</span>
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-bold text-on-secondary-fixed uppercase tracking-wider">
                Community Demand Feedback Loop
              </h4>
              <p className="text-xs text-on-surface mt-0.5 leading-snug">
                Couldn't find enough stock or exact variant? Register an unmet demand signal so local shopkeepers restock this!
              </p>
            </div>
          </div>

          {demandRegistered ? (
            <div className="p-3 bg-surface-container-lowest rounded-xl flex items-center gap-2 text-xs font-bold text-primary">
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
              <span>Demand signal recorded! Local kiranas will see this in their demand report.</span>
            </div>
          ) : (
            <button
              onClick={() => handleRegisterDemand('out_of_stock')}
              disabled={isRegisteringDemand}
              className="w-full h-11 rounded-xl bg-secondary-fixed text-on-secondary-fixed text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs hover:bg-secondary-fixed-dim active:scale-98 transition-all disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[18px]">campaign</span>
              <span>{isRegisteringDemand ? 'Recording signal...' : 'Register Unmet Demand for My Neighborhood'}</span>
            </button>
          )}
        </div>

        {/* Neighborhood Kirana Guarantee Banner */}
        <div className="bg-surface-container rounded-2xl p-3.5 flex gap-2.5 items-start">
          <div className="w-7 h-7 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="material-symbols-outlined text-[16px]">verified_user</span>
          </div>
          <div className="text-[11px] text-on-surface-variant leading-relaxed">
            <strong className="text-on-surface font-semibold block">Independent Local Commerce:</strong>
            Stock counts are maintained by neighborhood store owners. KiranaSaathi does not take commissions or replace direct counter relationships.
          </div>
        </div>
      </div>
    </div>
  );
};
