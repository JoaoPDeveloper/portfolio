/**
 * Pure scroll math helpers.
 *
 * No Nuxt or Vue imports and no side effects at module load, so this module
 * can be imported from plain Node tests.
 */

export const SCROLL_DURATION_MS = 800;
export const HEADER_HEIGHT = 64;
export const BACK_TO_TOP_THRESHOLD = 300;

/** Ease-in-out cubic. Domain and range are [0, 1]; input outside is clamped. */
export function easeInOutCubic(t: number): number {
  if (!(t > 0)) return 0;
  if (t >= 1) return 1;
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/** Position at `elapsedMs` for a start/target pair. Clamps progress to [0, 1]. */
export function scrollPositionAt(
  start: number,
  target: number,
  elapsedMs: number,
  durationMs: number = SCROLL_DURATION_MS,
): number {
  let progress: number;
  if (!(durationMs > 0)) {
    progress = 1;
  } else {
    progress = elapsedMs / durationMs;
    if (!(progress > 0)) progress = 0;
    else if (progress > 1) progress = 1;
  }
  return start + (target - start) * easeInOutCubic(progress);
}

/** clamp(offsetTop - headerHeight, 0, maxScroll). maxScroll is floored at 0. */
export function computeSectionTarget(
  offsetTop: number,
  maxScroll: number,
  headerHeight: number = HEADER_HEIGHT,
): number {
  const max = maxScroll > 0 ? maxScroll : 0;
  const raw = offsetTop - headerHeight;
  if (!(raw > 0)) return 0;
  return raw > max ? max : raw;
}

/** Sum of offsetTop along the offsetParent chain (document-relative, transform-independent). */
export function documentOffsetTop(el: { offsetTop: number; offsetParent: unknown }): number {
  let total = 0;
  let node: { offsetTop: number; offsetParent: unknown } | null = el;
  while (node) {
    total += node.offsetTop || 0;
    node = (node.offsetParent as { offsetTop: number; offsetParent: unknown } | null) ?? null;
  }
  return total;
}

export const INTERRUPTION_KEYS: readonly string[] = [
  'ArrowUp',
  'ArrowDown',
  'PageUp',
  'PageDown',
  'Home',
  'End',
];

export function isInterruptionKey(key: string): boolean {
  return INTERRUPTION_KEYS.includes(key);
}

/** True only for a string of the form "#<non-empty id>". */
export function isInternalHref(href: string | null | undefined): boolean {
  return typeof href === 'string' && href.length > 1 && href.charAt(0) === '#';
}

/** Strips "#", decodes with try/catch, returns null for empty or undecodable input. */
export function parseHash(hash: string): string | null {
  if (typeof hash !== 'string') return null;
  const raw = hash.charAt(0) === '#' ? hash.slice(1) : hash;
  if (raw === '') return null;
  try {
    const decoded = decodeURIComponent(raw);
    return decoded === '' ? null : decoded;
  } catch {
    return null;
  }
}

export function isBackToTopVisible(scrollY: number): boolean {
  return scrollY > BACK_TO_TOP_THRESHOLD;
}
