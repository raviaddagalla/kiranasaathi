import React, { useState } from 'react';
import type { Product } from '../types';

interface CustomerHomeProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onOpenVoiceSearch: () => void;
  currentLocality: string;
  onChangeLocality: (locality: string) => void;
}

export const CustomerHome: React.FC<CustomerHomeProps> = ({
  products,
  onSelectProduct,
  onOpenVoiceSearch,
  currentLocality,
  onChangeLocality,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showLocalityModal, setShowLocalityModal] = useState(false);

  const localities = [
    'Road No. 12, Banjara Hills',
    'Road No. 10, Banjara Hills',
    'Anand Nagar Colony',
    'Mithila Nagar',
    'Hilltop Colony',
  ];

  const categories = [
    { id: 'Milk & Dairy', label: 'Milk & Dairy', icon: 'water_drop', count: 9 },
    { id: 'Bread & Bakery', label: 'Bread & Bakery', icon: 'bakery_dining', count: 6 },
    { id: 'Snacks & Biscuits', label: 'Snacks & Biscuits', icon: 'cookie', count: 12 },
    { id: 'Rice & Flour', label: 'Rice & Flour', icon: 'grain', count: 8 },
    { id: 'Cooking Essentials', label: 'Cooking Essentials', icon: 'egg_alt', count: 15 },
    { id: 'Spices & Masala', label: 'Spices & Masala', icon: 'grocery', count: 7 },
    { id: 'Beverages', label: 'Beverages', icon: 'local_cafe', count: 11 },
    { id: 'Personal Care', label: 'Personal Care', icon: 'soap', count: 5 },
    { id: 'Household', label: 'Household', icon: 'cleaning_services', count: 4 },
  ];

  // Recently searched items for quick repeat discovery
  const recentProductIds = ['prod-001', 'prod-003', 'prod-005'];
  const recentProducts = recentProductIds
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Product => p !== undefined);

  // Search filter
  const filteredProducts = products.filter((p) => {
    if (selectedCategory && p.category !== selectedCategory) return false;
    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase().trim();
    const nameMatch = p.name.toLowerCase().includes(query);
    const brandMatch = p.brand.toLowerCase().includes(query);
    const variantMatch = p.variant.toLowerCase().includes(query);
    const aliasMatch = p.aliases.some((a) => a.toLowerCase().includes(query));

    return nameMatch || brandMatch || variantMatch || aliasMatch;
  });

  return (
    <div className="flex flex-col relative w-full pt-16 pb-28 px-4 bg-surface min-h-screen max-w-md mx-auto">
      <div className="flex flex-col w-full space-y-4 pt-1">
        {/* Top Greeting & Locality Quick-Selector */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-bold text-on-surface">Namaste, Ananya</span>
              <span className="text-xl inline-block animate-bounce">👋</span>
            </div>
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed text-xs font-bold">
              <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                bolt
              </span>
              <span>Hyperlocal Live</span>
            </div>
          </div>

          {/* Active Location Banner Chip */}
          <button
            onClick={() => setShowLocalityModal(true)}
            className="flex items-center justify-between w-full bg-surface-container-low px-3 py-2.5 rounded-2xl shadow-xs hover:bg-surface-container transition-all active:scale-[0.99] text-left border border-surface-container"
            type="button"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-[18px]">pin_drop</span>
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-on-surface truncate">{currentLocality}</span>
                  <span className="material-symbols-outlined text-[16px] text-on-surface-variant flex-shrink-0">
                    arrow_drop_down
                  </span>
                </div>
                <span className="text-[11px] text-on-surface-variant truncate">Hyderabad · within 1.2 km radius</span>
              </div>
            </div>
            <span className="text-[11px] font-bold text-primary px-2.5 py-1 rounded-lg bg-surface-container-lowest shadow-xs flex-shrink-0 ml-2">
              Change
            </span>
          </button>
        </div>

        {/* Omnipresent Search Bar with Voice Button */}
        <div className="relative flex flex-col gap-1.5">
          <div className="flex items-center bg-surface-container-lowest rounded-full p-1.5 shadow-md border border-surface-container">
            <div className="flex items-center justify-center pl-3 pr-2 text-on-surface-variant">
              <span className="material-symbols-outlined text-[22px]">search</span>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for milk, bread, atta, or spices..."
              className="w-full bg-transparent text-sm font-medium text-on-surface placeholder:text-outline focus:outline-none py-2 pr-2 min-h-[44px]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[18px]">clear</span>
              </button>
            )}
            {/* Voice Mic Trigger Button */}
            <button
              onClick={onOpenVoiceSearch}
              aria-label="Voice Search in English, Hindi, or Telugu"
              className="relative flex items-center justify-center w-11 h-11 rounded-full bg-secondary-fixed text-on-secondary-fixed shadow-sm active:scale-95 transition-transform flex-shrink-0"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                mic
              </span>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary"></span>
              </span>
            </button>
          </div>

          {/* Multilingual Voice Badge Prompt */}
          <div className="flex items-center justify-between px-3 text-on-surface-variant text-[11px]">
            <span className="flex items-center gap-1 font-medium">
              <span className="material-symbols-outlined text-[14px] text-primary">translate</span>
              <span>Tap mic to speak in English / हिन्दी / తెలుగు</span>
            </span>
            <span className="font-bold text-primary">Instant Kirana Match</span>
          </div>
        </div>

        {/* Real-time search suggestions dropdown if typing */}
        {searchQuery.trim().length > 0 && (
          <div className="bg-surface-container-lowest rounded-2xl p-2 shadow-lg border border-surface-container space-y-1">
            <div className="px-3 py-1.5 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
              Matching Grocery Items ({filteredProducts.length})
            </div>
            {filteredProducts.length === 0 ? (
              <div className="p-4 text-center">
                <p className="text-sm font-semibold text-on-surface">No exact product match found</p>
                <p className="text-xs text-on-surface-variant mt-1">
                  Try searching with brand or variant name (e.g. "Heritage", "Britannia", "Atta")
                </p>
              </div>
            ) : (
              filteredProducts.slice(0, 5).map((p) => (
                <button
                  key={p.id}
                  onClick={() => onSelectProduct(p)}
                  className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-surface-container-low transition-colors text-left"
                >
                  <img src={p.image} alt={p.name} className="w-12 h-12 rounded-lg object-cover bg-surface-container flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-primary">{p.brand}</span>
                      <span className="text-xs text-on-surface-variant">• {p.packageSize}</span>
                    </div>
                    <h4 className="text-sm font-bold text-on-surface truncate">{p.name}</h4>
                    <span className="text-xs font-bold text-on-surface">₹{p.mrp}</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-primary flex-shrink-0">
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </div>
                </button>
              ))
            )}
          </div>
        )}

        {/* Recently Searched Items Carousel */}
        {!searchQuery && (
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-primary">history</span>
                <h2 className="text-sm font-bold text-on-surface">Recently Searched</h2>
              </div>
              <span className="text-[11px] text-on-surface-variant font-medium">Banjara Hills</span>
            </div>
            <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-4 px-4 pb-1">
              {recentProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => onSelectProduct(product)}
                  className="flex-shrink-0 w-64 bg-surface-container-lowest rounded-2xl p-3.5 shadow-xs border border-surface-container flex flex-col justify-between gap-3 cursor-pointer hover:shadow-sm active:scale-[0.99] transition-all"
                >
                  <div className="flex items-start gap-2.5">
                    <div className="w-12 h-12 rounded-xl bg-surface-container-low flex items-center justify-center flex-shrink-0 overflow-hidden">
                      <img className="w-full h-full object-cover" src={product.image} alt={product.name} />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-bold text-on-surface truncate">{product.name}</span>
                      <span className="text-xs text-on-surface-variant">{product.packageSize}</span>
                      <span className="text-xs font-bold text-primary mt-0.5">₹{product.mrp}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-surface-container-low">
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary-fixed text-on-primary-fixed-variant text-[11px] font-bold">
                      <span className="material-symbols-outlined text-[14px]">store</span>
                      <span>Find nearby stores</span>
                    </div>
                    <button className="w-7 h-7 rounded-full bg-surface-container-low flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-colors">
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3x3 Category Grid */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-on-surface">Categories</h2>
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory(null)}
                className="text-xs font-bold text-primary hover:underline"
              >
                Clear filter
              </button>
            )}
          </div>
          <div className="grid grid-cols-3 gap-2.5">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(isSelected ? null : cat.id)}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all text-center min-h-[88px] ${
                    isSelected
                      ? 'bg-primary-fixed border-primary text-on-primary-fixed-variant shadow-xs scale-102 font-bold'
                      : 'bg-surface-container-lowest border-surface-container text-on-surface hover:bg-surface-container-low'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-1.5 ${
                    isSelected ? 'bg-primary text-on-primary' : 'bg-surface-container text-primary'
                  }`}>
                    <span className="material-symbols-outlined text-[20px]">{cat.icon}</span>
                  </div>
                  <span className="text-xs font-semibold leading-tight line-clamp-1">{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Popular Grocery Essentials Feed */}
        <div className="flex flex-col gap-2.5 pt-1">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-on-surface">
              {selectedCategory ? `${selectedCategory} Products` : 'Everyday Kirana Essentials'}
            </h2>
            <span className="text-xs text-on-surface-variant">{filteredProducts.length} items</span>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => onSelectProduct(product)}
                className="bg-surface-container-lowest p-3 rounded-2xl shadow-xs border border-surface-container flex items-center justify-between gap-3 cursor-pointer hover:shadow-sm active:scale-[0.99] transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-14 h-14 rounded-xl object-cover bg-surface-container flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-primary">{product.brand}</span>
                      <span className="text-xs text-on-surface-variant">• {product.packageSize}</span>
                    </div>
                    <h3 className="text-sm font-bold text-on-surface truncate">{product.name}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-sm font-bold text-on-surface">₹{product.mrp}</span>
                      <span className="text-[11px] text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full">
                        {product.variant}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectProduct(product);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold flex items-center gap-1 shadow-xs hover:bg-primary-container active:scale-95 transition-all flex-shrink-0"
                >
                  <span>Locate</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Locality Selector Modal */}
      {showLocalityModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in">
          <div className="w-full max-w-sm bg-surface-container-lowest rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl flex flex-col gap-3 border border-surface-container">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-on-surface">Select Delivery / Search Area</h3>
              <button
                onClick={() => setShowLocalityModal(false)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <p className="text-xs text-on-surface-variant">
              KiranaSaathi discovers stores carrying exact inventory within walking radius.
            </p>
            <div className="flex flex-col gap-1.5 mt-2">
              {localities.map((loc) => (
                <button
                  key={loc}
                  onClick={() => {
                    onChangeLocality(loc);
                    setShowLocalityModal(false);
                  }}
                  className={`w-full text-left px-3.5 py-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-between ${
                    currentLocality === loc
                      ? 'bg-primary-fixed text-on-primary-fixed-variant font-bold'
                      : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
                  }`}
                >
                  <span>{loc}</span>
                  {currentLocality === loc && (
                    <span className="material-symbols-outlined text-[18px]">check</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
