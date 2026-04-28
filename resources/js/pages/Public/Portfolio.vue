<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import {
    ArrowRight,
    ArrowUpRight,
    Coffee,
    Github,
    Linkedin,
    Mail,
    MapPin,
    Globe,
    Moon,
    Sparkles,
    Sun,
} from 'lucide-vue-next';
import { computed } from 'vue';
import { useAppearance } from '@/composables/useAppearance';

type Technology = {
    id: number;
    name: string;
    slug: string;
    color?: string | null;
    url?: string | null;
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
    is_featured: boolean;
    technologies: Technology[];
};

type Profile = {
    name: string;
    role: string;
    headline: string;
    intro: string;
    bio?: string | null;
    about_points?: string[] | null;
    resolved_avatar_url?: string | null;
    email?: string | null;
    location?: string | null;
};

type SocialLink = {
    id: number;
    label: string;
    url: string;
    icon?: string | null;
};

const props = defineProps<{
    profile: Profile;
    projects: Project[];
    technologies: Technology[];
    socialLinks: SocialLink[];
}>();

const { resolvedAppearance, updateAppearance } = useAppearance();

const featuredProjects = computed(() =>
    props.projects.filter((project) => project.is_featured).slice(0, 3),
);

const iconMap = {
    Coffee,
    Github,
    Linkedin,
    Mail,
};

const socialIcon = (icon?: string | null) =>
    icon && icon in iconMap ? iconMap[icon as keyof typeof iconMap] : ArrowUpRight;

const toggleTheme = () => {
    updateAppearance(resolvedAppearance.value === 'dark' ? 'light' : 'dark');
};

const avatarUrl = computed(() =>
    props.profile.resolved_avatar_url || 'https://portfolio-joaopdeveloper.vercel.app/assets/imgs/95835981.png'
);

const translatePage = (lang = 'en') => {
    const url = `https://translate.google.com/translate?sl=auto&tl=${lang}&u=${encodeURIComponent(window.location.href)}`;
    window.open(url, '_blank');
};
</script>

