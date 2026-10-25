import React, { useState } from 'react';
import type { Store, Product, InventoryEntry } from '../types';
import { getFreshnessLabel, getAvailabilityBadgeStyle } from '../services/searchService';

interface MerchantInventoryProps {
  currentStore: Store;
  products: Product[];
  inventory: InventoryEntry[];
  onUpdateQuantity: (entryId: string, newQuantity: number) => Promise<void>;
  onToggleStockStatus: (entryId: string) => Promise<void>;
  onOpenAddProduct: (product?: Product) => void;
  onOpenVoiceModal: () => void;
}

export const MerchantInventory: React.FC<MerchantInventoryProps> = ({
  currentStore,
  products,
  inventory,
  onUpdateQuantity,
  onToggleStockStatus,
  onOpenAddProduct,
  onOpenVoiceModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'in_stock' | 'low_stock' | 'out_of_stock'>('all');
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [tempQty, setTempQty] = useState<number>(0);

  // Map products for fast lookup
  const productMap = new Map(products.map((p) => [p.id, p]));

  // Find low stock items for the top warning banner
  const lowStockItems = inventory.filter(
    (inv) => inv.availabilityStatus === 'low_stock' || (inv.quantity > 0 && inv.quantity <= inv.minimumStock)
  );

  // Filtered inventory
  const filteredInventory = inventory.filter((inv) => {
    const prod = productMap.get(inv.productId);
    if (!prod) return false;

    // Filter by stock status
    if (filter === 'in_stock' && inv.availabilityStatus !== 'in_stock') return false;
    if (filter === 'low_stock' && inv.availabilityStatus !== 'low_stock') return false;
    if (filter === 'out_of_stock' && inv.availabilityStatus !== 'out_of_stock') return false;

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const nameMatch = prod.name.toLowerCase().includes(q);
      const brandMatch = prod.brand.toLowerCase().includes(q);
      const variantMatch = prod.variant.toLowerCase().includes(q);
      return nameMatch || brandMatch || variantMatch;
    }

    return true;
  });

  const handleStepQuantity = async (entryId: string, currentQty: number, delta: number) => {
    const newQty = Math.max(0, currentQty + delta);
    await onUpdateQuantity(entryId, newQty);
  };

  const handleManualSaveQty = async (entryId: string) => {
    await onUpdateQuantity(entryId, Math.max(0, tempQty));
    setEditingEntryId(null);
  };

  return (
    <div className="flex flex-col relative w-full pt-16 pb-28 px-4 bg-surface min-h-screen max-w-md mx-auto">
      <div className="flex flex-col w-full space-y-4 pt-1">
        {/* Top Header & Store Info */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-on-surface">Store Inventory</h1>
            <p className="text-xs text-on-surface-variant">
              {currentStore.name} • {inventory.length} SKUs catalogued
            </p>
          </div>
          <button
            onClick={() => onOpenAddProduct()}
            className="h-10 px-3.5 rounded-xl bg-primary text-on-primary text-xs font-bold flex items-center gap-1 shadow-xs hover:bg-primary-container active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>Add Item</span>
          </button>
        </div>

        {/* Low-Stock Warning Banner */}
        {lowStockItems.length > 0 && (
          <div className="bg-secondary-fixed/30 border border-secondary-fixed rounded-2xl p-3.5 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-secondary-fixed-variant font-bold text-xs">
                <span className="material-symbols-outlined text-[18px]">warning</span>
                <span>Low Stock Warning ({lowStockItems.length} items)</span>
              </div>
              <button
                onClick={() => setFilter('low_stock')}
                className="text-[11px] font-bold text-primary underline"
              >
                View Low Stock
              </button>
            </div>
            <p className="text-[11px] text-on-surface leading-tight">
              Products below minimum threshold will show as "Low Stock" to nearby shoppers.
            </p>
          </div>
        )}

        {/* Search & Voice Command Bar */}
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center bg-surface-container-lowest rounded-full px-3 py-2 shadow-xs border border-surface-container">
            <span className="material-symbols-outlined text-[20px] text-on-surface-variant mr-2">search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search store inventory..."
              className="w-full bg-transparent text-xs font-medium text-on-surface placeholder:text-outline focus:outline-none"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-on-surface-variant">
                <span className="material-symbols-outlined text-[16px]">clear</span>
              </button>
            )}
          </div>

          {/* Voice Assistant Mic Button */}
          <button
            onClick={onOpenVoiceModal}
            title="Voice Stock Assistant"
            className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-xs active:scale-95 transition-all flex-shrink-0"
          >
            <span className="material-symbols-outlined text-[20px]">mic</span>
          </button>
        </div>

        {/* Stock Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              filter === 'all'
                ? 'bg-primary text-on-primary shadow-xs'
                : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
            }`}
          >
            All Items ({inventory.length})
          </button>
          <button
            onClick={() => setFilter('in_stock')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              filter === 'in_stock'
                ? 'bg-primary text-on-primary shadow-xs'
                : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
            }`}
          >
            In Stock
          </button>
          <button
            onClick={() => setFilter('low_stock')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              filter === 'low_stock'
                ? 'bg-secondary-container text-on-secondary-container shadow-xs'
                : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
            }`}
          >
            Low Stock ({lowStockItems.length})
          </button>
          <button
            onClick={() => setFilter('out_of_stock')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              filter === 'out_of_stock'
                ? 'bg-error-container text-on-error-container shadow-xs'
                : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
            }`}
          >
            Out of Stock
          </button>
        </div>

        {/* Inventory Item Cards */}
        {filteredInventory.length === 0 ? (
          <div className="p-8 text-center bg-surface-container-lowest rounded-2xl border border-surface-container">
            <span className="material-symbols-outlined text-[32px] text-on-surface-variant">inventory_2</span>
            <h4 className="text-sm font-bold text-on-surface mt-2">No matching products found</h4>
            <p className="text-xs text-on-surface-variant mt-1">
              Add products using the "+ Add Item" button or speak a command like "Add 10 packets of milk".
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredInventory.map((inv) => {
              const product = productMap.get(inv.productId);
              if (!product) return null;

              const badgeStyle = getAvailabilityBadgeStyle(inv.availabilityStatus);
              const freshness = getFreshnessLabel(inv.updatedAt);
              const isEditing = editingEntryId === inv.id;

              return (
                <div
                  key={inv.id}
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
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${badgeStyle.bgClass} ${badgeStyle.textClass}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${badgeStyle.dotClass}`}></span>
                          {inv.availabilityStatus === 'in_stock' && 'In Stock'}
                          {inv.availabilityStatus === 'low_stock' && 'Low Stock'}
                          {inv.availabilityStatus === 'out_of_stock' && 'Out of Stock'}
                        </span>
                        <span className="text-[10px] text-on-surface-variant">Min alert: {inv.minimumStock}</span>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className="text-base font-bold text-primary">₹{inv.listedPrice || product.mrp}</span>
                      <span className="text-[10px] text-on-surface-variant block">Price</span>
                    </div>
                  </div>

                  {/* Quantity Stepper & Controls */}
                  <div className="flex items-center justify-between pt-2 border-t border-surface-container-low">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-on-surface-variant font-medium">Stock:</span>
                      {isEditing ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min="0"
                            value={tempQty}
                            onChange={(e) => setTempQty(parseInt(e.target.value, 10) || 0)}
                            className="w-14 px-2 py-1 bg-surface-container rounded-lg text-xs font-bold text-center"
                          />
                          <button
                            onClick={() => handleManualSaveQty(inv.id)}
                            className="p-1 rounded bg-primary text-on-primary text-xs"
                          >
                            <span className="material-symbols-outlined text-[16px]">check</span>
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingEntryId(inv.id);
                            setTempQty(inv.quantity);
                          }}
                          className="flex items-center gap-1 px-2 py-0.5 rounded bg-surface-container hover:bg-surface-container-high transition-colors text-xs font-bold text-on-surface"
                        >
                          <span>{inv.quantity} {inv.unit}</span>
                          <span className="material-symbols-outlined text-[14px] text-on-surface-variant">edit</span>
                        </button>
                      )}
                    </div>

                    {/* Stepper Buttons (- 1 +) */}
                    <div className="flex items-center gap-1 bg-surface-container-low rounded-xl p-1 border border-surface-container">
                      <button
                        onClick={() => handleStepQuantity(inv.id, inv.quantity, -1)}
                        className="w-8 h-8 rounded-lg bg-surface-container-lowest flex items-center justify-center font-bold text-primary active:scale-90 transition-transform shadow-2xs"
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="w-9 text-center text-xs font-black text-on-surface">
                        {inv.quantity}
                      </span>
                      <button
                        onClick={() => handleStepQuantity(inv.id, inv.quantity, 1)}
                        className="w-8 h-8 rounded-lg bg-surface-container-lowest flex items-center justify-center font-bold text-primary active:scale-90 transition-transform shadow-2xs"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    {/* Fast Out-of-Stock Toggle */}
                    <button
                      onClick={() => onToggleStockStatus(inv.id)}
                      className={`h-8 px-2.5 rounded-lg text-[11px] font-bold transition-all ${
                        inv.availabilityStatus === 'out_of_stock'
                          ? 'bg-primary-fixed text-on-primary-fixed-variant hover:bg-primary-fixed-dim'
                          : 'bg-surface-container text-on-surface-variant hover:text-error'
                      }`}
                    >
                      {inv.availabilityStatus === 'out_of_stock' ? 'Restock' : 'Mark Out'}
                    </button>
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-on-surface-variant pt-0.5">
                    <span>Last updated: {freshness}</span>
                    <span>Threshold: {inv.minimumStock} {inv.unit}</span>
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
