export type Appearance = 'light' | 'dark' | 'system';
export type ResolvedAppearance = 'light' | 'dark';

export function useAppearance() {
  const appearance = useState<Appearance>('appearance', () => 'system');

  const resolvedAppearance = computed<ResolvedAppearance>(() => {
    if (appearance.value === 'system') {
      if (import.meta.server) return 'light';
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return appearance.value;
  });

  function updateAppearance(value: Appearance) {
    appearance.value = value;
    if (import.meta.client) {
      localStorage.setItem('appearance', value);
      applyTheme(value);
    }
  }

  function applyTheme(value: Appearance) {
    if (value === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.toggle('dark', isDark);
    } else {
      document.documentElement.classList.toggle('dark', value === 'dark');
    }
  }

  onMounted(() => {
    const saved = localStorage.getItem('appearance') as Appearance | null;
    if (saved) {
      appearance.value = saved;
    }
    applyTheme(appearance.value);

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (appearance.value === 'system') applyTheme('system');
    });
  });

  return { appearance, resolvedAppearance, updateAppearance };
}
