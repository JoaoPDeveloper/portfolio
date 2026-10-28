import type { PendingScroll } from '~/utils/searchActions';

/**
 * Seção da Home a rolar depois de uma navegação entre páginas (Req 9.4, 9.6).
 * Escrito por `useSearchActions` antes de `navigateTo('/')` e limpo por `consume()` na Home.
 */
export function usePendingScroll() {
  const pending = useState<PendingScroll | null>('pendingHomeScroll', () => null);

  function set(p: PendingScroll): void {
    pending.value = p;
  }

  /** Retorna o valor pendente e o limpa. */
  function consume(): PendingScroll | null {
    const value = pending.value;
    pending.value = null;
    return value;
  }

  return { pending, set, consume };
}
