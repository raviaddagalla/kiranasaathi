import React, { useState, useEffect } from 'react';
import type { Store, Product } from '../types';
import { aggregateDemand, getPeriodDates } from '../services/demandService';
import type { DemandAggregationResult } from '../services/demandService';

interface MerchantDashboardProps {
  currentStore: Store;
  products: Product[];
  onOpenAddProduct: (product?: Product) => void;
  onOpenVoiceModal: () => void;
  onNavigateToReport: () => void;
  onNavigateToInventory?: () => void;
}

export const MerchantDashboard: React.FC<MerchantDashboardProps> = ({
  currentStore,
  products,
  onOpenAddProduct,
  onOpenVoiceModal,
  onNavigateToReport,
  onNavigateToInventory,
}) => {
  const [period, setPeriod] = useState<'today' | '3days' | '7days'>('3days');
  const [aggregationData, setAggregationData] = useState<DemandAggregationResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadDemand() {
      setIsLoading(true);
      try {
        const { start, end } = getPeriodDates(period);
        const result = await aggregateDemand(currentStore.id, start, end);
        setAggregationData(result);
      } finally {
        setIsLoading(false);
      }
    }
    loadDemand();
  }, [currentStore.id, period]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Calculate estimated walk-away value
  const estimatedLostSales = (aggregationData?.insights || []).reduce((acc, ins) => {
    const prod = products.find((p) => p.id === ins.productId);
    const mrp = prod ? prod.mrp : 40;
    return acc + ins.eligibleEventCount * mrp;
  }, 0);

  return (
    <div className="flex flex-col relative w-full pt-16 pb-28 px-4 bg-surface min-h-screen max-w-md mx-auto">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-20 left-4 right-4 z-50 bg-inverse-surface text-inverse-on-surface px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-in fade-in">
          <span className="material-symbols-outlined text-primary-fixed text-[18px]">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="flex flex-col w-full space-y-4 pt-1">
        {/* Contextual Sub-header / Merchant Banner */}
        <div className="bg-surface-container-low rounded-2xl p-4 shadow-xs border border-surface-container relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-primary-fixed/20 rounded-full blur-xl pointer-events-none"></div>
          <div className="flex items-start justify-between gap-2 relative z-10">
            <div className="flex flex-col space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-[18px]">hub</span>
                <span className="text-[11px] font-bold text-primary uppercase tracking-wider">
                  Community Demand Intelligence
                </span>
              </div>
              <h2 className="text-base font-bold text-on-surface tracking-tight">
                {currentStore.name}{' '}
                <span className="text-xs font-normal text-on-surface-variant">({currentStore.ownerName})</span>
              </h2>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Aggregated demand patterns from {currentStore.locality}. See what your neighborhood searched for.
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center flex-shrink-0 text-on-secondary-container shadow-xs">
              <span className="material-symbols-outlined text-[20px]">radar</span>
            </div>
          </div>
        </div>

        {/* Quick Voice Stock Trigger Pill */}
        <div className="flex items-center justify-between bg-primary-fixed/30 border border-primary-fixed p-3 rounded-2xl shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">mic</span>
            </div>
            <div>
              <h4 className="text-xs font-bold text-on-surface">Voice Stock Update</h4>
              <p className="text-[11px] text-on-surface-variant">"Set Parle-G stock to 20 packets"</p>
            </div>
          </div>
          <button
            onClick={onOpenVoiceModal}
            className="px-3.5 py-1.5 rounded-full bg-primary text-on-primary text-xs font-bold shadow-xs active:scale-95 transition-all"
          >
            Speak
          </button>
        </div>

        {/* Time-range Horizon Selector */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          <button
            onClick={() => {
              setPeriod('today');
              showToast('Loaded demand trends for Today');
            }}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              period === 'today'
                ? 'bg-primary text-on-primary shadow-xs'
                : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-primary-fixed animate-pulse"></span>
            <span>Today</span>
          </button>
          <button
            onClick={() => {
              setPeriod('3days');
              showToast('Loaded demand trends for Last 3 Days');
            }}
            className={`flex items-center gap-1 px-3.5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              period === '3days'
                ? 'bg-primary text-on-primary shadow-xs'
                : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span>Last 3 Days</span>
          </button>
          <button
            onClick={() => {
              setPeriod('7days');
              showToast('Loaded demand trends for Last 7 Days');
            }}
            className={`flex items-center gap-1 px-3.5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              period === '7days'
                ? 'bg-primary text-on-primary shadow-xs'
                : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span>Last 7 Days</span>
          </button>
        </div>

        {/* Key Metric Highlights Grid (4 compact cards) */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Metric 1: Unmet Requests */}
          <div className="bg-surface-container-lowest rounded-2xl p-3.5 shadow-xs border border-surface-container flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-on-surface-variant">Unmet Requests</span>
              <div className="w-7 h-7 rounded-lg bg-error-container text-on-error-container flex items-center justify-center">
                <span className="material-symbols-outlined text-[16px]">search_off</span>
              </div>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-black text-on-surface">
                {isLoading ? '...' : aggregationData?.totalUnmetRequests ?? 0}
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="material-symbols-outlined text-error text-[13px]">arrow_upward</span>
                <span className="text-[10px] font-semibold text-error">Community signals</span>
              </div>
            </div>
          </div>

          {/* Metric 2: Emerging SKUs */}
          <div
            onClick={onNavigateToInventory}
            className="bg-surface-container-lowest rounded-2xl p-3.5 shadow-xs border border-surface-container flex flex-col justify-between cursor-pointer hover:bg-surface-container-low transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-on-surface-variant">Emerging SKUs</span>
              <div className="w-7 h-7 rounded-lg bg-primary-fixed text-on-primary-fixed-variant flex items-center justify-center">
                <span className="material-symbols-outlined text-[16px]">bolt</span>
              </div>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-black text-on-surface">
                {isLoading ? '...' : aggregationData?.emergingSKUs ?? 0}
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="material-symbols-outlined text-primary text-[13px]">trending_up</span>
                <span className="text-[10px] font-semibold text-primary">New opportunities</span>
              </div>
            </div>
          </div>

          {/* Metric 3: Recurring Demands */}
          <div className="bg-surface-container-lowest rounded-2xl p-3.5 shadow-xs border border-surface-container flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-on-surface-variant">Persistent Shortage</span>
              <div className="w-7 h-7 rounded-lg bg-secondary-container text-on-secondary-container flex items-center justify-center">
                <span className="material-symbols-outlined text-[16px]">repeat</span>
              </div>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-black text-on-surface">
                {isLoading ? '...' : aggregationData?.persistentShortages ?? 0}
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-[10px] font-semibold text-on-surface-variant">≥2 days recurrent</span>
              </div>
            </div>
          </div>

          {/* Metric 4: Est Lost Sales */}
          <div className="bg-surface-container-lowest rounded-2xl p-3.5 shadow-xs border border-surface-container flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-on-surface-variant">Missed Opportunity</span>
              <div className="w-7 h-7 rounded-lg bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center">
                <span className="material-symbols-outlined text-[16px]">currency_rupee</span>
              </div>
            </div>
            <div className="mt-2">
              <div className="text-xl font-black text-tertiary">
                ₹{isLoading ? '...' : estimatedLostSales.toLocaleString()}
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-[10px] font-semibold text-on-surface-variant">Est. walk-away value</span>
              </div>
            </div>
          </div>
        </div>

        {/* Neighborhood Pulse Visualizer */}
        <div className="bg-surface-container-lowest rounded-2xl p-3.5 shadow-xs border border-surface-container space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-primary text-[16px]">location_on</span>
              <span className="text-xs font-bold text-on-surface">1.5 km Geofence Activity Pulse</span>
            </div>
            <span className="text-[10px] font-semibold text-on-surface-variant">Peak Hours: 6 AM - 9 AM</span>
          </div>
          <div className="flex items-end justify-between h-11 pt-1 px-1 gap-1">
            {[
              { label: '6a', height: '40%', active: false },
              { label: '8a', height: '95%', active: true },
              { label: '10a', height: '60%', active: false },
              { label: '1p', height: '25%', active: false },
              { label: '5p', height: '55%', active: false },
              { label: '7p', height: '85%', active: true },
              { label: '9p', height: '45%', active: false },
            ].map((col) => (
              <div key={col.label} className="flex flex-col items-center flex-1 h-full justify-end">
                <div
                  className={`w-full rounded-t ${col.active ? 'bg-primary' : 'bg-primary-fixed/50'}`}
                  style={{ height: col.height }}
                ></div>
                <span className={`text-[9px] mt-1 ${col.active ? 'text-primary font-bold' : 'text-on-surface-variant'}`}>
                  {col.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Demand Opportunities Heading */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-primary text-[20px]">local_fire_department</span>
            <h3 className="text-sm font-bold text-on-surface">Top Products Customers Are Looking For</h3>
          </div>
          <span className="bg-secondary-fixed text-on-secondary-fixed text-[11px] font-bold px-2.5 py-0.5 rounded-full">
            {aggregationData?.insights.length ?? 0} Demands
          </span>
        </div>

        {/* List of Demand Product Cards */}
        {isLoading ? (
          <div className="py-10 text-center flex flex-col items-center justify-center gap-2">
            <span className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></span>
            <p className="text-xs text-on-surface-variant">Aggregating neighborhood signals...</p>
          </div>
        ) : !aggregationData?.insights || aggregationData.insights.length === 0 ? (
          <div className="p-8 text-center bg-surface-container-lowest rounded-2xl border border-surface-container">
            <span className="material-symbols-outlined text-[32px] text-on-surface-variant">check_circle</span>
            <h4 className="text-sm font-bold text-on-surface mt-2">No Unmet Demand Recorded</h4>
            <p className="text-xs text-on-surface-variant mt-1">
              All neighborhood customer searches in this period were satisfied by local inventory.
            </p>
          </div>
        ) : (
          <div className="flex flex-col space-y-3">
            {aggregationData.insights.map((insight) => {
              const product = products.find((p) => p.id === insight.productId);
              if (!product) return null;

              const isRecurring = insight.recommendationStatus === 'recurring_demand';

              return (
                <div
                  key={insight.productId}
                  className="bg-surface-container-lowest rounded-2xl p-4 shadow-xs border border-surface-container space-y-3 relative overflow-hidden"
                >
                  {/* Top Badge */}
                  <div className="flex items-center justify-between gap-2">
                    <div
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        isRecurring
                          ? 'bg-secondary-container text-on-secondary-container'
                          : 'bg-primary-fixed text-on-primary-fixed-variant'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[14px]">
                        {isRecurring ? 'local_fire_department' : 'electric_bolt'}
                      </span>
                      <span>
                        {isRecurring
                          ? `Recurring Demand · ${insight.distinctDemandDays} Days in a row`
                          : 'Newly Emerging Demand'}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-primary">Est. ₹{insight.eligibleEventCount * product.mrp}/wk</span>
                  </div>

                  {/* Main Product Info Row */}
                  <div className="flex items-start gap-3">
                    <div className="w-16 h-16 rounded-xl bg-surface-container overflow-hidden flex-shrink-0 flex items-center justify-center">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-semibold bg-surface-container px-1.5 py-0.5 rounded text-on-surface-variant">
                          {product.category}
                        </span>
                        <span className="text-[10px] text-error font-bold flex items-center gap-0.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
                          {insight.storeHasProduct ? 'Out of stock' : 'Not in your inventory'}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-on-surface truncate mt-0.5">{product.name}</h4>
                      <p className="text-xs text-on-surface-variant flex items-center gap-1 mt-0.5">
                        <span className="material-symbols-outlined text-[14px] text-primary">person_search</span>
                        <strong className="text-on-surface font-semibold">{insight.eligibleEventCount} searches</strong> around your 1.5 km radius
                      </p>
                    </div>
                  </div>

                  {/* Saathi Demand Advice */}
                  <div className="bg-primary-fixed/20 rounded-xl p-2.5 flex items-start gap-2">
                    <span className="material-symbols-outlined text-primary text-[18px] mt-0.5">smart_toy</span>
                    <div className="flex-1 text-xs">
                      <strong className="text-primary font-bold block uppercase tracking-wider text-[10px]">
                        Saathi Stock Advice
                      </strong>
                      <p className="text-on-surface mt-0.5 leading-snug">
                        Customers searched for {product.name} across {insight.distinctDemandDays} separate days. Consider stocking ~15-20 units from your distributor.
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => onOpenAddProduct(product)}
                      className="flex-1 h-11 bg-primary text-on-primary rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs active:bg-primary-container transition-all"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[18px]">add_box</span>
                      <span>+ Add to My Inventory</span>
                    </button>
                    <button
                      onClick={onNavigateToReport}
                      className="px-3.5 h-11 bg-surface-container text-on-surface rounded-xl text-xs font-semibold flex items-center justify-center gap-1 hover:bg-surface-container-high transition-all"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[18px]">analytics</span>
                      <span>Evidence</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Privacy & Transparency Banner */}
        <div className="bg-surface-container rounded-2xl p-4 shadow-xs flex items-start gap-2.5">
          <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center flex-shrink-0 text-on-surface-variant">
            <span className="material-symbols-outlined text-[18px]">verified_user</span>
          </div>
          <div className="flex-1 text-xs text-on-surface-variant leading-relaxed">
            <strong className="text-on-surface font-bold block">Neighborhood Privacy Guarantee</strong>
            All signals are anonymized aggregates from customer searches within your 1.5 km neighborhood geofence. No individual customer details, phone numbers, or private identities are ever disclosed.
          </div>
        </div>
      </div>
    </div>
  );
};
