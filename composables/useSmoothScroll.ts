import { ScrollController, type ScrollEnv } from '~/utils/scrollController';
import {
  computeSectionTarget,
  documentOffsetTop,
  isInterruptionKey,
  parseHash,
} from '~/utils/scrollMath';

/**
 * Browser environment adapter for `ScrollController`.
 *
 * Every access to `window`/`document` happens inside the functions below, so
 * importing this module on the server is safe.
 */
function createBrowserEnv(): ScrollEnv {
  let savedBehavior: string | null = null;

  return {
    getScrollY() {
      return window.scrollY ?? window.pageYOffset ?? 0;
    },
    setScrollY(y) {
      window.scrollTo(0, y);
    },
    getMaxScroll() {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      return max > 0 ? max : 0;
    },
    now() {
      return typeof performance !== 'undefined' && typeof performance.now === 'function'
        ? performance.now()
        : Date.now();
    },
    requestFrame(cb) {
      if (typeof requestAnimationFrame !== 'function') return null;
      return requestAnimationFrame(cb);
    },
    cancelFrame(id) {
      if (typeof cancelAnimationFrame === 'function') cancelAnimationFrame(id);
    },
    prefersReducedMotion() {
      // Read at call time. Missing matchMedia means motion is allowed.
      if (typeof window.matchMedia !== 'function') return false;
      try {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches === true;
      } catch {
        return false;
      }
    },
    setSmoothOverride(active) {
      const style = document.documentElement.style;
      if (active) {
        if (savedBehavior === null) savedBehavior = style.scrollBehavior;
        style.scrollBehavior = 'auto';
      } else if (savedBehavior !== null) {
        style.scrollBehavior = savedBehavior;
        savedBehavior = null;
      }
    },
    onInterrupt(handler) {
      const onKey = (event: KeyboardEvent) => {
        if (isInterruptionKey(event.key)) handler();
      };
      const passive: AddEventListenerOptions = { passive: true };
      window.addEventListener('wheel', handler, passive);
      window.addEventListener('touchmove', handler, passive);
      window.addEventListener('keydown', onKey);
      return () => {
        window.removeEventListener('wheel', handler, passive);
        window.removeEventListener('touchmove', handler, passive);
        window.removeEventListener('keydown', onKey);
      };
    },
  };
}

// One controller per client session, created lazily and only in the browser.
let controller: ScrollController | null = null;
let env: ScrollEnv | null = null;

function getController(): ScrollController | null {
  if (typeof window === 'undefined' || typeof document === 'undefined') return null;
  if (!controller) {
    env = createBrowserEnv();
    controller = new ScrollController(env);
  }
  return controller;
}

/** Updates the URL hash without scrolling and keeps `history.state` intact. */
function replaceHash(id: string): void {
  try {
    history.replaceState(history.state, '', location.pathname + location.search + '#' + id);
  } catch {
    // Ignored: the hash is a courtesy; scrolling already succeeded.
  }
}

export function useSmoothScroll() {
  function cancel(): void {
    controller?.cancel();
  }

  function scrollToTop(): void {
    const ctrl = getController();
    if (!ctrl) return;
    ctrl.scrollTo({ target: 0 });
  }

  function scrollToSection(id: string, opts?: { updateHash?: boolean }): boolean {
    const ctrl = getController();
    if (!ctrl || !env) return false;
    if (typeof id !== 'string' || id === '') return false;

    const el = document.getElementById(id);
    if (!el) return false;

    const updateHash = opts?.updateHash !== false;
    const target = computeSectionTarget(documentOffsetTop(el), env.getMaxScroll());
    ctrl.scrollTo({
      target,
      onComplete: updateHash ? () => replaceHash(id) : undefined,
    });
    return true;
  }

  function scrollToHash(hash: string): boolean {
    const id = parseHash(hash);
    if (id === null) return false;
    return scrollToSection(id);
  }

  if (typeof window !== 'undefined') onBeforeUnmount(cancel);

  return { scrollToTop, scrollToSection, scrollToHash, cancel };
}
