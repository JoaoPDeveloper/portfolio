<script setup lang="ts">
import { ArrowLeft, ArrowUpRight, Github, Mail, Languages, Moon, Sun } from 'lucide-vue-next';
import { useAppearance } from '~/composables/useAppearance';
import { useI18n } from '~/composables/useI18n';

import profileData from '~/data/profile.json';
import technologies from '~/data/technologies.json';
import projects from '~/data/projects.json';

const { resolvedAppearance, updateAppearance } = useAppearance();
const { locale, t, toggleLocale } = useI18n();

const route = useRoute();
const slug = route.params.slug as string;

const project = projects.find((p) => p.slug === slug);

if (!project) {
  throw createError({ statusCode: 404, statusMessage: 'Projeto não encontrado' });
}

const otherProjects = projects.filter((p) => p.slug !== slug).slice(0, 3);

const getTechBySlug = (techSlug: string) =>
  technologies.find((t) => t.slug === techSlug);

const toggleTheme = () => {
  updateAppearance(resolvedAppearance.value === 'dark' ? 'light' : 'dark');
};

useHead({
  title: `${project.title} - ${profileData.name}`,
});
</script>

<template>
  <main class="min-h-screen bg-[#f6f7f4] text-[#121512] dark:bg-[#090d0c] dark:text-[#f5f7f2]">
    <section class="mx-auto max-w-7xl px-5 py-8 sm:px-8">
      <nav class="flex items-center justify-between">
        <NuxtLink to="/" class="inline-flex items-center gap-2 text-sm font-medium text-[#5f6b66] transition hover:text-[#121512] dark:text-[#a8b4ae] dark:hover:text-white">
          <ArrowLeft class="size-4" /> {{ t('project.back') }}
        </NuxtLink>
        <div class="flex items-center gap-2">
          <!-- Language toggle -->
          <button
            type="button"
            class="inline-flex h-9 items-center gap-1.5 rounded-full border border-black/10 bg-white/70 px-3 text-sm font-medium text-[#121512] transition-all duration-500 ease-in-out hover:-translate-y-0.5 dark:border-white/10 dark:bg-white/5 dark:text-white"
            @click="toggleLocale"
          >
            <Languages class="size-4" />
            <span class="text-xs font-bold uppercase">{{ locale === 'pt' ? 'EN' : 'PT' }}</span>
          </button>

          <!-- Theme toggle -->
          <button
            type="button"
            class="inline-flex size-9 items-center justify-center rounded-full border border-black/10 bg-white/70 text-[#121512] transition-all duration-500 ease-in-out hover:-translate-y-0.5 hover:border-[#11b5a4]/50 dark:border-white/10 dark:bg-white/5 dark:text-white"
            @click="toggleTheme"
          >
            <Sun v-if="resolvedAppearance === 'dark'" class="size-4" />
            <Moon v-else class="size-4" />
          </button>

          <a v-if="profileData.email" :href="`mailto:${profileData.email}`" class="inline-flex items-center gap-2 rounded-full border border-black/10 px-4 py-2 text-sm font-medium dark:border-white/10">
            <Mail class="size-4" /> {{ t('project.contact') }}
          </a>
        </div>
      </nav>

      <div class="grid gap-10 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
        <div>
          <p class="text-sm font-semibold uppercase tracking-[0.22em] text-[#11b5a4]">{{ t('project.label') }}</p>
          <h1 class="mt-4 text-5xl font-semibold leading-none tracking-normal sm:text-7xl">{{ project.title }}</h1>
          <p class="mt-6 max-w-2xl text-lg leading-8 text-[#4b5a54] dark:text-[#b8c4be]">{{ project.shortDescription[locale] }}</p>
          <div class="mt-8 flex flex-wrap gap-3">
            <a
              v-if="project.projectUrl"
              :href="project.projectUrl"
              target="_blank"
              rel="noreferrer"
              class="inline-flex h-12 items-center gap-2 rounded-full bg-[#11b5a4] px-5 text-sm font-semibold text-[#06100e] transition hover:-translate-y-1"
            >
              {{ t('project.open') }} <ArrowUpRight class="size-4" />
            </a>
            <a
              v-if="project.githubUrl"
              :href="project.githubUrl"
              target="_blank"
              rel="noreferrer"
              class="inline-flex h-12 items-center gap-2 rounded-full border border-black/10 bg-white/70 px-5 text-sm font-semibold dark:border-white/10 dark:bg-white/5"
            >
              {{ t('project.repo') }} <Github class="size-4" />
            </a>
          </div>
        </div>

        <div class="overflow-hidden rounded-3xl border border-black/10 bg-white shadow-2xl shadow-black/5 dark:border-white/10 dark:bg-[#101614]">
          <img v-if="project.imageUrl" :src="project.imageUrl" :alt="project.title" class="aspect-[16/10] w-full object-cover" />
        </div>
      </div>

      <div class="grid gap-10 border-y border-black/10 py-12 dark:border-white/10 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <h2 class="text-2xl font-semibold">{{ t('project.context') }}</h2>
          <div class="mt-6 flex flex-wrap gap-2">
            <span
              v-for="techSlug in project.technologies"
              :key="techSlug"
              class="inline-flex items-center gap-2 rounded-full border border-black/10 px-3 py-1.5 text-sm dark:border-white/10"
            >
              <img v-if="getTechBySlug(techSlug)?.iconUrl" :src="getTechBySlug(techSlug)!.iconUrl" :alt="getTechBySlug(techSlug)!.name" class="size-4 object-contain" />
              {{ getTechBySlug(techSlug)?.name || techSlug }}
            </span>
          </div>
        </div>
        <p class="text-lg leading-9 text-[#4b5a54] dark:text-[#b8c4be]">{{ project.description[locale] }}</p>
      </div>

      <section v-if="otherProjects.length" class="py-16">
        <h2 class="text-3xl font-semibold tracking-normal">{{ t('project.others') }}</h2>
        <div class="mt-8 grid gap-4 md:grid-cols-3">
          <NuxtLink
            v-for="item in otherProjects"
            :key="item.slug"
            :to="`/projetos/${item.slug}`"
            class="group rounded-2xl border border-black/10 bg-white p-5 transition hover:-translate-y-1 dark:border-white/10 dark:bg-white/5"
          >
            <h3 class="text-lg font-semibold">{{ item.title }}</h3>
            <p class="mt-3 text-sm leading-6 text-[#5f6b66] dark:text-[#a8b4ae]">{{ item.shortDescription[locale] }}</p>
          </NuxtLink>
        </div>
      </section>
    </section>
  </main>
</template>
