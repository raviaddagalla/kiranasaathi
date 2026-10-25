import React, { useState, useEffect, useRef } from 'react';
import type { Product, Store } from '../types';

export interface DemoTourProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  stores: Store[];
  onSelectRole: (role: 'customer' | 'shopkeeper') => void;
  onSelectProduct: (product: Product | null) => void;
  onSelectTab: (tab: string) => void;
  onRegisterDemand: (productId: string) => Promise<void>;
  onAddStock: (productId: string, qty: number) => Promise<void>;
  onShowToast: (message: string) => void;
}

interface TourStep {
  id: number;
  badge: string;
  badgeColor: string;
  title: string;
  description: string;
  actionText: string;
  runAction: () => Promise<void>;
}

export const DemoTourModal: React.FC<DemoTourProps> = ({
  isOpen,
  onClose,
  products,
  onSelectRole,
  onSelectProduct,
  onSelectTab,
  onRegisterDemand,
  onAddStock,
  onShowToast,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const wheatBread = products.find((p) => p.id === 'prod-003') || products[0];
  const heritageMilk = products.find((p) => p.id === 'prod-001') || products[1];

  const steps: TourStep[] = [
    {
      id: 1,
      badge: 'Step 1/8: Shopper Discovery',
      badgeColor: 'bg-secondary-fixed text-on-secondary-fixed',
      title: 'Exact Product Variant Match',
      description:
        'Customer Ananya in Banjara Hills searches for "Britannia 100% Whole Wheat Bread". The app matches the exact variant, not white bread.',
      actionText: 'Locate Whole Wheat Bread',
      runAction: async () => {
        onSelectRole('customer');
        onSelectProduct(wheatBread);
        onShowToast('Found Britannia 100% Whole Wheat Bread (400 g)');
      },
    },
    {
      id: 2,
      badge: 'Step 2/8: Live Store Availability',
      badgeColor: 'bg-primary-fixed text-on-primary-fixed-variant',
      title: 'Real-time Stock & Distance',
      description:
        'Sri Lakshmi Kirana is 0.4 km away with 8 packets in stock at ₹45 MRP. Updated 12m ago by Ramesh (Owner).',
      actionText: 'View Store Directions',
      runAction: async () => {
        onShowToast('Directions to Sri Lakshmi Kirana: ~4 min walk (0.4 km)');
      },
    },
    {
      id: 3,
      badge: 'Step 3/8: The Missing Product',
      badgeColor: 'bg-error-container text-on-error-container',
      title: 'Search Miss: Heritage Toned Milk',
      description:
        'Ananya needs Heritage Toned Milk (500 ml). Nearest stores have 0 confirmed stock! Normal apps stop here with dead ends.',
      actionText: 'Inspect Milk Shortage',
      runAction: async () => {
        onSelectProduct(heritageMilk);
        onShowToast('Heritage Toned Milk: Out of stock in nearest stores');
      },
    },
    {
      id: 4,
      badge: 'Step 4/8: Demand Feedback Loop',
      badgeColor: 'bg-secondary-container text-on-secondary-container',
      title: 'Register Unmet Demand Signal',
      description:
        'Ananya registers an anonymized unmet demand signal for Road No. 12, Banjara Hills. IndexedDB deduplicates same-day requests.',
      actionText: 'Register Demand Signal',
      runAction: async () => {
        await onRegisterDemand(heritageMilk.id);
        onShowToast('✓ Demand signal recorded for neighborhood kiranas!');
      },
    },
    {
      id: 5,
      badge: 'Step 5/8: Merchant Intelligence',
      badgeColor: 'bg-primary-fixed text-on-primary-fixed-variant',
      title: 'Switching to Ramesh (Shopkeeper)',
      description:
        'Ramesh Kumar opens his Community Demand Intelligence Hub to see what neighborhood customers searched for today.',
      actionText: 'Open Merchant Hub',
      runAction: async () => {
        onSelectRole('shopkeeper');
        onSelectTab('merchant_dashboard');
        onSelectProduct(null);
        onShowToast('Switched to Sri Lakshmi Kirana (Ramesh Kumar)');
      },
    },
    {
      id: 6,
      badge: 'Step 6/8: Multi-Day Demand Pattern',
      badgeColor: 'bg-secondary-fixed text-on-secondary-fixed',
      title: 'Recurring Demand Intelligence',
      description:
        'Heritage Toned Milk is flagged with "Recurring Demand · 3 Days in a row" with high morning tea-time intent from 28 searches!',
      actionText: 'Inspect Demand Card',
      runAction: async () => {
        onShowToast('Saathi Advice: High morning demand. Stock 15-20 packets.');
      },
    },
    {
      id: 7,
      badge: 'Step 7/8: Stocking Suggested Item',
      badgeColor: 'bg-primary-fixed text-on-primary-fixed-variant',
      title: 'Merchant Adds 20 Packets to Stock',
      description:
        'Ramesh accepts the Saathi recommendation and adds Heritage Milk to his store with 20 packets initial stock, threshold 5.',
      actionText: 'Stock 20 Packets Now',
      runAction: async () => {
        await onAddStock(heritageMilk.id, 20);
        onSelectTab('merchant_inventory');
        onShowToast('✓ Heritage Toned Milk added with 20 packets in stock!');
      },
    },
    {
      id: 8,
      badge: 'Step 8/8: Closed Loop Complete!',
      badgeColor: 'bg-primary text-on-primary',
      title: 'Customer Sees Live Stock Available!',
      description:
        'Switching back to Shopper mode! Ananya now sees Heritage Toned Milk is LIVE & IN STOCK at Sri Lakshmi Kirana! The feedback loop is complete.',
      actionText: 'Verify Shopper Availability',
      runAction: async () => {
        onSelectRole('customer');
        onSelectProduct(heritageMilk);
        onShowToast('✓ Heritage Milk is now IN STOCK at Sri Lakshmi Kirana (20 left)!');
      },
    },
  ];

  const currentStep = steps[currentStepIndex];

  // Auto-play progression
  useEffect(() => {
    if (!isAutoPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setCurrentStepIndex((prev) => {
        const next = prev + 1;
        if (next < steps.length) {
          steps[next].runAction();
          return next;
        } else {
          setIsAutoPlaying(false);
          return prev;
        }
      });
    }, 4500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isAutoPlaying, steps]);

  const handleNext = async () => {
    if (currentStepIndex < steps.length - 1) {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      await steps[nextIndex].runAction();
    }
  };

  const handlePrev = async () => {
    if (currentStepIndex > 0) {
      const prevIndex = currentStepIndex - 1;
      setCurrentStepIndex(prevIndex);
      await steps[prevIndex].runAction();
    }
  };

  const handleTriggerAction = async () => {
    await currentStep.runAction();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-3 sm:p-4 max-w-md mx-auto pointer-events-auto animate-in slide-in-from-bottom duration-300">
      <div className="bg-surface-container-lowest rounded-3xl p-4 shadow-2xl border-2 border-primary flex flex-col gap-3">
        {/* Header Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
            </span>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${currentStep.badgeColor}`}>
              {currentStep.badge}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 transition-all ${
                isAutoPlaying
                  ? 'bg-secondary-fixed text-on-secondary-fixed shadow-xs'
                  : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">
                {isAutoPlaying ? 'pause' : 'play_arrow'}
              </span>
              <span>{isAutoPlaying ? 'Pause' : 'Auto-Play'}</span>
            </button>

            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-primary h-full transition-all duration-300 rounded-full"
            style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
          ></div>
        </div>

        {/* Step Content */}
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-bold text-on-surface flex items-center gap-1.5">
            <span>{currentStep.title}</span>
          </h3>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            {currentStep.description}
          </p>
        </div>

        {/* Interactive Action Trigger */}
        <button
          onClick={handleTriggerAction}
          className="w-full py-2.5 px-3 rounded-xl bg-primary-fixed/40 border border-primary-fixed text-primary text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-primary-fixed/60 active:scale-98 transition-all"
        >
          <span className="material-symbols-outlined text-[16px]">touch_app</span>
          <span>{currentStep.actionText}</span>
        </button>

        {/* Navigation Step Controls */}
        <div className="flex items-center justify-between pt-1 border-t border-surface-container-low">
          <button
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            className="px-3 py-1.5 rounded-lg bg-surface-container text-xs font-semibold text-on-surface disabled:opacity-30 hover:bg-surface-container-high transition-all"
          >
            ← Prev
          </button>

          <span className="text-[11px] font-bold text-on-surface-variant">
            {currentStepIndex + 1} of {steps.length}
          </span>

          {currentStepIndex < steps.length - 1 ? (
            <button
              onClick={handleNext}
              className="px-4 py-1.5 rounded-lg bg-primary text-on-primary text-xs font-bold shadow-xs active:scale-95 transition-all"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-primary text-on-primary text-xs font-bold shadow-xs active:scale-95 transition-all"
            >
              Done ✓
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
