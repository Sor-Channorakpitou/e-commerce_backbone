# ArchitectShop • React + TypeScript Architecture Backbone

> **"Props got you here; architecture keeps you sane. Give your app a real backbone: a typed async state machine, a context that ends prop drilling, and a reducer that owns every cart rule in one pure function."**

---

## 💡 The Architectural Proof (One Sentence)
> **"By modeling state transitions with a discriminated-union action type and routing every quantity mutation through a pure reducer branch where `quantity <= 0` immediately filters the item out of the array, invalid intermediate states like an item with quantity -1 cannot exist in the type definition or runtime state."**

---

## 🛠️ Requirements & Architectural Pillars

### 1. Generic `useFetch<T>`
- **Strict Generic Signature**: `useFetch<T>(url: string): { data: T | null; loading: boolean; error: string | null }`
- **Zero `any` Types**: Audited for strict type safety.
- **Type Narrowing**: Without `if (data !== null)`, TypeScript refuses `data.map(...)` with `error TS18047: 'data' is possibly 'null'`.
- **Async Lifecycle**: Uses `AbortController` cleanup to cancel inflight requests on unmount.

### 2. Hand-Crafted `AuthContext`
- Hand-written from scratch (no boilerplates or black boxes).
- State: `user: User | null`, `isAuthenticated: boolean`.
- Actions: `signIn(email, name?)` and `signOut()`.
- Top-level provider wrapping the app.
- `NavBar` conditionally displays:
  - **Signed Out**: "Sign in" action modal.
  - **Signed In**: User avatar badge, `"Hi, {user.email}"`, and "Sign out" button.

### 3. Pure `CartContext` with `useReducer`
- **Discriminated-Union Actions**:
  ```typescript
  export type CartAction =
    | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'quantity'> }
    | { type: 'REMOVE_ITEM'; payload: { id: string } }
    | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
    | { type: 'CLEAR_CART' };
  ```
- **Pure Function Audit**:
  - Zero side effects: No `fetch`, no `localStorage`, no `console.log`.
  - Default branch strictly returns `state` untouched.
  - **Quantity Rule**: When quantity reaches 0 (or $\le 0$), the line item is completely purged from state.

### 4. Zero-Prop-Drilling `CheckoutSummary`
- Reads state directly from `useCart()` via `useContext`.
- **Zero props** carry cart data anywhere through the component tree.
- Computes units, subtotal, 8% tax, shipping, and grand total.

### 5. Theme System: Light & Dark Modes
- Includes high-contrast light mode with custom CSS variables and seamless sun/moon toggle in the navigation bar.

---

## 📋 Git Commit History Split Per Requirement

```bash
912e9c4 feat(theme): add light mode support with theme toggle and high-contrast styling
3bfbdac feat(checkout): add zero-prop-drilling CheckoutSummary and live product catalog
a5d8d6d feat(cart): implement pure CartContext useReducer with discriminated union actions
e694f79 feat(auth): add hand-written AuthContext and responsive NavBar
d58cbc6 feat(hooks): implement generic useFetch<T> hook with strict type narrowing
c66a526 feat(core): initialize React TypeScript project with clean design system
```

---

## 🚀 Getting Started Locally

```bash
# Install dependencies
npm install

# Run type check
npx tsc --noEmit

# Start development server
npm run dev

# Build production bundle
npm run build
```
