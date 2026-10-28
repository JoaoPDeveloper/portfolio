/**
 * Construção do índice de busca (módulo puro: sem imports de Nuxt ou Vue e sem
 * efeitos colaterais no carregamento). O locale entra como parâmetro.
 */

export type Locale = 'pt' | 'en'
export type EntryType = 'project' | 'technology' | 'experience' | 'case'

export type SearchTarget =
  | { kind: 'route'; path: string }
  | { kind: 'external'; url: string }
  | { kind: 'section'; sectionId: 'experiencia' | 'cases'; jobIndex?: number }

export interface IndexEntry {
  id: string
  type: EntryType
  title: string
  description: string
  tags: string[]
  technologies: string[]
  target: SearchTarget
  featured: boolean
  /** Derivado uma vez na construção; usado pelo casamento de busca. */
  lower: {
    title: string
    description: string
    tags: string
    technologies: string
  }
}

export interface SearchSources {
  projects: unknown
  technologies: unknown
  /** Objeto com `experience[]` e `cases[]`. */
  profile: unknown
}

export type Localized =
  | { pt?: string | string[]; en?: string | string[] }
  | null
  | undefined

type Rec = Record<string, unknown>

function isRecord(value: unknown): value is Rec {
  return typeof value === 'object' && value !== null
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim() !== ''
}

function textOf(value: unknown): string {
  if (typeof value === 'string') return value.trim() === '' ? '' : value
  if (Array.isArray(value)) {
    return value.filter(isNonEmptyString).join(' ')
  }
  return ''
}

function listOf(value: unknown): string[] {
  if (typeof value === 'string') return isNonEmptyString(value) ? [value] : []
  if (Array.isArray(value)) return value.filter(isNonEmptyString)
  return []
}

/** Texto do locale, depois `en`, depois vazio. */
export function localizeText(field: Localized, locale: Locale): string {
  if (!isRecord(field)) return ''
  const primary = textOf(field[locale])
  if (primary !== '') return primary
  return textOf(field.en)
}

/** Lista do locale, depois `en`, depois vazia. */
export function localizeList(field: Localized, locale: Locale): string[] {
  if (!isRecord(field)) return []
  const primary = listOf(field[locale])
  if (primary.length > 0) return primary
  return listOf(field.en)
}

function joinParts(parts: readonly string[]): string {
  return parts.filter((p) => p !== '').join(' ')
}

function stringList(value: unknown): string[] {
  return Array.isArray(value) ? value.filter(isNonEmptyString) : []
}

