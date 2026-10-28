import { isInternalHref, parseHash } from '~/utils/scrollMath';

/**
 * Registers a delegated click handler for `a[href^="#"]` for the lifetime of
 * the calling component (Req 3.1, 3.2, 3.9).
 *
 * The listener lives on `document`, so existing header links and hero buttons
 * need no template changes.
 *
 * Decision on `preventDefault()`: it is called for every anchor whose href is
 * an internal hash (`isInternalHref`), even when no element has that id. In
 * that case `scrollToSection` returns `false`, so nothing scrolls, the hash is
 * not touched and no error is thrown (Req 3.9). A bare `href="#"` is not an
 * internal href and is left to the browser.
 */
export function useSmoothAnchors(): void {
  // Called once, in setup: useSmoothScroll registers onBeforeUnmount itself.
  const { scrollToSection } = useSmoothScroll();

  function onClick(event: MouseEvent): void {
    if (event.defaultPrevented) return;
    if (event.button !== 0) return;
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;

    const origin = event.target;
    if (!origin || typeof (origin as Element).closest !== 'function') return;

    const anchor = (origin as Element).closest('a[href^="#"]');
    if (!anchor) return;
    if (anchor.getAttribute('target') === '_blank') return;

    const href = anchor.getAttribute('href');
    if (!isInternalHref(href)) return;

    event.preventDefault();

    const id = parseHash(href as string);
    if (id === null) return;
    scrollToSection(id);
  }

  onMounted(() => {
    document.addEventListener('click', onClick);
  });

  onBeforeUnmount(() => {
    document.removeEventListener('click', onClick);
  });
}
