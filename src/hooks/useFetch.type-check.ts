import { useFetch } from './useFetch';
import type { User } from '../types';

/**
 * Compile-Time Type Assertion Proof
 * 
 * Requirement:
 * "Make useFetch generic: useFetch<T>(url) returning { data: T | null; loading: boolean; error: string | null }
 * —call it as useFetch<User[]> and confirm data narrows correctly.
 * confirm TypeScript refuses data.map(...) without the null check."
 */

export function DemonstrateTypeNarrowingProof() {
  const { data } = useFetch<User[]>('/api/users');

  // PROOF: Calling data.map(...) directly without null check causes:
  // error TS18047: 'data' is possibly 'null'.
  // @ts-expect-error TS18047: data is User[] | null, so mapping directly without checking is refused:
  const _refused = data.map((u) => u.email);

  // 2. TypeScript strictly enforces a null check before allowing `.map()`:
  if (data !== null) {
    // Here, TypeScript automatically narrows `data` from `User[] | null` to `User[]`:
    const validEmails: string[] = data.map((user: User) => user.email);
    return validEmails;
  }

  return [];
}
