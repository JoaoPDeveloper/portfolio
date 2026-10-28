/**
 * Pure keyboard, scroll and touch helpers for the search modal.
 * No Nuxt/Vue imports and no module-level side effects.
 */

/** Index of the selected result in the flat result list, or null for none. */
export type Selection = number | null;

/** Downward finger movement (CSS px) needed to close the modal. */
export const SWIPE_THRESHOLD = 80;

/** Selection after a result list change: first item when non-empty, else null (Req 8.1). */
export function initialSelection(length: number): Selection {
  return length > 0 ? 0 : null;
}

/** ArrowDown / ArrowUp transitions (Req 8.2 to 8.6). */
export function moveSelection(
  current: Selection,
  key: 'ArrowDown' | 'ArrowUp',
  length: number,
): Selection {
  if (!(length > 0)) return null;
  const last = length - 1;

  if (key === 'ArrowDown') {
    if (current === null) return 0;
    if (current < 0) return 0;
    return current >= last ? last : current + 1;
  }

  // ArrowUp
  if (current === null) return null;
  if (current <= 0) return null;
  return current > last ? last : current - 1;
}

/** The entry Enter would activate, or null when nothing is selected (Req 8.7, 8.8). */
export function entryToActivate<T>(selection: Selection, flat: readonly T[]): T | null {
  if (selection === null) return null;
  if (!Number.isInteger(selection) || selection < 0 || selection >= flat.length) return null;
  return flat[selection];
}

/**
 * New scrollTop so the item is fully visible with minimal movement (Req 8.9).
 * Coordinates are relative to the scroll content.
 */
export function ensureVisibleScrollTop(args: {
  scrollTop: number;
  viewportHeight: number;
  itemTop: number;
  itemHeight: number;
}): number {
  const { scrollTop, viewportHeight, itemTop, itemHeight } = args;
  const itemBottom = itemTop + itemHeight;

  if (itemTop < scrollTop) return itemTop;
  if (itemBottom > scrollTop + viewportHeight) {
    // An item taller than the viewport is aligned to its top edge.
    if (itemHeight > viewportHeight) return itemTop;
    return itemBottom - viewportHeight;
  }
  return scrollTop;
}

/**
 * Tab / Shift+Tab wrap (Req 10.6, 10.7).
 * Returns null when there is nothing focusable.
 */
export function nextTrapIndex(current: number, count: number, shift: boolean): number | null {
  if (!(count > 0)) return null;
  const step = shift ? -1 : 1;
  return (((current + step) % count) + count) % count;
}

/** 'close' once dy >= 80 and dy > |dx| (Req 13.8); otherwise 'pending' (Req 13.9). */
export function evaluateSwipe(dx: number, dy: number): 'close' | 'pending' {
  return dy >= SWIPE_THRESHOLD && dy > Math.abs(dx) ? 'close' : 'pending';
}
