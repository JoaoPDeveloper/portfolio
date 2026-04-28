<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import { ArrowUpRight, FolderKanban, Link2, Sparkles } from 'lucide-vue-next';

type Stats = {
    projects: number;
    publishedProjects: number;
    technologies: number;
    socialLinks: number;
};

type Project = {
    id: number;
    title: string;
    slug: string;
    is_published: boolean;
    updated_at: string;
};

defineProps<{
    stats: Stats;
    recentProjects: Project[];
}>();

const statItems = [
    { key: 'projects', label: 'Projetos', icon: FolderKanban },
    { key: 'publishedProjects', label: 'Publicados', icon: ArrowUpRight },
    { key: 'technologies', label: 'Tecnologias', icon: Sparkles },
    { key: 'socialLinks', label: 'Links ativos', icon: Link2 },
] as const;
</script>

<template>
    <Head title="Painel ADM" />

    <div class="space-y-8 p-4 sm:p-6">
        <section class="flex flex-col justify-between gap-4 border-b pb-6 sm:flex-row sm:items-end">
            <div>
                <p class="text-sm font-medium text-muted-foreground">Painel ADM</p>
                <h1 class="mt-2 text-3xl font-semibold tracking-normal">Conteúdo do portfólio</h1>
            </div>
            <Link href="/admin/projetos/create" class="inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground">
                Novo projeto
            </Link>
        </section>

        <section class="grid gap-4 md:grid-cols-4">
            <div
                v-for="item in statItems"
                :key="item.key"
                class="rounded-lg border bg-background p-5"
            >
                <component :is="item.icon" class="size-5 text-muted-foreground" />
                <p class="mt-5 text-3xl font-semibold">{{ stats[item.key] }}</p>
                <p class="mt-1 text-sm text-muted-foreground">{{ item.label }}</p>
            </div>
        </section>

        <section class="rounded-lg border bg-background">
            <div class="flex items-center justify-between border-b p-5">
                <div>
                    <h2 class="text-lg font-semibold">Projetos recentes</h2>
                    <p class="text-sm text-muted-foreground">Últimos itens atualizados no painel.</p>
                </div>
                <Link href="/admin/projetos" class="text-sm font-medium text-primary">Gerenciar</Link>
            </div>
            <div class="divide-y">
                <div v-for="project in recentProjects" :key="project.id" class="flex items-center justify-between gap-4 p-5">
                    <div>
                        <p class="font-medium">{{ project.title }}</p>
                        <p class="text-sm text-muted-foreground">/projetos/{{ project.slug }}</p>
                    </div>
                    <span class="rounded-full px-3 py-1 text-xs" :class="project.is_published ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300' : 'bg-muted text-muted-foreground'">
                        {{ project.is_published ? 'Publicado' : 'Rascunho' }}
                    </span>
                </div>
                <div v-if="!recentProjects.length" class="p-8 text-center text-sm text-muted-foreground">
                    Nenhum projeto cadastrado ainda.
                </div>
            </div>
        </section>
    </div>
</template>
