import React, { useState, useEffect } from 'react';
import type { UserRole, Product, Store, InventoryEntry } from './types';
import {
  initDatabase,
  getAllProducts,
  getAllStores,
  getInventoryByStore,
  saveInventoryEntry,
  updateInventoryQuantity,
  resetDemoData,
  recordDemandEvent,
} from './services/database';

import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { VoiceModal } from './components/VoiceModal';
import { VoiceInventoryModal } from './components/VoiceInventoryModal';
import { AddProductModal } from './components/AddProductModal';
import { DemoTourModal } from './components/DemoTourModal';

import { WelcomeScreen } from './pages/WelcomeScreen';
import { CustomerHome } from './pages/CustomerHome';
import { NearbyStoresScreen } from './pages/NearbyStoresScreen';
import { MerchantDashboard } from './pages/MerchantDashboard';
import { MerchantInventory } from './pages/MerchantInventory';
import { DemandReportScreen } from './pages/DemandReportScreen';

export const App: React.FC = () => {
  const [role, setRole] = useState<UserRole | null>(() => {
    return (localStorage.getItem('kiranasaathi_role') as UserRole) || null;
  });
  const [currentTab, setCurrentTab] = useState<string>('customer_home');
  const [products, setProducts] = useState<Product[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [selectedStoreId, setSelectedStoreId] = useState<string>('store-001');
  const [storeInventory, setStoreInventory] = useState<InventoryEntry[]>([]);
  const [currentLocality, setCurrentLocality] = useState<string>('Road No. 12, Banjara Hills');

  // Navigation & Modal States
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isVoiceSearchOpen, setIsVoiceSearchOpen] = useState(false);
  const [isVoiceInventoryOpen, setIsVoiceInventoryOpen] = useState(false);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [addProductInitialProduct, setAddProductInitialProduct] = useState<Product | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isTourOpen, setIsTourOpen] = useState(false);

  // Initialize DB and load initial data
  useEffect(() => {
    async function setup() {
      setIsLoading(true);
      try {
        await initDatabase();
        const prods = await getAllProducts();
        const sts = await getAllStores();
        setProducts(prods);
        setStores(sts);

        // Load inventory for default store
        const inv = await getInventoryByStore(selectedStoreId);
        setStoreInventory(inv);
      } catch (err) {
        console.error('Failed to initialize database:', err);
      } finally {
        setIsLoading(false);
      }
    }
    setup();
  }, []);

  // Reload inventory whenever selected store changes
  useEffect(() => {
    async function loadStoreInv() {
      if (selectedStoreId) {
        const inv = await getInventoryByStore(selectedStoreId);
        setStoreInventory(inv);
      }
    }
    loadStoreInv();
  }, [selectedStoreId]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSelectRole = (newRole: UserRole) => {
    setRole(newRole);
    localStorage.setItem('kiranasaathi_role', newRole);
    if (newRole === 'customer') {
      setCurrentTab('customer_home');
    } else {
      setCurrentTab('merchant_dashboard');
    }
    setSelectedProduct(null);
  };

  const handleSwitchRole = () => {
    if (role === 'customer') {
      handleSelectRole('shopkeeper');
    } else {
      handleSelectRole('customer');
    }
    showToast(`Switched to ${role === 'customer' ? 'Merchant' : 'Shopper'} mode`);
  };

  const handleResetData = async () => {
    if (window.confirm('Reset all demo inventory and demand signals to initial state?')) {
      setIsLoading(true);
      await resetDemoData();
      const prods = await getAllProducts();
      const sts = await getAllStores();
      const inv = await getInventoryByStore(selectedStoreId);
      setProducts(prods);
      setStores(sts);
      setStoreInventory(inv);
      setSelectedProduct(null);
      setIsLoading(false);
      showToast('Demo data reset to fresh baseline!');
    }
  };

  // Inventory update handlers
  const handleUpdateQuantity = async (entryId: string, newQuantity: number) => {
    const entry = storeInventory.find((i) => i.id === entryId);
    if (!entry) return;

    await updateInventoryQuantity(entryId, newQuantity, entry.minimumStock);
    const updatedInv = await getInventoryByStore(selectedStoreId);
    setStoreInventory(updatedInv);
    showToast(`Updated stock to ${newQuantity} units`);
  };

  const handleToggleStockStatus = async (entryId: string) => {
    const entry = storeInventory.find((i) => i.id === entryId);
    if (!entry) return;

    const newQty = entry.availabilityStatus === 'out_of_stock' ? entry.minimumStock + 5 : 0;
    await updateInventoryQuantity(entryId, newQty, entry.minimumStock);
    const updatedInv = await getInventoryByStore(selectedStoreId);
    setStoreInventory(updatedInv);
    showToast(newQty === 0 ? 'Marked product out of stock' : `Restocked to ${newQty} units`);
  };

  // Add product to inventory
  const handleSaveNewProduct = async (
    entryData: Omit<InventoryEntry, 'id' | 'updatedAt'>
  ) => {
    const newEntry: InventoryEntry = {
      ...entryData,
      id: `inv-${Date.now()}`,
      updatedAt: new Date().toISOString(),
    };
    await saveInventoryEntry(newEntry);
    const updatedInv = await getInventoryByStore(selectedStoreId);
    setStoreInventory(updatedInv);
    showToast('Product added to inventory successfully!');
  };

  // Voice stock update handler
  const handleApplyVoiceStockUpdate = async (productId: string, newQuantity: number) => {
    const existing = storeInventory.find((i) => i.productId === productId);
    if (existing) {
      await updateInventoryQuantity(existing.id, newQuantity, existing.minimumStock);
    } else {
      // Create new inventory entry
      const prod = products.find((p) => p.id === productId);
      const newEntry: InventoryEntry = {
        id: `inv-${Date.now()}`,
        storeId: selectedStoreId,
        productId,
        quantity: newQuantity,
        unit: 'packets',
        minimumStock: 5,
        listedPrice: prod?.mrp ?? 40,
        availabilityStatus: newQuantity === 0 ? 'out_of_stock' : newQuantity <= 5 ? 'low_stock' : 'in_stock',
        updatedAt: new Date().toISOString(),
      };
      await saveInventoryEntry(newEntry);
    }

    const updatedInv = await getInventoryByStore(selectedStoreId);
    setStoreInventory(updatedInv);
    showToast(`Voice updated stock to ${newQuantity} units`);
  };

  // Voice Search query handler
  const handleVoiceSearchResult = (query: string) => {
    // Find closest product match
    const q = query.toLowerCase().trim();
    const matched = products.find((p) => {
      return (
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.variant.toLowerCase().includes(q) ||
        p.aliases.some((a) => a.toLowerCase().includes(q))
      );
    });

    if (matched) {
      setSelectedProduct(matched);
      showToast(`Found exact match: ${matched.name}`);
    } else {
      showToast(`No exact match for "${query}". Browse categories or register demand.`);
    }
  };

  // Demo Tour action helpers
  const handleTourRegisterDemand = async (productId: string) => {
    await recordDemandEvent({
      productId,
      localityId: currentLocality,
      eventType: 'out_of_stock',
    });
  };

  const handleTourAddStock = async (productId: string, qty: number) => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) return;
    const existing = storeInventory.find((i) => i.productId === productId);
    if (existing) {
      await updateInventoryQuantity(existing.id, qty, existing.minimumStock);
    } else {
      const newEntry: InventoryEntry = {
        id: `inv-${Date.now()}`,
        storeId: selectedStoreId,
        productId,
        quantity: qty,
        unit: 'packets',
        minimumStock: 5,
        listedPrice: prod.mrp,
        availabilityStatus: qty === 0 ? 'out_of_stock' : qty <= 5 ? 'low_stock' : 'in_stock',
        updatedAt: new Date().toISOString(),
      };
      await saveInventoryEntry(newEntry);
    }
    const updatedInv = await getInventoryByStore(selectedStoreId);
    setStoreInventory(updatedInv);
  };

  const currentStore = stores.find((s) => s.id === selectedStoreId) || stores[0] || null;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-surface px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary-fixed flex items-center justify-center text-primary mb-4 animate-bounce">
          <span className="material-symbols-outlined text-[36px]">storefront</span>
        </div>
        <h2 className="text-xl font-bold text-on-surface">KiranaSaathi</h2>
        <p className="text-xs text-on-surface-variant mt-1">Connecting neighborhood kirana stores...</p>
        <span className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mt-4"></span>
      </div>
    );
  }

  // Welcome / Role Selection Screen
  if (!role) {
    return (
      <>
        <WelcomeScreen
          onSelectRole={handleSelectRole}
          stores={stores}
          selectedStoreId={selectedStoreId}
          onSelectStore={(sId) => setSelectedStoreId(sId)}
          onOpenTour={() => {
            handleSelectRole('customer');
            setIsTourOpen(true);
          }}
        />
        <DemoTourModal
          isOpen={isTourOpen}
          onClose={() => setIsTourOpen(false)}
          products={products}
          stores={stores}
          onSelectRole={(r) => handleSelectRole(r)}
          onSelectProduct={(p) => setSelectedProduct(p)}
          onSelectTab={(t) => setCurrentTab(t)}
          onRegisterDemand={handleTourRegisterDemand}
          onAddStock={handleTourAddStock}
          onShowToast={showToast}
        />
      </>
    );
  }

  return (
    <div className="bg-surface text-on-surface min-h-screen font-sans antialiased selection:bg-primary-fixed selection:text-on-primary-fixed-variant">
      {/* Universal Sticky Header */}
      <Header
        role={role}
        currentStore={currentStore}
        onSwitchRole={handleSwitchRole}
        onResetData={handleResetData}
        onOpenTour={() => setIsTourOpen(true)}
        showBack={selectedProduct !== null || currentTab === 'merchant_reports'}
        onBack={() => {
          if (selectedProduct) setSelectedProduct(null);
          else if (currentTab === 'merchant_reports') setCurrentTab('merchant_dashboard');
        }}
        title={
          selectedProduct
            ? selectedProduct.name
            : role === 'customer'
            ? 'KiranaSaathi'
            : currentStore?.name
        }
      />

      {/* Floating Global Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-4 right-4 z-50 bg-inverse-surface text-inverse-on-surface px-4 py-3 rounded-2xl shadow-xl flex items-center justify-between text-xs font-semibold animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary-fixed text-[18px]">verified</span>
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-on-surface-variant hover:text-white">
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      )}

      {/* Main View Port Routing */}
      <main className="w-full">
        {role === 'customer' ? (
          /* Customer Experience */
          selectedProduct ? (
            <NearbyStoresScreen
              product={selectedProduct}
              onBack={() => setSelectedProduct(null)}
              currentLocality={currentLocality}
            />
          ) : (
            <CustomerHome
              products={products}
              onSelectProduct={(p) => setSelectedProduct(p)}
              onOpenVoiceSearch={() => setIsVoiceSearchOpen(true)}
              currentLocality={currentLocality}
              onChangeLocality={(loc) => setCurrentLocality(loc)}
            />
          )
        ) : (
          /* Shopkeeper Experience */
          currentStore && (
            <>
              {currentTab === 'merchant_dashboard' && (
                <MerchantDashboard
                  currentStore={currentStore}
                  products={products}
                  onOpenAddProduct={(prod) => {
                    setAddProductInitialProduct(prod || null);
                    setIsAddProductOpen(true);
                  }}
                  onOpenVoiceModal={() => setIsVoiceInventoryOpen(true)}
                  onNavigateToReport={() => setCurrentTab('merchant_reports')}
                  onNavigateToInventory={() => setCurrentTab('merchant_inventory')}
                />
              )}

              {currentTab === 'merchant_inventory' && (
                <MerchantInventory
                  currentStore={currentStore}
                  products={products}
                  inventory={storeInventory}
                  onUpdateQuantity={handleUpdateQuantity}
                  onToggleStockStatus={handleToggleStockStatus}
                  onOpenAddProduct={(prod) => {
                    setAddProductInitialProduct(prod || null);
                    setIsAddProductOpen(true);
                  }}
                  onOpenVoiceModal={() => setIsVoiceInventoryOpen(true)}
                />
              )}

              {currentTab === 'merchant_demand' && (
                <MerchantDashboard
                  currentStore={currentStore}
                  products={products}
                  onOpenAddProduct={(prod) => {
                    setAddProductInitialProduct(prod || null);
                    setIsAddProductOpen(true);
                  }}
                  onOpenVoiceModal={() => setIsVoiceInventoryOpen(true)}
                  onNavigateToReport={() => setCurrentTab('merchant_reports')}
                  onNavigateToInventory={() => setCurrentTab('merchant_inventory')}
                />
              )}

              {currentTab === 'merchant_reports' && (
                <DemandReportScreen
                  currentStore={currentStore}
                  products={products}
                  onOpenAddProduct={(prod) => {
                    setAddProductInitialProduct(prod);
                    setIsAddProductOpen(true);
                  }}
                  onBack={() => setCurrentTab('merchant_dashboard')}
                />
              )}
            </>
          )
        )}
      </main>

      {/* Material 3 Bottom Navigation Bar */}
      {!selectedProduct && (
        <BottomNav
          role={role}
          currentTab={currentTab}
          onTabChange={(tab) => {
            if (tab === 'customer_search') {
              setIsVoiceSearchOpen(true);
            } else if (tab === 'customer_demand') {
              showToast('Viewed community demand requests.');
            } else {
              setCurrentTab(tab);
            }
          }}
        />
      )}

      {/* Voice Search Modal for Customers */}
      <VoiceModal
        isOpen={isVoiceSearchOpen}
        onClose={() => setIsVoiceSearchOpen(false)}
        onConfirmSearch={handleVoiceSearchResult}
      />

      {/* Voice Inventory Modal for Shopkeepers */}
      {currentStore && (
        <VoiceInventoryModal
          isOpen={isVoiceInventoryOpen}
          onClose={() => setIsVoiceInventoryOpen(false)}
          products={products}
          inventory={storeInventory}
          onApplyStockUpdate={handleApplyVoiceStockUpdate}
          onFilterLowStock={() => {
            setCurrentTab('merchant_inventory');
          }}
        />
      )}

      {/* Add Product to Inventory Modal */}
      {currentStore && (
        <AddProductModal
          isOpen={isAddProductOpen}
          onClose={() => {
            setIsAddProductOpen(false);
            setAddProductInitialProduct(null);
          }}
          products={products}
          currentStoreId={currentStore.id}
          existingInventory={storeInventory}
          initialProduct={addProductInitialProduct}
          onSave={handleSaveNewProduct}
        />
      )}

      {/* Interactive Demo Tour Modal */}
      <DemoTourModal
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
        products={products}
        stores={stores}
        onSelectRole={(r) => handleSelectRole(r)}
        onSelectProduct={(p) => setSelectedProduct(p)}
        onSelectTab={(t) => setCurrentTab(t)}
        onRegisterDemand={handleTourRegisterDemand}
        onAddStock={handleTourAddStock}
        onShowToast={showToast}
      />
    </div>
  );
};

export default App;
