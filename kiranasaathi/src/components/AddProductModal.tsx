import React, { useState, useEffect } from 'react';
import type { Product, InventoryEntry } from '../types';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  currentStoreId: string;
  existingInventory: InventoryEntry[];
  initialProduct?: Product | null;
  onSave: (entry: Omit<InventoryEntry, 'id' | 'updatedAt'>) => Promise<void>;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  products,
  currentStoreId,
  existingInventory,
  initialProduct,
  onSave,
}) => {
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(10);
  const [unit, setUnit] = useState<string>('packets');
  const [minimumStock, setMinimumStock] = useState<number>(5);
  const [listedPrice, setListedPrice] = useState<number>(45);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (initialProduct) {
      setSelectedProductId(initialProduct.id);
      setListedPrice(initialProduct.mrp);
      if (initialProduct.packageSize.includes('ml') || initialProduct.packageSize.includes('L')) {
        setUnit('pouches');
      } else if (initialProduct.packageSize.includes('kg') || initialProduct.packageSize.includes('g')) {
        setUnit('packs');
      }
    } else if (products.length > 0 && !selectedProductId) {
      setSelectedProductId(products[0].id);
      setListedPrice(products[0].mrp);
    }
  }, [initialProduct, products, isOpen]);

  if (!isOpen) return null;

  const currentProduct = products.find((p) => p.id === selectedProductId) || initialProduct;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId || !currentStoreId) {
      setErrorMsg('Please select a product');
      return;
    }

    if (quantity < 0) {
      setErrorMsg('Quantity cannot be negative');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const availabilityStatus =
        quantity === 0 ? 'out_of_stock' : quantity <= minimumStock ? 'low_stock' : 'in_stock';

      await onSave({
        storeId: currentStoreId,
        productId: selectedProductId,
        quantity,
        unit,
        minimumStock,
        listedPrice,
        availabilityStatus,
      });

      setIsSubmitting(false);
      onClose();
    } catch {
      setIsSubmitting(false);
      setErrorMsg('Failed to save inventory entry. Please try again.');
    }
  };

  // Filter out products already in store inventory if not editing
  const existingProductIds = new Set(existingInventory.map((i) => i.productId));
  const availableProducts = products.filter(
    (p) => !existingProductIds.has(p.id) || p.id === selectedProductId
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-surface-container-lowest rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl flex flex-col gap-4 border border-surface-container-high max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-surface-container pb-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-primary-fixed flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[22px]">add_box</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-on-surface">Add Product to Inventory</h3>
              <p className="text-xs text-on-surface-variant">Update local store availability</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-error-container text-on-error-container text-xs flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Product selector / preview */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
              Standardized Product
            </label>
            {initialProduct ? (
              <div className="flex items-center gap-3 p-3 bg-surface-container-low rounded-xl border border-surface-container-high">
                <img
                  src={initialProduct.image}
                  alt={initialProduct.name}
                  className="w-12 h-12 rounded-lg object-cover bg-surface-container"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-bold text-on-surface truncate">{initialProduct.name}</h4>
                  <p className="text-xs text-on-surface-variant">
                    {initialProduct.brand} • {initialProduct.variant} ({initialProduct.packageSize})
                  </p>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed">
                  From Demand
                </span>
              </div>
            ) : (
              <select
                value={selectedProductId}
                onChange={(e) => {
                  setSelectedProductId(e.target.value);
                  const p = products.find((prod) => prod.id === e.target.value);
                  if (p) setListedPrice(p.mrp);
                }}
                className="w-full px-4 py-3 bg-surface-container-low border border-surface-container-highest rounded-xl text-sm font-medium text-on-surface focus:outline-none focus:border-primary"
              >
                {availableProducts.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.packageSize}) - MRP ₹{p.mrp}
                  </option>
                ))}
              </select>
            )}
          </div>

          {currentProduct && !initialProduct && (
            <div className="flex items-center gap-3 p-2.5 bg-surface-container-low rounded-xl">
              <img
                src={currentProduct.image}
                alt={currentProduct.name}
                className="w-10 h-10 rounded-lg object-cover bg-surface-container"
              />
              <div className="text-xs min-w-0">
                <span className="font-semibold text-on-surface truncate block">{currentProduct.name}</span>
                <span className="text-on-surface-variant">{currentProduct.category} • MRP ₹{currentProduct.mrp}</span>
              </div>
            </div>
          )}

          {/* Initial Stock Quantity & Unit */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                Initial Stock
              </label>
              <div className="flex items-center bg-surface-container-low border border-surface-container-highest rounded-xl p-1">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(0, quantity - 1))}
                  className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-primary font-bold active:scale-95"
                >
                  -
                </button>
                <input
                  type="number"
                  min="0"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 0)}
                  className="w-full text-center bg-transparent font-bold text-sm text-on-surface focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-primary font-bold active:scale-95"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                Unit of Measure
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-3 py-2.5 bg-surface-container-low border border-surface-container-highest rounded-xl text-sm font-medium text-on-surface focus:outline-none focus:border-primary"
              >
                <option value="packets">packets</option>
                <option value="pouches">pouches</option>
                <option value="packs">packs</option>
                <option value="bottles">bottles</option>
                <option value="units">units</option>
                <option value="kg">kg</option>
                <option value="boxes">boxes</option>
              </select>
            </div>
          </div>

          {/* Min Stock Alert Threshold & Listed Price */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                Low-Stock Threshold
              </label>
              <input
                type="number"
                min="1"
                value={minimumStock}
                onChange={(e) => setMinimumStock(parseInt(e.target.value, 10) || 1)}
                className="w-full px-3 py-2.5 bg-surface-container-low border border-surface-container-highest rounded-xl text-sm font-medium text-on-surface focus:outline-none focus:border-primary"
              />
              <span className="text-[10px] text-on-surface-variant">Alert triggers at or below this</span>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                Selling Price (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-sm font-bold text-on-surface-variant">₹</span>
                <input
                  type="number"
                  min="0"
                  value={listedPrice}
                  onChange={(e) => setListedPrice(parseFloat(e.target.value) || 0)}
                  className="w-full pl-7 pr-3 py-2.5 bg-surface-container-low border border-surface-container-highest rounded-xl text-sm font-medium text-on-surface focus:outline-none focus:border-primary"
                />
              </div>
              <span className="text-[10px] text-on-surface-variant">
                MRP: ₹{currentProduct ? currentProduct.mrp : 0}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-12 rounded-xl bg-surface-container text-on-surface text-sm font-semibold hover:bg-surface-container-high transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 h-12 rounded-xl bg-primary text-on-primary text-sm font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-98 transition-all disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[18px]">save</span>
              <span>{isSubmitting ? 'Saving...' : 'Add to Inventory'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
