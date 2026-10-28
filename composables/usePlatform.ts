import { detectIsMac, shortcutHint } from '~/utils/platform';

/** `navigator.userAgentData` ainda não faz parte dos tipos do DOM em todas as versões do TypeScript. */
type NavigatorWithUAData = Navigator & { userAgentData?: { platform?: string } };

/**
 * Detecção de plataforma só no cliente (Req 4.10, 4.11, 15.9, 15.10).
 * O servidor e a primeira renderização no cliente mostram `Ctrl+K`;
 * a dica muda após a montagem, evitando divergência de hidratação.
 */
export function usePlatform() {
  const isMac = useState<boolean>('isMac', () => false);

  onMounted(() => {
    const nav = navigator as NavigatorWithUAData;
    isMac.value = detectIsMac({
      platform: nav.platform,
      userAgentPlatform: nav.userAgentData?.platform
    });
  });

  const hint = computed(() => shortcutHint(isMac.value));

  return { isMac, hint };
}
