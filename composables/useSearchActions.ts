import { resolveActivation } from '~/utils/searchActions';
import type { IndexEntry } from '~/utils/searchIndex';

/**
 * Executa a ativação de um resultado da busca (Req 9.1 a 9.6).
 *
 * Os composables são chamados uma única vez aqui (setup), porque
 * `useSmoothScroll` e `useSearchModal` registram `onBeforeUnmount`.
 * A rota é reativa, então `route.path` é lido dentro de `activate`.
 */
export function useSearchActions() {
  const route = useRoute();
  const modal = useSearchModal();
  const openJob = useOpenJob();
  const pendingScroll = usePendingScroll();
  const { scrollToSection } = useSmoothScroll();

  function activate(entry: IndexEntry): void {
    const action = resolveActivation(entry, { onHome: route.path === '/' });

    // Req 9.5: fecha antes de qualquer scroll ou navegação
    if (action.kind !== 'keep-open' && action.closeModal) modal.close();

    switch (action.kind) {
      case 'keep-open':
        return;

      case 'navigate':
        void navigateTo(action.path);
        return;

      case 'open-external':
        window.open(action.url, '_blank', 'noopener,noreferrer');
        return;

      case 'scroll-section':
        if (action.jobIndex !== undefined) openJob.value = action.jobIndex;
        scrollToSection(action.sectionId);
        return;

      case 'navigate-then-scroll': {
        pendingScroll.set(action.pending);
        // Se a navegação falhar, não deixa um scroll pendente obsoleto
        try {
          Promise.resolve(navigateTo('/')).catch(() => {
            pendingScroll.consume();
          });
        } catch {
          pendingScroll.consume();
        }
        return;
      }
    }
  }

  return { activate };
}
