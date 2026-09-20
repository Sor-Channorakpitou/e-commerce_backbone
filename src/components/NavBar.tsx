import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { ShoppingBag, LogIn, LogOut, Layers, Sun, Moon } from 'lucide-react';
import { SignInModal } from './SignInModal';

interface NavBarProps {
  cartItemCount?: number;
  onOpenCart?: () => void;
  activeView: 'store' | 'debounce-demo' | 'fetch-demo';
  onSelectView: (view: 'store' | 'debounce-demo' | 'fetch-demo') => void;
}

export function NavBar({ cartItemCount = 0, onOpenCart, activeView, onSelectView }: NavBarProps) {
  const { user, isAuthenticated, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <header className="navbar" id="app-navbar">
        <div className="navbar-inner">
          {/* Brand Logo & Architecture Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <a href="#" className="nav-brand" id="nav-brand-logo">
              <div className="brand-badge">
                <Layers size={20} />
              </div>
              <div>
                <span className="brand-title">ArchitectShop</span>
                <span className="brand-subtitle">Strict TS</span>
              </div>
            </a>

            {/* Navigation Links */}
            <nav style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                id="nav-store-link"
                className={`tab-btn ${activeView === 'store' ? 'active' : ''}`}
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                onClick={() => onSelectView('store')}
              >
                Store & Cart
              </button>
              <button
                type="button"
                id="nav-debounce-demo-link"
                className={`tab-btn ${activeView === 'debounce-demo' ? 'active' : ''}`}
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                onClick={() => onSelectView('debounce-demo')}
              >
                useDebounce & Coupon Form
              </button>
              <button
                type="button"
                id="nav-fetch-demo-link"
                className={`tab-btn ${activeView === 'fetch-demo' ? 'active' : ''}`}
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                onClick={() => onSelectView('fetch-demo')}
              >
                useFetch&lt;T&gt; Demo
              </button>
            </nav>
          </div>

          {/* Right Actions: Theme Toggle, Cart & Auth */}
          <div className="nav-actions">
            {/* Theme Toggle Button */}
            <button
              type="button"
              className="theme-toggle-btn"
              id="theme-toggle-btn"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            {/* Cart Button */}
            <button
              type="button"
              className="cart-nav-btn"
              id="nav-cart-btn"
              onClick={onOpenCart}
              aria-label={`Cart with ${cartItemCount} items`}
            >
              <ShoppingBag size={18} />
              <span>Cart</span>
              <span className="cart-badge" id="nav-cart-badge">{cartItemCount}</span>
            </button>

            {/* Authentication State: Handled via AuthContext */}
            <div className="auth-nav-container" id="nav-auth-container">
              {isAuthenticated && user ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div className="user-greeting" id="nav-user-greeting">
                    <div className="user-avatar-circle">
                      {user.email.charAt(0).toUpperCase()}
                    </div>
                    <span id="nav-user-email">Hi, {user.email}</span>
                  </div>
                  <button
                    type="button"
                    onClick={signOut}
                    className="btn-signout"
                    id="nav-signout-btn"
                    title="Sign out"
                  >
                    <LogOut size={15} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                    Sign out
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="btn-signin"
                  id="nav-signin-btn"
                >
                  <LogIn size={16} />
                  <span>Sign in</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Modal for sign in */}
      <SignInModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
