<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import { Edit3, ExternalLink, Plus, Trash2 } from 'lucide-vue-next';

type Technology = {
    id: number;
    name: string;
};

type Project = {
    id: number;
    title: string;
    slug: string;
    short_description?: string | null;
    resolved_image_url?: string | null;
    is_published: boolean;
    is_featured: boolean;
    technologies: Technology[];
};

type Page<T> = {
    data: T[];
    links: { url: string | null; label: string; active: boolean }[];
};

defineProps<{
    projects: Page<Project>;
}>();

const paginationLabel = (label: string) =>
    label.replace('&laquo;', '‹').replace('&raquo;', '›');
</script>

<template>
    <Head title="Projetos" />

    <div class="space-y-6 p-4 sm:p-6">
        <section class="flex flex-col justify-between gap-4 border-b pb-6 sm:flex-row sm:items-end">
            <div>
                <p class="text-sm font-medium text-muted-foreground">Conteúdo</p>
                <h1 class="mt-2 text-3xl font-semibold tracking-normal">Projetos</h1>
            </div>
            <Link href="/admin/projetos/create" class="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground">
                <Plus class="size-4" /> Novo projeto
            </Link>
        </section>

        <section class="overflow-hidden rounded-lg border bg-background">
            <div class="hidden grid-cols-[1.1fr_1fr_180px_140px] gap-4 border-b bg-muted/40 px-5 py-3 text-sm font-medium text-muted-foreground md:grid">
                <span>Projeto</span>
                <span>Stack</span>
                <span>Status</span>
                <span class="text-right">Ações</span>
            </div>

            <div class="divide-y">
                <article v-for="project in projects.data" :key="project.id" class="grid gap-4 px-5 py-5 md:grid-cols-[1.1fr_1fr_180px_140px] md:items-center">
                    <div class="flex items-center gap-4">
                        <div class="size-16 overflow-hidden rounded-md bg-muted">
                            <img v-if="project.resolved_image_url" :src="project.resolved_image_url" :alt="project.title" class="h-full w-full object-cover" />
                        </div>
                        <div>
                            <h2 class="font-semibold">{{ project.title }}</h2>
                            <p class="text-sm text-muted-foreground">/projetos/{{ project.slug }}</p>
                        </div>
                    </div>
                    <div class="flex flex-wrap gap-2">
                        <span v-for="technology in project.technologies" :key="technology.id" class="rounded-full border px-2.5 py-1 text-xs text-muted-foreground">
                            {{ technology.name }}
                        </span>
                    </div>
                    <div class="flex flex-wrap gap-2">
                        <span class="rounded-full px-3 py-1 text-xs" :class="project.is_published ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300' : 'bg-muted text-muted-foreground'">
                            {{ project.is_published ? 'Publicado' : 'Rascunho' }}
                        </span>
                        <span v-if="project.is_featured" class="rounded-full bg-amber-500/10 px-3 py-1 text-xs text-amber-700 dark:text-amber-300">
                            Destaque
                        </span>
                    </div>
                    <div class="flex items-center justify-end gap-2">
                        <a :href="`/projetos/${project.slug}`" target="_blank" class="inline-flex size-9 items-center justify-center rounded-md border text-muted-foreground transition hover:text-foreground" aria-label="Abrir projeto">
                            <ExternalLink class="size-4" />
                        </a>
                        <Link :href="`/admin/projetos/${project.id}/edit`" class="inline-flex size-9 items-center justify-center rounded-md border text-muted-foreground transition hover:text-foreground" aria-label="Editar projeto">
                            <Edit3 class="size-4" />
                        </Link>
                        <Link
                            :href="`/admin/projetos/${project.id}`"
                            method="delete"
                            as="button"
                            class="inline-flex size-9 items-center justify-center rounded-md border text-muted-foreground transition hover:border-red-300 hover:text-red-600"
                            aria-label="Remover projeto"
                        >
                            <Trash2 class="size-4" />
                        </Link>
                    </div>
                </article>

                <div v-if="!projects.data.length" class="p-10 text-center text-sm text-muted-foreground">
                    Nenhum projeto cadastrado.
                </div>
            </div>
        </section>

        <nav v-if="projects.links.length > 3" class="flex flex-wrap gap-2">
            <Link
                v-for="link in projects.links"
                :key="link.label"
                :href="link.url || '#'"
                class="rounded-md border px-3 py-2 text-sm"
                :class="link.active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'"
            >
                {{ paginationLabel(link.label) }}
            </Link>
        </nav>
    </div>
</template>
