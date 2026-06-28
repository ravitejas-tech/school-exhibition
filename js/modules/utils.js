/* ============================================================
   Shared utilities
   ============================================================ */

/** Single shared reduced-motion query, used across modules. */
export const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

/** Trailing debounce — delays `fn` until `wait`ms after the last call. */
export function debounce(fn, wait) {
  let t;
  return function () {
    const ctx = this, args = arguments;
    clearTimeout(t);
    t = setTimeout(function () { fn.apply(ctx, args); }, wait);
  };
}
