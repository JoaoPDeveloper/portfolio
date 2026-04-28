<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import { ArrowLeft, ArrowUpRight, Github, Mail } from 'lucide-vue-next';

type Technology = {
    id: number;
    name: string;
    color?: string | null;
    resolved_icon_url?: string | null;
};

type Project = {
    id: number;
    title: string;
    slug: string;
    short_description?: string | null;
    description: string;
    resolved_image_url?: string | null;
    project_url?: string | null;
    github_url?: string | null;
    technologies: Technology[];
};

type Profile = {
    name: string;
    email?: string | null;
};

defineProps<{
    profile: Profile;
    project: Project;
    otherProjects: Project[];
}>();
</script>

<template>
    <Head :title="`${project.title} - ${profile.name}`" />

    <main class="min-h-screen bg-[#f6f7f4] text-[#121512] dark:bg-[#090d0c] dark:text-[#f5f7f2]">
        <section class="mx-auto max-w-7xl px-5 py-8 sm:px-8">
            <nav class="flex items-center justify-between">
                <Link href="/" class="inline-flex items-center gap-2 text-sm font-medium text-[#5f6b66] transition hover:text-[#121512] dark:text-[#a8b4ae] dark:hover:text-white">
                    <ArrowLeft class="size-4" /> Voltar
                </Link>
                <a v-if="profile.email" :href="`mailto:${profile.email}`" class="inline-flex items-center gap-2 rounded-full border border-black/10 px-4 py-2 text-sm font-medium dark:border-white/10">
                    <Mail class="size-4" /> Contato
                </a>
            </nav>

            <div class="grid gap-10 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
                <div>
                    <p class="text-sm font-semibold uppercase tracking-[0.22em] text-[#11b5a4]">Projeto</p>
                    <h1 class="mt-4 text-5xl font-semibold leading-none tracking-normal sm:text-7xl">{{ project.title }}</h1>
                    <p class="mt-6 max-w-2xl text-lg leading-8 text-[#4b5a54] dark:text-[#b8c4be]">{{ project.short_description }}</p>
                    <div class="mt-8 flex flex-wrap gap-3">
                        <a
                            v-if="project.project_url"
                            :href="project.project_url"
                            target="_blank"
                            rel="noreferrer"
                            class="inline-flex h-12 items-center gap-2 rounded-full bg-[#11b5a4] px-5 text-sm font-semibold text-[#06100e] transition hover:-translate-y-1"
                        >
                            Abrir projeto <ArrowUpRight class="size-4" />
                        </a>
                        <a
                            v-if="project.github_url"
                            :href="project.github_url"
                            target="_blank"
                            rel="noreferrer"
                            class="inline-flex h-12 items-center gap-2 rounded-full border border-black/10 bg-white/70 px-5 text-sm font-semibold dark:border-white/10 dark:bg-white/5"
                        >
                            Repositório <Github class="size-4" />
                        </a>
                    </div>
                </div>

                <div class="overflow-hidden rounded-3xl border border-black/10 bg-white shadow-2xl shadow-black/5 dark:border-white/10 dark:bg-[#101614]">
                    <img v-if="project.resolved_image_url" :src="project.resolved_image_url" :alt="project.title" class="aspect-[16/10] w-full object-cover" />
                </div>
            </div>

            <div class="grid gap-10 border-y border-black/10 py-12 dark:border-white/10 lg:grid-cols-[0.8fr_1.2fr]">
                <div>
                    <h2 class="text-2xl font-semibold">Contexto</h2>
                    <div class="mt-6 flex flex-wrap gap-2">
                        <span
                            v-for="technology in project.technologies"
                            :key="technology.id"
                            class="inline-flex items-center gap-2 rounded-full border border-black/10 px-3 py-1.5 text-sm dark:border-white/10"
                        >
                            <img v-if="technology.resolved_icon_url" :src="technology.resolved_icon_url" :alt="technology.name" class="size-4 object-contain" />
                            {{ technology.name }}
                        </span>
                    </div>
                </div>
                <p class="text-lg leading-9 text-[#4b5a54] dark:text-[#b8c4be]">{{ project.description }}</p>
            </div>

            <section v-if="otherProjects.length" class="py-16">
                <h2 class="text-3xl font-semibold tracking-normal">Outros projetos</h2>
                <div class="mt-8 grid gap-4 md:grid-cols-3">
                    <Link
                        v-for="item in otherProjects"
                        :key="item.id"
                        :href="`/projetos/${item.slug}`"
                        class="group rounded-2xl border border-black/10 bg-white p-5 transition hover:-translate-y-1 dark:border-white/10 dark:bg-white/5"
                    >
                        <h3 class="text-lg font-semibold">{{ item.title }}</h3>
                        <p class="mt-3 text-sm leading-6 text-[#5f6b66] dark:text-[#a8b4ae]">{{ item.short_description }}</p>
                    </Link>
                </div>
            </section>
        </section>
    </main>
</template>
