<script setup lang="ts">
import { computed } from 'vue';
import { Search } from 'lucide-vue-next';

import { useI18n } from '~/composables/useI18n';
import { usePlatform } from '~/composables/usePlatform';
import { useSearchModal } from '~/composables/useSearchModal';

const { t } = useI18n();
const { isMac, hint } = usePlatform();
const { open } = useSearchModal();

const label = computed(() => t('search.trigger'));
const ariaLabel = computed(() => `${label.value} (${hint.value})`);
const keyShortcuts = computed(() => (isMac.value ? 'Meta+K' : 'Control+K'));
</script>

<template>
  <button
    type="button"
    data-search-trigger
    class="inline-flex h-9 items-center gap-1.5 rounded-full border border-white/14 px-3 font-mono text-xs text-[#9aa3b4] transition hover:border-[#11b5a4]/50 hover:text-white"
    :aria-label="ariaLabel"
    :aria-keyshortcuts="keyShortcuts"
    @click="open()"
  >
    <Search class="size-3.5" aria-hidden="true" />
    <span class="sr-only sm:not-sr-only">{{ label }}</span>
    <span aria-hidden="true">{{ hint }}</span>
  </button>
</template>
