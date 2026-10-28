import { matchesSearchShortcut } from '~/utils/platform';

/**
 * Atalho global de busca (Req 4.1 a 4.6).
 *
 * O listener fica em `window` na fase de captura e não filtra pelo alvo do
 * evento, então o atalho também funciona com o foco em input, textarea ou
 * contenteditable. Teclas mantidas pressionadas (`e.repeat`) têm o padrão do
 * navegador bloqueado, mas não alternam a busca de novo.
 */
export function useSearchShortcut(): void {
  const { isMac } = usePlatform();
  const { toggle } = useSearchModal();

  const onKeydown = (e: KeyboardEvent): void => {
    if (!matchesSearchShortcut(e, isMac.value)) return;
    e.preventDefault();
    if (e.repeat) return;
    toggle();
  };

  onMounted(() => {
    window.addEventListener('keydown', onKeydown, true);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('keydown', onKeydown, true);
  });
}
