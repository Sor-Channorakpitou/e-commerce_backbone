import { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { NavBar } from './components/NavBar';
import { ProductCard } from './components/ProductCard';
import { CartList } from './components/CartList';
import { CheckoutSummary } from './components/CheckoutSummary';
import { FetchDemo } from './components/FetchDemo';
import { DebounceSearchDemo } from './components/DebounceSearchDemo';
import { DiscountCouponForm } from './components/DiscountCouponForm';
import { INITIAL_PRODUCTS } from './data/products';
import { ShoppingCart, ShieldCheck, Check, Sparkles } from 'lucide-react';

/**
 * StoreContent: Inner application component
 * Sits strictly below AuthProvider and CartProvider so it can consume context freely.
 */
function StoreContent() {
  const { totalQuantity } = useCart();
  const [activeView, setActiveView] = useState<'store' | 'debounce-demo' | 'fetch-demo'>('store');

  return (
    <div className="app-container">
      {/* Navigation Bar with Auth & Cart Status */}
      <NavBar
        cartItemCount={totalQuantity}
        activeView={activeView}
        onSelectView={setActiveView}
      />

      {/* Architecture Proof Banner */}
      <aside className="arch-banner" aria-label="Architecture Status">
        <div className="arch-banner-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={16} color="#818cf8" />
            <span style={{ fontWeight: 600, color: '#e0e7ff' }}>Architecture Backbone:</span>
          </div>

          <div className="arch-pills">
            <span className="arch-pill active">
              <Check size={12} /> useLocalStorage (Theme & Cart)
            </span>
            <span className="arch-pill active">
              <Check size={12} /> useDebounce (500ms Delay)
            </span>
            <span className="arch-pill active">
              <Check size={12} /> Vitest + RTL (User Queries)
            </span>
            <span className="arch-pill active">
              <Check size={12} /> Pure Cart useReducer
            </span>
            <span className="arch-pill active">
              <Check size={12} /> Generic useFetch&lt;T&gt;
            </span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        {activeView === 'store' ? (
          <div className="store-grid">
            {/* Catalog Section */}
            <section id="catalog-section">
              <div className="section-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Sparkles size={20} color="#6366f1" />
                  <h1 className="section-title">Hardware & Peripheral Showcase</h1>
                </div>
                <p className="section-subtitle">
                  Interact with real dispatch buttons. Adding items updates the pure cart reducer without prop drilling.
                </p>
              </div>

              <div className="products-grid" id="products-grid">
                {INITIAL_PRODUCTS.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>

            {/* Sticky Sidebar: Cart Line Items & Checkout Summary */}
            <aside className="cart-sidebar" id="cart-sidebar">
              {/* Cart Items Box */}
              <div className="cart-card" id="cart-items-card">
                <div className="card-header-bar">
                  <h2 className="card-title">
                    <ShoppingCart size={18} color="#06b6d4" />
                    <span>Your Cart</span>
                  </h2>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Qty 0 removes line
                  </span>
                </div>

                {/* CartList receives NO PROPS carrying cart data */}
                <CartList />
              </div>

              {/* Checkout Summary Box receives NO PROPS carrying cart data */}
              <CheckoutSummary />
            </aside>
          </div>
        ) : activeView === 'debounce-demo' ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(320px, 1fr)', gap: '2rem', alignItems: 'start' }}>
            <DebounceSearchDemo />
            <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'sticky', top: '90px' }}>
              <DiscountCouponForm />
            </aside>
          </div>
        ) : (
          <FetchDemo />
        )}
      </main>
    </div>
  );
}

/**
 * Root App Component
 * 
 * Providers wrap the application at top level so all consumers sit strictly below.
 */
export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <StoreContent />
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
