import { useState, type FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, LogIn, Sparkles } from 'lucide-react';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SignInModal({ isOpen, onClose }: SignInModalProps) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    signIn(email);
    setEmail('');
    onClose();
  };

  const handleQuickSignIn = (quickEmail: string) => {
    signIn(quickEmail);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose} id="signin-modal-overlay">
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()} 
        id="signin-modal"
        role="dialog"
        aria-labelledby="modal-title"
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={20} color="#818cf8" />
            <h3 id="modal-title" style={{ fontSize: '1.2rem', fontWeight: 700 }}>
              Sign In to Store
            </h3>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="btn-remove-item"
            id="close-signin-modal"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="user-email-input" className="form-label">
              Email Address
            </label>
            <input
              id="user-email-input"
              type="email"
              className="form-input"
              placeholder="e.g. alex.coder@dev.io"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Or quick select a test account:
            </span>
            <div className="quick-profiles">
              <button
                type="button"
                className="quick-chip"
                id="quick-login-alex"
                onClick={() => handleQuickSignIn('alex.smith@architect.dev')}
              >
                alex.smith@architect.dev
              </button>
              <button
                type="button"
                className="quick-chip"
                id="quick-login-sarah"
                onClick={() => handleQuickSignIn('sarah.connor@cyber.io')}
              >
                sarah.connor@cyber.io
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn-checkout" 
            id="btn-submit-signin"
            style={{ margin: 0 }}
          >
            <LogIn size={18} />
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
