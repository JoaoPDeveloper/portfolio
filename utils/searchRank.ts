/**
 * Ranqueamento, limite de resultados, agrupamento e sugestões da busca
 * (módulo puro: sem imports de Nuxt ou Vue e sem efeitos colaterais no
 * carregamento).
 */
import type { EntryType, IndexEntry } from './searchIndex'

export const MAX_RESULTS = 30
export const MAX_SUGGESTIONS = 10
export const GROUP_ORDER: readonly EntryType[] = [
  'project',
  'technology',
  'experience',
  'case'
]

/** Remove espaços nas pontas; a normalização de caixa ocorre no casamento. */
export function normalizeQuery(raw: string): string {
  return typeof raw === 'string' ? raw.trim() : ''
}

/** 0 título igual, 1 título contém, 2 descrição contém, 3 tags/tecnologias contêm. */
export type Rank = 0 | 1 | 2 | 3

/**
 * Rank da entrada para a consulta, ou `null` quando não há casamento.
 * Consulta vazia (após remover espaços) não casa com nada.
 */
export function rankEntry(entry: IndexEntry, normalizedQuery: string): Rank | null {
  const q = normalizeQuery(normalizedQuery).toLowerCase()
  if (q === '') return null
  const { lower } = entry
  if (lower.title === q) return 0
  if (lower.title.includes(q)) return 1
  if (lower.description.includes(q)) return 2
  if (lower.tags.includes(q) || lower.technologies.includes(q)) return 3
  return null
}

export interface ResultGroup {
  type: EntryType
  entries: IndexEntry[]
}

export interface SearchOutcome {
  mode: 'suggestions' | 'results'
  /** Apenas grupos não vazios, em GROUP_ORDER. */
  groups: ResultGroup[]
  /** Concatenação dos grupos; é a ordem do teclado. */
  flat: IndexEntry[]
  count: number
}

/** Agrupa por tipo em GROUP_ORDER, preservando a ordem de entrada e omitindo grupos vazios. */
export function groupEntries(entries: readonly IndexEntry[]): ResultGroup[] {
  const groups: ResultGroup[] = []
  for (const type of GROUP_ORDER) {
    const inGroup = entries.filter((e) => e.type === type)
    if (inGroup.length > 0) groups.push({ type, entries: inGroup })
  }
  return groups
}

function outcome(mode: SearchOutcome['mode'], entries: readonly IndexEntry[]): SearchOutcome {
  const groups = groupEntries(entries)
  const flat = groups.flatMap((g) => g.entries)
  return { mode, groups, flat, count: flat.length }
}

/** Até 10 itens: projetos em destaque primeiro, depois o restante por grupo e posição. */
export function suggestions(index: readonly IndexEntry[]): SearchOutcome {
  const featured = index.filter((e) => e.featured)
  const featuredSet = new Set(featured)
  const rest: IndexEntry[] = []
  for (const type of GROUP_ORDER) {
    for (const entry of index) {
      if (entry.type === type && !featuredSet.has(entry)) rest.push(entry)
    }
  }
  return outcome('suggestions', [...featured, ...rest].slice(0, MAX_SUGGESTIONS))
}

export function search(index: readonly IndexEntry[], rawQuery: string): SearchOutcome {
  const q = normalizeQuery(rawQuery).toLowerCase()
  if (q === '') return suggestions(index)

  const matches: { entry: IndexEntry; rank: Rank; i: number }[] = []
  for (let i = 0; i < index.length; i++) {
    const rank = rankEntry(index[i], q)
    if (rank !== null) matches.push({ entry: index[i], rank, i })
  }
  matches.sort((a, b) => a.rank - b.rank || a.i - b.i)

  return outcome(
    'results',
    matches.slice(0, MAX_RESULTS).map((m) => m.entry)
  )
}
