/**
 * Debouncer puro, sem dependências de Nuxt/Vue.
 * Os timers são injetáveis para permitir testes com relógio falso.
 */

export interface DebouncerTimers {
  set(cb: () => void, ms: number): unknown
  clear(h: unknown): void
}

export interface Debouncer<A extends unknown[]> {
  /** Agenda `fn` com os argumentos informados, reiniciando a espera pendente. */
  call(...a: A): void
  /** Descarta a execução pendente, se houver. */
  cancel(): void
}

const defaultTimers: DebouncerTimers = {
  set: (cb, ms) => setTimeout(cb, ms),
  clear: (h) => clearTimeout(h as ReturnType<typeof setTimeout>),
}

/**
 * Cria um debouncer: `fn` roda uma vez, `waitMs` após a última chamada de `call`,
 * sempre com os argumentos da última chamada.
 */
export function createDebouncer<A extends unknown[]>(
  fn: (...a: A) => void,
  waitMs: number,
  timers: DebouncerTimers = defaultTimers,
): Debouncer<A> {
  let handle: unknown
  let pending = false

  function cancel(): void {
    if (pending) {
      timers.clear(handle)
      pending = false
      handle = undefined
    }
  }

  function call(...a: A): void {
    cancel()
    pending = true
    handle = timers.set(() => {
      pending = false
      handle = undefined
      fn(...a)
    }, waitMs)
  }

  return { call, cancel }
}
