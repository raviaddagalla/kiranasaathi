import React from 'react';
import type { UserRole, Store } from '../types';

interface HeaderProps {
  role: UserRole;
  currentStore: Store | null;
  onSwitchRole: () => void;
  onResetData: () => void;
  onOpenTour?: () => void;
  onSelectStore?: (store: Store) => void;
  stores?: Store[];
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  role,
  currentStore,
  onSwitchRole,
  onResetData,
  onOpenTour,
  title,
  showBack,
  onBack,
}) => {
  return (
    <header className="fixed top-0 w-full z-40 bg-surface/90 backdrop-blur-md pt-safe shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-surface-container">
      {/* Android Status Bar Simulation */}
      <div className="flex justify-between items-center px-4 h-6 pt-1 text-on-surface-variant text-xs">
        <span className="font-semibold tracking-wide">9:41</span>
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[14px]">signal_cellular_4_bar</span>
          <span className="material-symbols-outlined text-[14px]">wifi</span>
          <span className="material-symbols-outlined text-[16px]">battery_full</span>
        </div>
      </div>

      {/* Main Header Content */}
      <div className="h-16 px-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {showBack && onBack ? (
            <button
              onClick={onBack}
              aria-label="Go Back"
              className="w-10 h-10 flex items-center justify-center text-on-surface rounded-full hover:bg-surface-container active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
          ) : (
            <div className="w-9 h-9 rounded-xl bg-primary-fixed flex items-center justify-center flex-shrink-0 text-primary">
              <span className="material-symbols-outlined text-[22px]">storefront</span>
            </div>
          )}

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-bold tracking-tight text-primary truncate text-base">
                {title || 'KiranaSaathi'}
              </span>
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider flex-shrink-0 ${
                  role === 'customer'
                    ? 'bg-secondary-fixed text-on-secondary-fixed'
                    : 'bg-primary-fixed text-on-primary-fixed-variant'
                }`}
              >
                {role === 'customer' ? 'Shopper' : 'Merchant'}
              </span>
            </div>
            <span className="text-xs text-on-surface-variant truncate">
              {role === 'customer'
                ? 'Road No. 12, Banjara Hills'
                : currentStore?.name || 'Sri Lakshmi Kirana'}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {onOpenTour && (
            <button
              onClick={onOpenTour}
              title="Interactive Demo Tour"
              aria-label="Interactive Demo Tour"
              className="flex items-center gap-1 bg-secondary text-on-secondary px-2.5 py-1.5 rounded-full text-xs font-bold hover:brightness-110 active:scale-95 transition-all shadow-xs"
            >
              <span className="material-symbols-outlined text-[16px]">play_circle</span>
              <span className="text-[11px]">Tour</span>
            </button>
          )}

          <button
            onClick={onResetData}
            title="Reset Demo Data"
            aria-label="Reset Demo Data"
            className="w-8 h-8 flex items-center justify-center text-on-surface-variant rounded-full hover:bg-surface-container active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">restart_alt</span>
          </button>

          <button
            onClick={onSwitchRole}
            className="flex items-center gap-1 bg-surface-container px-2 py-1.5 rounded-full text-xs font-semibold text-primary hover:bg-surface-container-high active:scale-95 transition-all shadow-xs"
          >
            <span className="material-symbols-outlined text-[16px]">swap_horiz</span>
            <span className="text-[11px]">Role</span>
          </button>
        </div>
      </div>
    </header>
  );
};
