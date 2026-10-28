<template>
  <div>
    <!-- Loading overlay -->
    <div v-if="loading" class="fixed inset-0 z-50 flex items-center justify-center bg-[#06080c]">
      <div class="flex gap-2">
        <span class="loading-dot size-2.5 rounded-full bg-[#11b5a4]"></span>
        <span class="loading-dot size-2.5 rounded-full bg-[#11b5a4]"></span>
        <span class="loading-dot size-2.5 rounded-full bg-[#11b5a4]"></span>
      </div>
    </div>
    <NuxtPage />
    <!-- Global UI mounted outside NuxtPage so position: fixed is not affected by the page transition transform -->
    <BackToTopButton />
    <ClientOnly>
      <SearchModal />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { useAppearance } from '~/composables/useAppearance';

useAppearance();
useSearchShortcut();

const nuxtApp = useNuxtApp();
const loading = ref(false);

nuxtApp.hook('page:start', () => { loading.value = true; });
nuxtApp.hook('page:finish', () => {
  setTimeout(() => { loading.value = false; }, 1500);
});
</script>
