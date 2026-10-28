<template>
  <Transition name="btt">
    <button
      v-if="visible"
      type="button"
      :aria-label="t('backToTop.label')"
      class="fixed right-4 bottom-4 sm:right-6 sm:bottom-6 z-40 size-11 min-h-11 min-w-11 inline-flex items-center justify-center rounded-full bg-[#11b5a4] text-[#06080c] hover:bg-[#0ecfbb] hover:scale-110 focus-visible:outline-2 focus-visible:outline-[#11b5a4] focus-visible:outline-offset-2"
      style="transition: transform 100ms ease, background-color .3s ease"
      @click="onClick"
      @pointerenter="showTooltipSoon"
      @pointerleave="hideTooltip"
      @focus="showTooltipSoon"
      @blur="hideTooltip"
    >
      <ArrowUp class="size-5" aria-hidden="true" />
      <span
        class="btt-tooltip pointer-events-none absolute right-full top-1/2 mr-3 -translate-y-1/2 whitespace-nowrap rounded-md border border-white/14 bg-[#0b0f16] px-2 py-1 font-mono text-xs text-white"
        :class="tooltipVisible ? 'opacity-100' : 'opacity-0'"
        aria-hidden="true"
      >{{ t('backToTop.label') }}</span>
    </button>
  </Transition>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { ArrowUp } from 'lucide-vue-next';
import { useI18n } from '~/composables/useI18n';
import { useSmoothScroll } from '~/composables/useSmoothScroll';
import { isBackToTopVisible } from '~/utils/scrollMath';

const TOOLTIP_DELAY_MS = 500;

const { t } = useI18n();
const { scrollToTop } = useSmoothScroll();

const scrollY = ref(0);
const visible = ref(false);
const tooltipVisible = ref(false);

let frameId: number | null = null;
let tooltipTimer: ReturnType<typeof setTimeout> | null = null;

function readScrollY(): number {
  return window.scrollY ?? window.pageYOffset ?? 0;
}

function update(): void {
  scrollY.value = readScrollY();
  visible.value = isBackToTopVisible(scrollY.value);
}

// At most one update per animation frame.
function onScroll(): void {
  if (frameId !== null) return;
  if (typeof requestAnimationFrame !== 'function') {
    update();
    return;
  }
  frameId = requestAnimationFrame(() => {
    frameId = null;
    update();
  });
}

function clearTooltipTimer(): void {
  if (tooltipTimer !== null) {
    clearTimeout(tooltipTimer);
    tooltipTimer = null;
  }
}

function showTooltipSoon(): void {
  clearTooltipTimer();
  tooltipTimer = setTimeout(() => {
    tooltipTimer = null;
    tooltipVisible.value = true;
  }, TOOLTIP_DELAY_MS);
}

function hideTooltip(): void {
  clearTooltipTimer();
  tooltipVisible.value = false;
}

function onClick(): void {
  hideTooltip();
  scrollToTop();
}

// A removed button must not leave a pending or visible tooltip behind.
watch(visible, (value) => {
  if (!value) hideTooltip();
});

onMounted(() => {
  // The page can load already scrolled (reload, hash navigation).
  update();
  window.addEventListener('scroll', onScroll, { passive: true });
});

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('scroll', onScroll);
    if (frameId !== null && typeof cancelAnimationFrame === 'function') {
      cancelAnimationFrame(frameId);
    }
  }
  frameId = null;
  clearTooltipTimer();
});
</script>
