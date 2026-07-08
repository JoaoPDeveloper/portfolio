<template>
  <NuxtPage />
</template>

<script setup lang="ts">
import { useAppearance } from '~/composables/useAppearance';

// Initialize theme on app mount
useAppearance();
</script>
