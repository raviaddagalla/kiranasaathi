import React, { useState, useEffect } from 'react';
import type { Store, Product } from '../types';
import { aggregateDemand, getPeriodDates, getRecommendationExplanation } from '../services/demandService';
import type { DemandAggregationResult } from '../services/demandService';

interface DemandReportScreenProps {
  currentStore: Store;
  products: Product[];
  onOpenAddProduct: (product: Product) => void;
  onBack: () => void;
}

export const DemandReportScreen: React.FC<DemandReportScreenProps> = ({
  currentStore,
  products,
  onOpenAddProduct,
  onBack,
}) => {
  const [period, setPeriod] = useState<'today' | '3days' | '7days'>('3days');
  const [aggregationData, setAggregationData] = useState<DemandAggregationResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dismissedProductIds, setDismissedProductIds] = useState<Set<string>>(new Set());
  const [remindedProductIds, setRemindedProductIds] = useState<Set<string>>(new Set());
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    async function loadReport() {
      setIsLoading(true);
      try {
        const { start, end } = getPeriodDates(period);
        const result = await aggregateDemand(currentStore.id, start, end);
        setAggregationData(result);
      } finally {
        setIsLoading(false);
      }
    }
    loadReport();
  }, [currentStore.id, period]);

  const handleDismiss = (productId: string, productName: string) => {
    setDismissedProductIds((prev) => new Set([...prev, productId]));
    setNotice(`Marked "${productName}" as not relevant for now.`);
    setTimeout(() => setNotice(null), 3000);
  };

  const handleRemindLater = (productId: string, productName: string) => {
    setRemindedProductIds((prev) => new Set([...prev, productId]));
    setNotice(`Reminder set for "${productName}". Will alert in tomorrow's morning brief.`);
    setTimeout(() => setNotice(null), 3000);
  };

  const productMap = new Map(products.map((p) => [p.id, p]));

  // Filter out dismissed items
  const visibleInsights = (aggregationData?.insights || []).filter(
    (ins) => !dismissedProductIds.has(ins.productId)
  );

  return (
    <div className="flex flex-col relative w-full pt-16 pb-28 px-4 bg-surface min-h-screen max-w-md mx-auto">
      {notice && (
        <div className="fixed top-20 left-4 right-4 z-50 bg-inverse-surface text-inverse-on-surface p-3.5 rounded-2xl shadow-xl flex items-center justify-between text-xs font-semibold animate-in fade-in">
          <span>{notice}</span>
          <button onClick={() => setNotice(null)} className="text-on-surface-variant hover:text-white">
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      )}

      <div className="flex flex-col w-full space-y-4 pt-1">
        {/* Header Bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-xs font-bold text-primary bg-surface-container px-3 py-1.5 rounded-full"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>Dashboard</span>
          </button>
          <span className="text-xs font-bold text-on-surface-variant bg-surface-container-high px-2.5 py-1 rounded-full">
            Daily Ledger
          </span>
        </div>

        <div>
          <h1 className="text-xl font-bold text-on-surface">Daily Demand Evidence Report</h1>
          <p className="text-xs text-on-surface-variant">
            {currentStore.name} • {currentStore.locality}
          </p>
        </div>

        {/* Period Selector */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          <button
            onClick={() => setPeriod('today')}
            className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all ${
              period === 'today'
                ? 'bg-primary text-on-primary shadow-xs'
                : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Today's Log
          </button>
          <button
            onClick={() => setPeriod('3days')}
            className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all ${
              period === '3days'
                ? 'bg-primary text-on-primary shadow-xs'
                : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Last 3 Days
          </button>
          <button
            onClick={() => setPeriod('7days')}
            className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all ${
              period === '7days'
                ? 'bg-primary text-on-primary shadow-xs'
                : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Weekly Summary (7 Days)
          </button>
        </div>

        {/* Summary Card */}
        <div className="bg-surface-container-lowest p-4 rounded-2xl border border-surface-container shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider block">
              Eligible Unmet Searches
            </span>
            <span className="text-2xl font-black text-on-surface">
              {isLoading ? '...' : aggregationData?.totalUnmetRequests ?? 0}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider block">
              Distinct SKUs
            </span>
            <span className="text-2xl font-black text-primary">
              {isLoading ? '...' : visibleInsights.length}
            </span>
          </div>
        </div>

        {/* Report Table / List */}
        {isLoading ? (
          <div className="py-12 text-center flex flex-col items-center justify-center gap-2">
            <span className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></span>
            <p className="text-xs text-on-surface-variant">Generating report from stored events...</p>
          </div>
        ) : visibleInsights.length === 0 ? (
          <div className="p-8 text-center bg-surface-container-lowest rounded-2xl border border-surface-container">
            <span className="material-symbols-outlined text-[32px] text-on-surface-variant">fact_check</span>
            <h4 className="text-sm font-bold text-on-surface mt-2">All Demands Cleared</h4>
            <p className="text-xs text-on-surface-variant mt-1">
              No unmet customer search signals are pending review for this period.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {visibleInsights.map((insight) => {
              const product = productMap.get(insight.productId);
              if (!product) return null;

              const explanation = getRecommendationExplanation(insight, product);
              const isReminded = remindedProductIds.has(product.id);

              return (
                <div
                  key={insight.productId}
                  className="bg-surface-container-lowest rounded-2xl p-4 shadow-xs border border-surface-container flex flex-col gap-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-14 h-14 rounded-xl object-cover bg-surface-container flex-shrink-0"
                    />

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-primary">{product.brand}</span>
                        <span className="text-[10px] text-on-surface-variant">• {product.packageSize}</span>
                      </div>
                      <h3 className="text-sm font-bold text-on-surface truncate">{product.name}</h3>

                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-bold text-on-surface">
                          {insight.eligibleEventCount} searches
                        </span>
                        <span className="text-[11px] text-on-surface-variant">
                          across {insight.distinctDemandDays} day{insight.distinctDemandDays > 1 ? 's' : ''}
                        </span>
                        {isReminded && (
                          <span className="text-[10px] font-bold text-secondary bg-secondary-fixed/40 px-1.5 py-0.5 rounded">
                            Remind active
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className="text-xs font-bold text-on-surface">MRP ₹{product.mrp}</span>
                      <span className={`text-[10px] block font-semibold ${
                        insight.storeHasProduct ? 'text-error' : 'text-on-surface-variant'
                      }`}>
                        {insight.storeHasProduct ? 'Stock ran out' : 'Not stocked'}
                      </span>
                    </div>
                  </div>

                  {/* Recommendation explanation string */}
                  <div className="bg-surface-container-low p-2.5 rounded-xl text-xs text-on-surface leading-snug">
                    {explanation}
                  </div>

                  {/* Action row */}
                  <div className="grid grid-cols-3 gap-2 pt-1 border-t border-surface-container-low">
                    <button
                      onClick={() => onOpenAddProduct(product)}
                      className="h-10 rounded-xl bg-primary text-on-primary text-xs font-bold flex items-center justify-center gap-1 shadow-xs active:bg-primary-container transition-all col-span-1"
                    >
                      <span className="material-symbols-outlined text-[16px]">add</span>
                      <span>Stock It</span>
                    </button>
                    <button
                      onClick={() => handleRemindLater(product.id, product.name)}
                      className="h-10 rounded-xl bg-surface-container text-on-surface text-xs font-semibold flex items-center justify-center gap-1 hover:bg-surface-container-high transition-all"
                    >
                      <span className="material-symbols-outlined text-[16px]">alarm</span>
                      <span>Later</span>
                    </button>
                    <button
                      onClick={() => handleDismiss(product.id, product.name)}
                      className="h-10 rounded-xl bg-surface-container-low text-on-surface-variant text-xs font-medium flex items-center justify-center gap-1 hover:bg-surface-container transition-all"
                    >
                      <span className="material-symbols-outlined text-[16px]">close</span>
                      <span>Dismiss</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
