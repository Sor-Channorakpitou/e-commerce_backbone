import { cartReducer } from '../context/CartContext';
import type { CartState } from '../types';

/**
 * Pure Reducer Logic In-Browser Verifier
 * Used by FetchDemo UI to demonstrate architecture proofs directly on the page without importing Vitest into client bundles.
 */
export function runCartReducerTests(): { passed: boolean; logs: string[] } {
  const logs: string[] = [];
  let allPassed = true;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      logs.push(`✅ PASS: ${testName}`);
    } else {
      logs.push(`❌ FAIL: ${testName}`);
      allPassed = false;
    }
  }

  // 1. Test ADD_ITEM creates item with quantity 1
  const state0: CartState = { items: [] };
  const state1 = cartReducer(state0, {
    type: 'ADD_ITEM',
    payload: { id: 'p1', name: 'Item 1', price: 100 },
  });
  assert(
    state1.items.length === 1 && state1.items[0].quantity === 1,
    'ADD_ITEM adds new item with quantity 1'
  );

  // 2. Test ADD_ITEM on existing item increments quantity
  const state2 = cartReducer(state1, {
    type: 'ADD_ITEM',
    payload: { id: 'p1', name: 'Item 1', price: 100 },
  });
  assert(
    state2.items.length === 1 && state2.items[0].quantity === 2,
    'ADD_ITEM on existing item increments quantity to 2'
  );

  // 3. Test UPDATE_QUANTITY updates quantity
  const state3 = cartReducer(state2, {
    type: 'UPDATE_QUANTITY',
    payload: { id: 'p1', quantity: 5 },
  });
  assert(
    state3.items[0].quantity === 5,
    'UPDATE_QUANTITY updates quantity to 5'
  );

  // 4. Test UPDATE_QUANTITY to 0 REMOVES the line item!
  const state4 = cartReducer(state3, {
    type: 'UPDATE_QUANTITY',
    payload: { id: 'p1', quantity: 0 },
  });
  assert(
    state4.items.length === 0,
    'UPDATE_QUANTITY with quantity 0 removes the line completely'
  );

  // 5. Test UPDATE_QUANTITY with negative quantity also removes item
  const stateWithItem: CartState = {
    items: [{ id: 'p2', name: 'Item 2', price: 50, quantity: 1 }],
  };
  const stateNegative = cartReducer(stateWithItem, {
    type: 'UPDATE_QUANTITY',
    payload: { id: 'p2', quantity: -1 },
  });
  assert(
    stateNegative.items.length === 0,
    'UPDATE_QUANTITY <= 0 purges item, preventing negative quantity'
  );

  // 6. Test REMOVE_ITEM
  const state5 = cartReducer(stateWithItem, {
    type: 'REMOVE_ITEM',
    payload: { id: 'p2' },
  });
  assert(
    state5.items.length === 0,
    'REMOVE_ITEM filters out targeted item'
  );

  // 7. Test default case returns state untouched
  // @ts-expect-error Testing invalid action type fallback
  const stateUntouched = cartReducer(stateWithItem, { type: 'UNKNOWN_ACTION' });
  assert(
    stateUntouched === stateWithItem,
    'Unknown action returns previous state reference untouched'
  );

  // 8. Test purity (original state was not mutated)
  assert(
    stateWithItem.items.length === 1 && stateWithItem.items[0].quantity === 1,
    'Reducer is pure: original state object was never mutated'
  );

  return { passed: allPassed, logs };
}
