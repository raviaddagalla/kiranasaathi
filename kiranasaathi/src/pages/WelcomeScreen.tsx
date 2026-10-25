import React from 'react';
import type { UserRole, Store } from '../types';

interface WelcomeScreenProps {
  onSelectRole: (role: UserRole) => void;
  stores: Store[];
  selectedStoreId: string;
  onSelectStore: (storeId: string) => void;
  onOpenTour?: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onSelectRole,
  stores,
  selectedStoreId,
  onSelectStore,
  onOpenTour,
}) => {
  return (
    <div className="flex flex-col relative w-full px-4 bg-surface min-h-screen pt-4 pb-12 max-w-md mx-auto">
      {/* Top Brand Banner */}
      <div className="flex flex-col items-center text-center pt-2 pb-4 px-2">
        <div className="relative w-20 h-20 mb-3 flex items-center justify-center rounded-2xl bg-surface-container shadow-sm p-2">
          <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center text-on-primary">
            <span className="material-symbols-outlined text-[34px]">storefront</span>
          </div>
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-secondary-container rounded-full ring-2 ring-surface"></span>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed mb-2">
          <span
            className="material-symbols-outlined text-[16px] text-on-primary-fixed-variant"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            hub
          </span>
          <span className="text-[11px] font-bold text-on-primary-fixed-variant tracking-wide uppercase">
            Hyperlocal Kirana Network
          </span>
        </div>

        <h1 className="text-2xl font-bold text-on-surface tracking-tight">KiranaSaathi</h1>
        <p className="text-sm font-semibold text-primary mt-0.5">Find locally. Stock smarter.</p>
        <p className="text-xs text-on-surface-variant max-w-xs mt-2 px-1 leading-relaxed">
          Discover exact grocery items at nearby neighborhood kirana stores, or help local shopkeepers understand what customers are looking for.
        </p>
      </div>

      {/* Interactive Demo Tour Quick Start Banner */}
      {onOpenTour && (
        <button
          onClick={onOpenTour}
          type="button"
          className="w-full mb-4 p-3.5 rounded-2xl bg-gradient-to-r from-secondary-container via-secondary-fixed to-secondary text-on-secondary-fixed font-bold shadow-md flex items-center justify-between hover:scale-[1.01] active:scale-[0.98] transition-all border border-secondary"
        >
          <div className="flex items-center gap-2.5 text-left">
            <div className="w-10 h-10 rounded-xl bg-on-secondary-fixed/15 flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px] text-on-secondary-fixed">play_circle</span>
            </div>
            <div>
              <div className="text-xs font-extrabold uppercase tracking-wider text-on-secondary-fixed">
                Live Interactive Demo Tour
              </div>
              <div className="text-[11px] opacity-90 text-on-secondary-fixed">
                8-step walkthrough: Discovery → Shortage → Restock
              </div>
            </div>
          </div>
          <span className="material-symbols-outlined text-[20px] text-on-secondary-fixed">arrow_forward</span>
        </button>
      )}

      {/* Role Selection Cards */}
      <div className="flex flex-col gap-4">
        {/* Customer / Shopper Card */}
        <div className="group relative rounded-2xl bg-surface-container-lowest p-5 shadow-sm hover:shadow-md transition-all duration-200 border border-surface-container">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-primary-fixed flex items-center justify-center shrink-0">
              <span
                className="material-symbols-outlined text-primary text-[28px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                shopping_basket
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface-variant">
              <span
                className="material-symbols-outlined text-[14px] text-primary"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                verified_user
              </span>
              <span className="text-[11px] font-semibold">Demo: Ananya (Banjara Hills)</span>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-on-surface">I'm looking for products</h2>
              <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[11px] font-bold">
                Shopper
              </span>
            </div>
            <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">
              Check which nearby kirana stores have your exact milk, bread, or atta in stock right now before stepping out.
            </p>
            <div className="flex items-center gap-2 mt-3 py-1.5 px-2.5 rounded-lg bg-surface-container-low">
              <span
                className="material-symbols-outlined text-[16px] text-tertiary-container"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                search_insights
              </span>
              <span className="text-xs text-on-surface-variant truncate">
                Live availability • 5 stores in Banjara Hills
              </span>
            </div>

            <button
              onClick={() => onSelectRole('customer')}
              className="mt-4 w-full h-12 min-h-[48px] rounded-xl bg-primary text-on-primary text-sm font-bold flex items-center justify-center gap-2 shadow-sm hover:bg-primary-container active:scale-[0.98] transition-all"
              type="button"
            >
              <span>Explore Nearby Stores</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Shopkeeper / Merchant Card */}
        <div className="group relative rounded-2xl bg-surface-container-lowest p-5 shadow-sm hover:shadow-md transition-all duration-200 border border-surface-container">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-tertiary-fixed flex items-center justify-center shrink-0">
              <span
                className="material-symbols-outlined text-tertiary text-[28px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                store
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed">
              <span
                className="material-symbols-outlined text-[14px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                inventory_2
              </span>
              <span className="text-[11px] font-semibold">Demo: Ramesh (Sri Lakshmi)</span>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-on-surface">I'm a shopkeeper</h2>
              <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant text-[11px] font-bold">
                Merchant
              </span>
            </div>
            <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">
              Effortlessly manage stock with voice, track low inventory, and discover what nearby customers searched for today.
            </p>

            {/* Store selector for demo */}
            <div className="mt-3 flex flex-col gap-1">
              <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                Select Your Store (Demo)
              </label>
              <select
                value={selectedStoreId}
                onChange={(e) => onSelectStore(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container-low border border-surface-container-highest rounded-lg text-xs font-semibold text-on-surface focus:outline-none focus:border-primary"
              >
                {stores.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.locality})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 mt-3 py-1.5 px-2.5 rounded-lg bg-surface-container-low">
              <span
                className="material-symbols-outlined text-[16px] text-primary"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                mic
              </span>
              <span className="text-xs text-on-surface-variant truncate">
                Voice updates in Hindi, Telugu, English
              </span>
            </div>

            <button
              onClick={() => onSelectRole('shopkeeper')}
              className="mt-4 w-full h-12 min-h-[48px] rounded-xl bg-surface-container text-primary text-sm font-bold flex items-center justify-center gap-2 hover:bg-surface-container-high active:scale-[0.98] transition-all border border-surface-container-highest"
              type="button"
            >
              <span>Open Kirana Dashboard</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-6 flex flex-col items-center text-center px-4">
        <div className="flex items-center justify-center gap-2 text-outline">
          <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
        </div>
        <p className="text-[11px] text-on-surface-variant mt-2.5 max-w-xs leading-normal">
          Designed for Indian neighborhood retail. Hyperlocal fair discovery without marketplace commissions.
        </p>
      </div>
    </div>
  );
};
