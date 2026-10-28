import projects from '~/data/projects.json';
import technologies from '~/data/technologies.json';
import profile from '~/data/profile.json';
import { buildSearchIndex } from '~/utils/searchIndex';
import type { IndexEntry, Locale } from '~/utils/searchIndex';

/**
 * Cache de slot único em memória (Req 6.5, 6.6, 12.4, 12.5).
 * Nada é construído no carregamento do módulo ou da página (Req 12.3):
 * a primeira construção acontece na primeira chamada a `get`.
 */
let slot: { locale: Locale; entries: IndexEntry[] } | null = null;

function warn(msg: string): void {
  console.warn(msg);
}

export function useSearchIndex() {
  /** Constrói na primeira chamada de um locale; depois devolve a mesma referência. */
  function get(locale: Locale): IndexEntry[] {
    if (slot !== null && slot.locale === locale) return slot.entries;
    // Locale diferente (ou cache vazio): descarta o cache e reconstrói.
    slot = null;
    const entries = buildSearchIndex({ projects, technologies, profile }, locale, warn);
    slot = { locale, entries };
    return entries;
  }

  /** Descarta o cache; a próxima chamada a `get` reconstrói o índice. */
  function invalidate(): void {
    slot = null;
  }

  return { get, invalidate };
}
