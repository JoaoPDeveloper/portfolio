<template>
  <div>
    <!-- Loading overlay -->
    <div v-if="loading" class="fixed inset-0 z-50 flex items-center justify-center" :style="{ backgroundColor: loadingBg }">
      <div class="flex gap-2">
        <span class="loading-dot size-3 rounded-full bg-[#11b5a4]"></span>
        <span class="loading-dot size-3 rounded-full bg-[#11b5a4]"></span>
        <span class="loading-dot size-3 rounded-full bg-[#11b5a4]"></span>
      </div>
    </div>
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
import { useAppearance } from '~/composables/useAppearance';

useAppearance();

const nuxtApp = useNuxtApp();
const loading = ref(false);

const loadingBg = computed(() =>
  document.documentElement.classList.contains('dark') ? '#090d0c' : '#f6f7f4'
);

nuxtApp.hook('page:start', () => { loading.value = true; });
nuxtApp.hook('page:finish', () => {
  setTimeout(() => { loading.value = false; }, 1500);
});
</script>