function stringOf(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

interface EntryInput {
  id: string
  type: EntryType
  title: string
  description: string
  tags: string[]
  technologies: string[]
  target: SearchTarget
  featured?: boolean
}

function makeEntry(input: EntryInput): IndexEntry {
  return {
    id: input.id,
    type: input.type,
    title: input.title,
    description: input.description,
    tags: input.tags,
    technologies: input.technologies,
    target: input.target,
    featured: input.featured === true,
    lower: {
      title: input.title.toLowerCase(),
      description: input.description.toLowerCase(),
      // '\n' evita casamentos que atravessem a fronteira entre dois itens.
      tags: input.tags.join('\n').toLowerCase(),
      technologies: input.technologies.join('\n').toLowerCase()
    }
  }
}

/** Garante `id` único: em colisão, acrescenta a posição de origem. */
function uniqueId(base: string, position: number, used: Set<string>): string {
  let id = base
  if (used.has(id)) id = `${base}#${position}`
  let n = position
  while (used.has(id)) id = `${base}#${++n}`
  used.add(id)
  return id
}

type SourceBuilder = (items: unknown[], out: IndexEntry[], used: Set<string>) => void

function buildProjects(
  locale: Locale,
  techNames: Map<string, string>
): SourceBuilder {
  return (items, out, used) => {
    items.forEach((raw, i) => {
      if (!isRecord(raw)) return
      const title = stringOf(raw.title)
      if (title.trim() === '') return
      const slug = stringOf(raw.slug)
      const technologies = stringList(raw.technologies).map(
        (s) => techNames.get(s) ?? s
      )
      out.push(
        makeEntry({
          id: uniqueId(`project:${slug || i}`, i, used),
          type: 'project',
          title,
          description: joinParts([
            localizeText(raw.shortDescription as Localized, locale),
            localizeText(raw.description as Localized, locale)
          ]),
          tags: [],
          technologies,
          target: { kind: 'route', path: '/projetos/' + slug },
          featured: raw.isFeatured === true
        })
      )
    })
  }
}

function buildTechnologies(): SourceBuilder {
  return (items, out, used) => {
    items.forEach((raw, i) => {
      if (!isRecord(raw)) return
      const title = stringOf(raw.name)
      if (title.trim() === '') return
      const slug = stringOf(raw.slug)
      out.push(
        makeEntry({
          id: uniqueId(`technology:${slug || i}`, i, used),
          type: 'technology',
          title,
          description: '',
          tags: [],
          technologies: [],
          target: { kind: 'external', url: stringOf(raw.url) }
        })
      )
    })
  }
}

function buildExperience(locale: Locale): SourceBuilder {
  return (items, out, used) => {
    items.forEach((raw, i) => {
      if (!isRecord(raw)) return
      const title = localizeText(raw.role as Localized, locale)
      if (title.trim() === '') return
      const company = stringOf(raw.company)
      out.push(
        makeEntry({
          id: uniqueId(`experience:${i}`, i, used),
          type: 'experience',
          title,
          description: joinParts([
            localizeText(raw.description as Localized, locale),
            ...localizeList(raw.highlights as Localized, locale)
          ]),
          tags: company.trim() === '' ? [] : [company],
          technologies: stringList(raw.technologies),
          target: { kind: 'section', sectionId: 'experiencia', jobIndex: i }
        })
      )
    })
  }
}

function buildCases(locale: Locale): SourceBuilder {
  return (items, out, used) => {
    items.forEach((raw, i) => {
      if (!isRecord(raw)) return
      const title = localizeText(raw.title as Localized, locale)
      if (title.trim() === '') return
      out.push(
        makeEntry({
          id: uniqueId(`case:${i}`, i, used),
          type: 'case',
          title,
          description: joinParts([
            localizeText(raw.problem as Localized, locale),
            localizeText(raw.approach as Localized, locale),
            localizeText(raw.result as Localized, locale)
          ]),
          tags: [stringOf(raw.tag), stringOf(raw.context)].filter(isNonEmptyString),
          technologies: stringList(raw.technologies),
          target: { kind: 'section', sectionId: 'cases' }
        })
      )
    })
  }
}

/** Mapa slug -> nome de exibição; tolera fonte malformada. */
function technologyNames(source: unknown): Map<string, string> {
  const map = new Map<string, string>()
  try {
    if (!Array.isArray(source)) return map
    for (const raw of source) {
      if (!isRecord(raw)) continue
      const slug = stringOf(raw.slug)
      const name = stringOf(raw.name)
      if (slug !== '' && name.trim() !== '' && !map.has(slug)) map.set(slug, name)
    }
  } catch {
    // fonte ilegível: nomes não resolvidos caem para o próprio slug
  }
  return map
}

/**
 * Monta o índice na ordem projetos, tecnologias, experiência, cases.
 * Nunca lança: cada fonte é processada em seu próprio try/catch; fonte ausente
 * ou que não seja lista gera um `warn` e é omitida.
 */
export function buildSearchIndex(
  sources: SearchSources,
  locale: Locale,
  warn: (msg: string) => void = (msg) => console.warn(msg)
): IndexEntry[] {
  const safeWarn = (msg: string) => {
    try {
      warn(msg)
    } catch {
      // um warn que falha não pode quebrar a construção
    }
  }

  const out: IndexEntry[] = []
  const used = new Set<string>()

  const run = (name: string, read: () => unknown, builder: SourceBuilder) => {
    const before = out.length
    try {
      const items = read()
      if (!Array.isArray(items)) {
        safeWarn(`[search] Fonte "${name}" ausente ou não é uma lista; ignorada.`)
        return
      }
      builder(items, out, used)
    } catch (err) {
      out.length = before
      safeWarn(`[search] Falha ao processar a fonte "${name}": ${String(err)}`)
    }
  }

  let src: SearchSources | null = null
  try {
    src = isRecord(sources) ? sources : null
  } catch {
    src = null
  }

  const readSource = (key: keyof SearchSources) => (): unknown =>
    src ? src[key] : undefined
  const readProfile = (key: 'experience' | 'cases') => (): unknown => {
    const profile = src ? src.profile : undefined
    return isRecord(profile) ? profile[key] : undefined
  }

  let techNames = new Map<string, string>()
  try {
    techNames = technologyNames(src ? src.technologies : undefined)
  } catch {
    techNames = new Map()
  }

  run('projects', readSource('projects'), buildProjects(locale, techNames))
  run('technologies', readSource('technologies'), buildTechnologies())
  run('profile.experience', readProfile('experience'), buildExperience(locale))
  run('profile.cases', readProfile('cases'), buildCases(locale))

  return out
}
