import React from 'react';
import type { UserRole } from '../types';

interface BottomNavProps {
  role: UserRole;
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ role, currentTab, onTabChange }) => {
  const customerTabs = [
    { id: 'customer_home', label: 'Discover', icon: 'explore' },
    { id: 'customer_search', label: 'Search', icon: 'search' },
    { id: 'customer_categories', label: 'Categories', icon: 'grid_view' },
    { id: 'customer_demand', label: 'My Requests', icon: 'notifications_active' },
  ];

  const merchantTabs = [
    { id: 'merchant_dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'merchant_inventory', label: 'Inventory', icon: 'inventory_2' },
    { id: 'merchant_demand', label: 'Demand', icon: 'trending_up' },
    { id: 'merchant_reports', label: 'Reports', icon: 'receipt_long' },
  ];

  const tabs = role === 'customer' ? customerTabs : merchantTabs;

  return (
    <nav className="fixed bottom-0 w-full z-40 pb-safe bg-surface/95 backdrop-blur-xl border-t border-surface-container shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      <div className="flex justify-around items-center h-16 px-1">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center gap-0.5 min-w-[56px] min-h-[48px] py-1 transition-all ${
                isActive
                  ? 'text-primary'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <div
                className={`w-12 h-7 rounded-full flex items-center justify-center transition-all ${
                  isActive ? 'bg-primary-fixed text-on-primary-fixed-variant shadow-xs scale-105' : ''
                }`}
              >
                <span
                  className="material-symbols-outlined text-[22px]"
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {tab.icon}
                </span>
              </div>
              <span className={`text-[11px] tracking-tight ${isActive ? 'font-bold' : 'font-medium'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
      {/* Android Gesture Bar */}
      <div className="flex justify-center items-center pb-1 pt-0.5 pointer-events-none">
        <div className="w-28 h-1 bg-on-surface-variant/30 rounded-full"></div>
      </div>
    </nav>
  );
};