<template>
    <Head :title="`${profile.name} - Portfolio`" />

    <main class="min-h-screen bg-[#f6f7f4] text-[#121512] dark:bg-[#090d0c] dark:text-[#f5f7f2]">
        <header class="fixed inset-x-0 top-0 z-30 border-b border-black/5 bg-[#f6f7f4]/80 backdrop-blur-xl dark:border-white/10 dark:bg-[#090d0c]/80">
            <nav class="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
                <Link href="/" class="font-semibold tracking-tight">JoaoPDeveloper</Link>

                <div class="flex items-center gap-2 text-sm">
                    <a href="#projetos" class="hidden text-[#5f6b66] transition-all duration-500 ease-in-out hover:text-[#121512] sm:inline dark:text-[#a8b4ae] dark:hover:text-white">Projetos</a>
                    <a href="#stack" class="hidden text-[#5f6b66] transition-all duration-500 ease-in-out hover:text-[#121512] sm:inline dark:text-[#a8b4ae] dark:hover:text-white">Stack</a>
                    <a href="#contato" class="hidden text-[#5f6b66] transition-all duration-500 ease-in-out hover:text-[#121512] sm:inline dark:text-[#a8b4ae] dark:hover:text-white">Contato</a>

                    <button
                        type="button"
                        class="inline-flex h-10 items-center rounded-full border border-black/10 bg-white/70 px-3 text-sm font-medium text-[#121512] transition-all duration-500 ease-in-out hover:-translate-y-0.5 dark:border-white/10 dark:bg-white/5 dark:text-white"
                        aria-label="Traduzir página"
                        @click="translatePage('en')"
                    >
                        <Globe class="size-4" />
                    </button>

                    <button
                        type="button"
                        class="inline-flex size-10 items-center justify-center rounded-full border border-black/10 bg-white/70 text-[#121512] transition-all duration-500 ease-in-out hover:-translate-y-0.5 hover:border-[#11b5a4]/50 dark:border-white/10 dark:bg-white/5 dark:text-white"
                        aria-label="Alternar tema"
                        @click="toggleTheme"
                    >
                        <Sun v-if="resolvedAppearance === 'dark'" class="size-4" />
                        <Moon v-else class="size-4" />
                    </button>
                </div>
            </nav>
        </header>

        <section class="relative isolate flex min-h-[92svh] items-center overflow-hidden pt-20">
            <div class="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(17,181,164,0.22),transparent_28%),radial-gradient(circle_at_80%_10%,rgba(232,255,109,0.20),transparent_24%),linear-gradient(135deg,rgba(255,255,255,0.80),rgba(246,247,244,0.35))] dark:bg-[radial-gradient(circle_at_20%_20%,rgba(17,181,164,0.20),transparent_28%),radial-gradient(circle_at_80%_10%,rgba(232,255,109,0.14),transparent_24%),linear-gradient(135deg,rgba(9,13,12,0.96),rgba(12,22,20,0.88))]" />
            <div class="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-[#f6f7f4] to-transparent dark:from-[#090d0c]" />

            <div class="mx-auto grid w-full max-w-7xl items-center gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[1.05fr_0.95fr]">
                <div class="motion-enter max-w-3xl">
                    <p class="mb-5 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/60 px-4 py-2 text-sm text-[#41524c] dark:border-white/10 dark:bg-white/5 dark:text-[#b9c6c0]">
                        <Sparkles class="size-4 text-[#11b5a4]" />
                        {{ profile.role }}
                    </p>
                    <h1 class="max-w-4xl text-5xl font-semibold leading-[0.96] tracking-normal text-[#121512] sm:text-7xl dark:text-white">
                        {{ profile.name }}
                    </h1>
                    <p class="mt-6 max-w-2xl text-xl leading-8 text-[#33413b] dark:text-[#c5d1cb]">
                        {{ profile.headline }}
                    </p>
                    <p class="mt-4 max-w-2xl text-base leading-7 text-[#63716b] dark:text-[#97a49e]">
                        {{ profile.intro }}
                    </p>

                    <div class="mt-8 flex flex-wrap gap-3">
                        <a
                            href="#projetos"
                            class="inline-flex h-12 items-center gap-2 rounded-full bg-[#11b5a4] px-5 text-sm font-semibold text-[#06100e] transition-transform duration-500 ease-in-out hover:-translate-y-1 hover:bg-[#44d7c7]"
                        >
                            Ver projetos <ArrowRight class="size-4" />
                        </a>
                        <a
                            v-if="profile.email"
                            :href="`mailto:${profile.email}`"
                            class="inline-flex h-12 items-center gap-2 rounded-full border border-black/10 bg-white/70 px-5 text-sm font-semibold text-[#121512] transition hover:-translate-y-1 dark:border-white/10 dark:bg-white/5 dark:text-white"
                        >
                            Conversar <Mail class="size-4" />
                        </a>
                    </div>
                </div>

                <div class="motion-enter motion-delay relative min-h-[420px]">
                    <div class="absolute inset-0 rounded-[2rem] border border-black/10 bg-[#121512] shadow-2xl shadow-[#11b5a4]/10 dark:border-white/10" />
                    <img
                        :src="avatarUrl"
                        :alt="profile.name"
                        class="absolute inset-x-8 bottom-0 mx-auto h-[92%] max-h-[520px] w-auto object-contain"
                    />
                    <div class="absolute bottom-6 left-6 right-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/10 p-4 text-white backdrop-blur-xl">
                        <span class="text-sm text-white/70">Disponivel para novos projetos</span>
                        <span v-if="profile.location" class="inline-flex items-center gap-2 text-sm">
                            <MapPin class="size-4 text-[#e8ff6d]" /> {{ profile.location }}
                        </span>
                    </div>
                </div>
            </div>
        </section>

        <section class="mx-auto grid max-w-7xl gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[0.75fr_1.25fr]">
            <div>
                <p class="text-sm font-semibold uppercase tracking-[0.22em] text-[#11b5a4]">Sobre</p>
                <h2 class="mt-3 text-3xl font-semibold tracking-normal sm:text-4xl">Da operação ao produto.</h2>
            </div>
            <div class="space-y-8">
                <p class="max-w-3xl text-lg leading-8 text-[#4b5a54] dark:text-[#b8c4be]">
                    {{ profile.bio }}
                </p>
                <div class="grid gap-4 md:grid-cols-3">
                    <div
                        v-for="point in profile.about_points"
                        :key="point"
                        class="rounded-2xl border border-black/10 bg-white/60 p-5 text-sm leading-6 text-[#43514b] dark:border-white/10 dark:bg-white/5 dark:text-[#bac6c0]"
                    >
                        {{ point }}
                    </div>
                </div>
            </div>
        </section>

        <section id="stack" class="border-y border-black/10 bg-white/60 py-16 dark:border-white/10 dark:bg-white/[0.03]">
            <div class="mx-auto max-w-7xl px-5 sm:px-8">
                <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                    <div>
                        <p class="text-sm font-semibold uppercase tracking-[0.22em] text-[#11b5a4]">Tech stack</p>
                        <h2 class="mt-3 text-3xl font-semibold tracking-normal">Ferramentas que uso para construir.</h2>
                    </div>
                    <p class="max-w-xl text-sm leading-6 text-[#66736e] dark:text-[#9ca9a3]">
                        Stack atual migrada para dados editáveis no painel, sem depender de arrays soltos no navegador.
                    </p>
                </div>

                <div class="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                    <a
                        v-for="technology in technologies"
                        :key="technology.id"
                        :href="technology.url || '#'"
                        target="_blank"
                        rel="noreferrer"
                        class="group flex min-h-28 flex-col justify-between rounded-2xl border border-black/10 bg-[#f6f7f4] p-4 transition-transform duration-500 ease-in-out hover:-translate-y-1 hover:border-[#11b5a4]/60 dark:border-white/10 dark:bg-[#111715]"
                    >
                        <img v-if="technology.resolved_icon_url" :src="technology.resolved_icon_url" :alt="technology.name" class="size-9 object-contain" />
                        <span class="text-sm font-semibold">{{ technology.name }}</span>
                    </a>
                </div>
            </div>
        </section>

        <section id="projetos" class="mx-auto max-w-7xl px-5 py-20 sm:px-8">
            <div class="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                <div>
                    <p class="text-sm font-semibold uppercase tracking-[0.22em] text-[#11b5a4]">Projetos</p>
                    <h2 class="mt-3 text-3xl font-semibold tracking-normal sm:text-5xl">Trabalho selecionado.</h2>
                </div>
                <p class="max-w-xl text-sm leading-6 text-[#66736e] dark:text-[#9ca9a3]">
                    Projetos publicados pelo painel ADM, com tecnologias, links e imagens atualizáveis.
                </p>
            </div>

            <div class="mt-12 grid gap-5 lg:grid-cols-3">
                <Link
                    v-for="project in featuredProjects"
                    :key="project.id"
                    :href="`/projetos/${project.slug}`"
                    class="group overflow-hidden rounded-2xl border border-black/10 bg-white transition-transform duration-500 ease-in-out hover:-translate-y-1 hover:border-[#11b5a4]/60 dark:border-white/10 dark:bg-[#101614]"
                >
                    <div class="aspect-[16/10] overflow-hidden bg-[#dce4df] dark:bg-[#16211e]">
                        <img v-if="project.resolved_image_url" :src="project.resolved_image_url" :alt="project.title" class="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                    </div>
                    <div class="space-y-4 p-5">
                        <div class="flex items-start justify-between gap-4">
                            <h3 class="text-xl font-semibold">{{ project.title }}</h3>
                            <ArrowUpRight class="mt-1 size-5 shrink-0 text-[#11b5a4]" />
                        </div>
                        <p class="text-sm leading-6 text-[#5f6b66] dark:text-[#a8b4ae]">{{ project.short_description }}</p>
                        <div class="flex flex-wrap gap-2">
                            <span
                                v-for="technology in project.technologies"
                                :key="technology.id"
                                class="rounded-full border border-black/10 px-3 py-1 text-xs text-[#5f6b66] dark:border-white/10 dark:text-[#b9c6c0]"
                            >
                                {{ technology.name }}
                            </span>
                        </div>
                    </div>
                </Link>
            </div>

            <div class="mt-10 divide-y divide-black/10 border-y border-black/10 dark:divide-white/10 dark:border-white/10">
                <Link
                    v-for="project in projects"
                    :key="project.id"
                    :href="`/projetos/${project.slug}`"
                    class="group grid gap-4 py-6 transition-all duration-500 ease-in-out hover:px-3 md:grid-cols-[1fr_1.5fr_auto]"
                >
                    <h3 class="text-xl font-semibold">{{ project.title }}</h3>
                    <p class="text-sm leading-6 text-[#5f6b66] dark:text-[#a8b4ae]">{{ project.short_description }}</p>
                    <ArrowUpRight class="size-5 text-[#11b5a4]" />
                </Link>
            </div>
        </section>

        <footer id="contato" class="border-t border-black/10 bg-[#121512] text-white dark:border-white/10">
            <div class="mx-auto flex max-w-7xl flex-col justify-between gap-8 px-5 py-12 sm:px-8 md:flex-row md:items-center">
                <div>
                    <p class="text-sm text-white/55">Vamos construir algo com boa base e boa cara.</p>
                    <h2 class="mt-2 text-3xl font-semibold tracking-normal">Entre em contato.</h2>
                </div>
                <div class="flex flex-wrap gap-3">
                    <a
                        v-for="link in socialLinks"
                        :key="link.id"
                        :href="link.url"
                        target="_blank"
                        rel="noreferrer"
                        class="inline-flex h-11 items-center gap-2 rounded-full border border-white/10 px-4 text-sm transition-transform duration-500 ease-in-out hover:-translate-y-0.5 hover:border-[#e8ff6d]/60"
                    >
                        <component :is="socialIcon(link.icon)" class="size-4" />
                        {{ link.label }}
                    </a>
                </div>
            </div>
        </footer>
    </main>
</template>
