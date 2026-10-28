import { getCurrentInstance } from 'vue';

/**
 * Estado compartilhado da busca (Req 4.6, 4.7, 5.4, 5.7 a 5.10).
 *
 * O Focus_Origin e o bloqueio de scroll vivem no módulo porque `open()` e
 * `close()` são chamados por componentes diferentes (atalho, botão, modal e
 * ações). Só são usados no cliente; no servidor o módulo nunca toca o DOM.
 */
let focusOrigin: Element | null = null;

interface ScrollLock {
  overflow: string;
  paddingRight: string;
}
let scrollLock: ScrollLock | null = null;

const hasDom = () => typeof document !== 'undefined' && typeof window !== 'undefined';

/** Req 5.9: bloqueia o scroll do body compensando a largura da barra. */
function lockBodyScroll(): void {
  if (!hasDom() || scrollLock) return;
  const body = document.body;
  scrollLock = {
    overflow: body.style.overflow,
    paddingRight: body.style.paddingRight
  };
  const scrollbarWidth = Math.max(0, window.innerWidth - document.documentElement.clientWidth);
  body.style.overflow = 'hidden';
  body.style.paddingRight = `${scrollbarWidth}px`;
}

/** Req 5.10: restaura os valores anteriores do body. No-op se não houver bloqueio. */
function unlockBodyScroll(): void {
  if (!hasDom() || !scrollLock) return;
  document.body.style.overflow = scrollLock.overflow;
  document.body.style.paddingRight = scrollLock.paddingRight;
  scrollLock = null;
}

function tryFocus(el: Element | null): boolean {
  if (!el || !(el instanceof HTMLElement) || !document.contains(el)) return false;
  try {
    el.focus({ preventScroll: true });
  } catch {
    return false;
  }
  return document.activeElement === el;
}

/** Req 5.7 e 5.8: origem, depois `[data-search-trigger]`, por fim o body. */
function restoreFocus(origin: Element | null): void {
  if (!hasDom()) return;
  if (origin && origin !== document.body && tryFocus(origin)) return;
  if (tryFocus(document.querySelector('[data-search-trigger]'))) return;
  const active = document.activeElement;
  if (active instanceof HTMLElement && active !== document.body) active.blur();
}

export function useSearchModal() {
  const isOpen = useState<boolean>('searchOpen', () => false);

  function open(): void {
    if (isOpen.value) return;
    // Lido antes de qualquer movimento de foco (Req 5.4)
    focusOrigin = hasDom() ? document.activeElement : null;
    lockBodyScroll();
    isOpen.value = true;
  }

  function close(): void {
    if (!isOpen.value) return;
    // O bloqueio é liberado no início do fechamento, não após a transição (Req 5.10)
    unlockBodyScroll();
    isOpen.value = false;
    const origin = focusOrigin;
    focusOrigin = null;
    restoreFocus(origin);
  }

  function toggle(): void {
    if (isOpen.value) close();
    else open();
  }

  // Libera o bloqueio se o componente que usa o composable for desmontado
  if (getCurrentInstance()) {
    onBeforeUnmount(() => unlockBodyScroll());
  }

  return { isOpen, open, close, toggle };
}
