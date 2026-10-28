/**
 * Setup global dos testes.
 *
 * Os composables usam os auto-imports do Nuxt sem importá-los. Fora do Nuxt
 * eles não existem, então são expostos aqui como stubs em `globalThis`.
 * Os stubs de função são `vi.fn`, para que cada teste possa ajustar o
 * comportamento ou inspecionar as chamadas.
 */
import { beforeEach, vi } from 'vitest'
import { computed, nextTick, ref, watch, type Ref } from 'vue'

// Estado compartilhado do `useState`, indexado pela chave (como no Nuxt)
const stateStore = new Map<string, Ref<unknown>>()

function useState<T>(key: string, init?: () => T): Ref<T> {
  if (!stateStore.has(key)) {
    stateStore.set(key, ref(init ? init() : undefined) as Ref<unknown>)
  }
  return stateStore.get(key) as Ref<T>
}

/** Limpa o estado do `useState` entre testes. */
export function resetState(): void {
  stateStore.clear()
}

/** Rota atual simulada; os testes podem alterar `path`, `hash` etc. */
export const currentRoute: { path: string; hash: string; query: Record<string, unknown> } = {
  path: '/',
  hash: '',
  query: {}
}

const stubs = {
  useState,
  navigateTo: vi.fn(async (_to: unknown) => undefined),
  useRoute: vi.fn(() => currentRoute),
  // Sem componente montado, os hooks de ciclo de vida são no-ops;
  // os testes leem `mock.calls` para disparar os callbacks quando precisarem.
  onMounted: vi.fn((_cb: () => void) => undefined),
  onBeforeUnmount: vi.fn((_cb: () => void) => undefined),
  ref,
  computed,
  watch,
  nextTick
}

Object.assign(globalThis, stubs)

beforeEach(() => {
  resetState()
  currentRoute.path = '/'
  currentRoute.hash = ''
  currentRoute.query = {}
  stubs.navigateTo.mockClear()
  stubs.useRoute.mockClear()
  stubs.onMounted.mockClear()
  stubs.onBeforeUnmount.mockClear()
})
