export interface PlatformInfo {
  platform?: string | null
  userAgentPlatform?: string | null
}

export interface KeyLike {
  key: string
  ctrlKey: boolean
  metaKey: boolean
  altKey: boolean
  shiftKey: boolean
}

/**
 * Mac when a platform string starts with "Mac" (case-insensitive).
 * Missing or empty information means non-Mac.
 */
export function detectIsMac(info: PlatformInfo | null | undefined): boolean {
  if (!info) return false
  const candidates = [info.platform, info.userAgentPlatform]
  return candidates.some(
    (value) => typeof value === 'string' && value.trim().toLowerCase().startsWith('mac'),
  )
}

/**
 * True for the search shortcut of the current platform: key "k", only the
 * primary modifier (meta on Mac, ctrl otherwise), no alt and no shift.
 * The event target is intentionally ignored so it behaves the same inside inputs.
 */
export function matchesSearchShortcut(e: KeyLike, isMac: boolean): boolean {
  if (typeof e.key !== 'string' || e.key.toLowerCase() !== 'k') return false
  if (e.altKey || e.shiftKey) return false
  return isMac ? e.metaKey && !e.ctrlKey : e.ctrlKey && !e.metaKey
}

/** Shortcut hint text: U+2318 followed by K on Mac, "Ctrl+K" elsewhere. */
export function shortcutHint(isMac: boolean): '\u2318K' | 'Ctrl+K' {
  return isMac ? '\u2318K' : 'Ctrl+K'
}
