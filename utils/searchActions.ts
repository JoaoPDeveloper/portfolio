/**
 * Resolução da ativação de um resultado da busca (módulo puro: sem imports de
 * Nuxt ou Vue e sem efeitos colaterais). A execução fica em `useSearchActions`.
 */
import type { EntryType, IndexEntry } from './searchIndex'

/** Seção da Home a rolar depois da navegação (definido aqui para `utils/` não importar de `composables/`). */
export interface PendingScroll {
  sectionId: 'experiencia' | 'cases'
  jobIndex?: number
}

export type Activation =
  | { kind: 'navigate'; path: string; closeModal: true }
  | { kind: 'open-external'; url: string; closeModal: true }
  | { kind: 'keep-open' }
  | {
      kind: 'scroll-section'
      sectionId: 'experiencia' | 'cases'
      jobIndex?: number
      closeModal: true
    }
  | { kind: 'navigate-then-scroll'; pending: PendingScroll; closeModal: true }

/** Verdadeiro apenas para URLs absolutas com protocolo `http:` ou `https:`. */
export function isHttpUrl(value: unknown): value is string {
  if (typeof value !== 'string') return false
  try {
    const { protocol } = new URL(value)
    return protocol === 'http:' || protocol === 'https:'
  } catch {
    return false
  }
}

const KEEP_OPEN: Activation = { kind: 'keep-open' }

export function resolveActivation(
  entry: IndexEntry,
  ctx: { onHome: boolean }
): Activation {
  const target = entry.target

  switch (entry.type) {
    case 'project':
      return target.kind === 'route'
        ? { kind: 'navigate', path: target.path, closeModal: true }
        : KEEP_OPEN
    case 'technology':
      return target.kind === 'external' && isHttpUrl(target.url)
        ? { kind: 'open-external', url: target.url, closeModal: true }
        : KEEP_OPEN
    case 'experience':
    case 'case': {
      if (target.kind !== 'section') return KEEP_OPEN
      const pending: PendingScroll = { sectionId: target.sectionId }
      if (target.jobIndex !== undefined) pending.jobIndex = target.jobIndex
      return ctx.onHome
        ? { kind: 'scroll-section', ...pending, closeModal: true }
        : { kind: 'navigate-then-scroll', pending, closeModal: true }
    }
    default:
      return KEEP_OPEN
  }
}

export const ENTRY_ICON: Record<EntryType, 'Folder' | 'Code' | 'Briefcase' | 'Lightbulb'> = {
  project: 'Folder',
  technology: 'Code',
  experience: 'Briefcase',
  case: 'Lightbulb'
}
