import { useState } from 'react';
import { useDebounce } from '../hooks/useDebounce';
import { INITIAL_PRODUCTS } from '../data/products';
import { Search, Clock, Zap, CheckCircle2, RefreshCw } from 'lucide-react';

export function DebounceSearchDemo() {
  const [rawInput, setRawInput] = useState('');
  const debouncedInput = useDebounce(rawInput, 500);

  // Filter products using the debounced value (simulating network search or costly filter)
  const filteredProducts = INITIAL_PRODUCTS.filter((product) => {
    const query = debouncedInput.trim().toLowerCase();
    if (!query) return true;
    return (
      product.name.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query)
    );
  });

  const isPending = rawInput !== debouncedInput;

  return (
    <div className="debounce-demo-container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header section */}
      <div className="section-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Clock size={24} color="#6366f1" />
          <h1 className="section-title" style={{ margin: 0 }}>
            useDebounce Hook Live Demonstration
          </h1>
        </div>
        <p className="section-subtitle">
          Observe how the raw input updates synchronously on every keystroke, while the debounced value
          waits 500ms for keystroke inactivity before committing.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="cart-card" style={{ padding: '1.5rem' }}>
        <label
          htmlFor="catalog-search-input"
          style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-main)' }}
        >
          Search Catalog
        </label>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Search
            size={18}
            style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }}
          />
          <input
            id="catalog-search-input"
            type="text"
            className="form-input"
            style={{ paddingLeft: '2.5rem', fontSize: '1rem', width: '100%' }}
            placeholder="Type rapidly (e.g., 'mechanical', 'gpu', 'monitor', 'keyboard')..."
            value={rawInput}
            onChange={(e) => setRawInput(e.target.value)}
          />
          {rawInput && (
            <button
              type="button"
              onClick={() => setRawInput('')}
              style={{
                position: 'absolute',
                right: '12px',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: '0.875rem',
              }}
              aria-label="Clear search input"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Side-by-Side Comparison Panels */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {/* Raw Value Card */}
        <div
          className="cart-card"
          style={{
            borderLeft: '4px solid #f59e0b',
            background: 'var(--bg-card)',
            padding: '1.25rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Zap size={18} color="#f59e0b" />
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Raw Input Value</h3>
            </div>
            <span
              style={{
                fontSize: '0.75rem',
                padding: '0.2rem 0.6rem',
                borderRadius: '9999px',
                background: '#fef3c7',
                color: '#92400e',
                fontWeight: 600,
              }}
            >
              Immediate (0ms)
            </span>
          </div>

          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            Current state of <code>rawInput</code>:
          </div>
          <div
            style={{
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              background: 'var(--bg-card-alt, rgba(0, 0, 0, 0.05))',
              fontFamily: 'monospace',
              fontSize: '1.1rem',
              fontWeight: 600,
              color: 'var(--text-main)',
              minHeight: '46px',
              display: 'flex',
              alignItems: 'center',
              wordBreak: 'break-all',
            }}
          >
            {rawInput ? `"${rawInput}"` : <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>[Empty string]</span>}
          </div>
          <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Characters: {rawInput.length} | Updates synchronously on every keystroke
          </div>
        </div>

        {/* Debounced Value Card */}
        <div
          className="cart-card"
          style={{
            borderLeft: `4px solid ${isPending ? '#6366f1' : '#10b981'}`,
            background: 'var(--bg-card)',
            padding: '1.25rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {isPending ? (
                <RefreshCw size={18} color="#6366f1" className="spin-animation" />
              ) : (
                <CheckCircle2 size={18} color="#10b981" />
              )}
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>
                Debounced Value
              </h3>
            </div>
            <span
              style={{
                fontSize: '0.75rem',
                padding: '0.2rem 0.6rem',
                borderRadius: '9999px',
                background: isPending ? '#e0e7ff' : '#d1fae5',
                color: isPending ? '#3730a3' : '#065f46',
                fontWeight: 600,
              }}
            >
              {isPending ? 'Waiting 500ms...' : 'Settled (500ms delay)'}
            </span>
          </div>

          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            Value returned by <code>useDebounce(rawInput, 500)</code>:
          </div>
          <div
            style={{
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              background: 'var(--bg-card-alt, rgba(0, 0, 0, 0.05))',
              fontFamily: 'monospace',
              fontSize: '1.1rem',
              fontWeight: 600,
              color: isPending ? '#6366f1' : '#10b981',
              minHeight: '46px',
              display: 'flex',
              alignItems: 'center',
              wordBreak: 'break-all',
            }}
          >
            {debouncedInput ? `"${debouncedInput}"` : <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>[Empty string]</span>}
          </div>
          <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Status: {isPending ? 'Timer running, pending final commit' : 'Synchronized with input'}
          </div>
        </div>
      </div>

      {/* Filtered Search Results Showcase */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 600, margin: 0 }}>
            Debounced Query Results ({filteredProducts.length} items)
          </h2>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Queries execute only against debounced value
          </span>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="cart-card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No products match "{debouncedInput}". Try searching "pro", "wireless", or "gpu".
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
            {filteredProducts.map((p) => (
              <div
                key={p.id}
                className="cart-card"
                style={{
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 600 }}>{p.name}</span>
                  <span style={{ color: '#06b6d4', fontWeight: 700 }}>${p.price}</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Category: {p.category}
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                  {p.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default DebounceSearchDemo;
