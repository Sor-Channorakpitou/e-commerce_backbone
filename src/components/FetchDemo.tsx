import { useState, useEffect } from 'react';
import { useFetch } from '../hooks/useFetch';
import type { User } from '../types';
import { runCartReducerTests } from '../utils/cartReducerAudit';
import { Code2, CheckCircle, AlertCircle, RefreshCw, Terminal } from 'lucide-react';

export function FetchDemo() {
  const [endpoint, setEndpoint] = useState<'real' | 'simulated'>('real');
  
  // Real endpoint returns JSON matching User[] or simulated fallback
  const url =
    endpoint === 'real'
      ? 'https://jsonplaceholder.typicode.com/users'
      : 'https://httpstat.us/404'; // To demonstrate error state handling

  // CALL AS useFetch<User[]>
  const { data, loading, error } = useFetch<User[]>(url);

  // Reducer test results
  const [testResults, setTestResults] = useState<{ passed: boolean; logs: string[] } | null>(null);

  useEffect(() => {
    const results = runCartReducerTests();
    setTestResults(results);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Educational Architecture Card */}
      <div className="demo-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>
              Generic <span className="code-badge">useFetch&lt;T&gt;</span> Architecture Proof
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
              Audited for zero <code>any</code> types and strict compile-time null narrowing.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              className={`tab-btn ${endpoint === 'real' ? 'active' : ''}`}
              onClick={() => setEndpoint('real')}
            >
              Success Endpoint (200 OK)
            </button>
            <button
              type="button"
              className={`tab-btn ${endpoint === 'simulated' ? 'active' : ''}`}
              onClick={() => setEndpoint('simulated')}
            >
              Error Endpoint (404 Error)
            </button>
          </div>
        </div>

        {/* Code Explanation & Narrowing Proof */}
        <div style={{ background: '#0a0e17', borderRadius: '12px', padding: '1.25rem', border: '1px solid var(--border-subtle)', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: '#818cf8', fontSize: '0.85rem', fontWeight: 600 }}>
            <Code2 size={16} />
            <span>TypeScript Type Narrowing Verification:</span>
          </div>
          <pre style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: '#e0e7ff', overflowX: 'auto', lineHeight: 1.6 }}>
{`// 1. Invocation with generic type parameter
const { data, loading, error } = useFetch<User[]>('${url}');
// Type of data is inferred strictly as: User[] | null

// 2. TypeScript compile refusal:
// data.map(u => u.email) -> ❌ Error TS18047: 'data' is possibly 'null'.

// 3. Narrowing with null check:
if (data !== null) {
  // ✅ TypeScript successfully narrows data to User[]:
  return data.map((user: User) => user.email);
}`}
          </pre>
        </div>

        {/* Live Status View */}
        <div style={{ minHeight: '120px' }}>
          {loading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '2rem', color: 'var(--text-secondary)' }}>
              <div className="loading-spinner" />
              <span>Fetching typed data from endpoint...</span>
            </div>
          )}

          {error && (
            <div style={{ background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.3)', padding: '1.25rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <AlertCircle size={20} color="#f43f5e" />
              <div>
                <strong style={{ color: '#fecdd3' }}>Fetch Error Caught:</strong>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{error}</p>
              </div>
            </div>
          )}

          {/* CONFIRM DATA NARROWS CORRECTLY: inside `if (data)` block */}
          {data !== null && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.875rem', color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle size={16} />
                  Narrowed successfully: {data.length} users received typed as User[]
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Refreshed via useEffect AbortController
                </span>
              </div>

              <div className="users-table-container">
                <table className="users-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email (Typed Narrowing)</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Safe mapping after narrowing data */}
                    {data.slice(0, 5).map((user) => (
                      <tr key={user.id}>
                        <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                          #{user.id}
                        </td>
                        <td style={{ fontWeight: 600 }}>{user.name}</td>
                        <td style={{ fontFamily: 'var(--font-mono)', color: '#818cf8' }}>
                          {user.email}
                        </td>
                        <td>
                          <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 600 }}>
                            Active
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Cart Reducer Automated Test Runner Display */}
      <div className="demo-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Terminal size={20} color="#38bdf8" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>
              Cart Reducer Purity & Rule Audit Suite
            </h3>
          </div>
          <button
            type="button"
            className="tab-btn"
            style={{ padding: '0.3rem 0.7rem', fontSize: '0.75rem' }}
            onClick={() => setTestResults(runCartReducerTests())}
          >
            <RefreshCw size={12} style={{ marginRight: '4px' }} />
            Re-run Assertions
          </button>
        </div>

        <div style={{ background: '#090d16', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '1rem', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
          {testResults?.logs.map((log) => (
            <div key={log} style={{ padding: '3px 0', color: log.includes('FAIL') ? '#f43f5e' : '#a7f3d0' }}>
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
