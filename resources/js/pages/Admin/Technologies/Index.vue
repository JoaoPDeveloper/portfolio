<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import { Edit3, Plus, Trash2 } from 'lucide-vue-next';

type Technology = {
    id: number;
    name: string;
    slug: string;
    color?: string | null;
    resolved_icon_url?: string | null;
    is_featured: boolean;
    projects_count: number;
};

type Page<T> = {
    data: T[];
    links: { url: string | null; label: string; active: boolean }[];
};

defineProps<{
    technologies: Page<Technology>;
}>();
</script>

<template>
    <Head title="Tecnologias" />

    <div class="space-y-6 p-4 sm:p-6">
        <section class="flex flex-col justify-between gap-4 border-b pb-6 sm:flex-row sm:items-end">
            <div>
                <p class="text-sm font-medium text-muted-foreground">Conteúdo</p>
                <h1 class="mt-2 text-3xl font-semibold tracking-normal">Tecnologias</h1>
            </div>
            <Link href="/admin/tecnologias/create" class="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground">
                <Plus class="size-4" /> Nova tecnologia
            </Link>
        </section>

        <section class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <article v-for="technology in technologies.data" :key="technology.id" class="rounded-lg border bg-background p-5">
                <div class="flex items-start justify-between gap-4">
                    <div class="flex items-center gap-3">
                        <div class="flex size-12 items-center justify-center rounded-md border bg-muted/40">
                            <img v-if="technology.resolved_icon_url" :src="technology.resolved_icon_url" :alt="technology.name" class="size-7 object-contain" />
                        </div>
                        <div>
                            <h2 class="font-semibold">{{ technology.name }}</h2>
                            <p class="text-sm text-muted-foreground">{{ technology.slug }}</p>
                        </div>
                    </div>
                    <span class="size-4 rounded-full border" :style="{ backgroundColor: technology.color || 'transparent' }" />
                </div>
                <div class="mt-5 flex items-center justify-between text-sm text-muted-foreground">
                    <span>{{ technology.projects_count }} projetos</span>
                    <span>{{ technology.is_featured ? 'Visível na home' : 'Oculta da home' }}</span>
                </div>
                <div class="mt-5 flex justify-end gap-2">
                    <Link :href="`/admin/tecnologias/${technology.id}/edit`" class="inline-flex size-9 items-center justify-center rounded-md border text-muted-foreground transition hover:text-foreground">
                        <Edit3 class="size-4" />
                    </Link>
                    <Link :href="`/admin/tecnologias/${technology.id}`" method="delete" as="button" class="inline-flex size-9 items-center justify-center rounded-md border text-muted-foreground transition hover:border-red-300 hover:text-red-600">
                        <Trash2 class="size-4" />
                    </Link>
                </div>
            </article>
        </section>

        <div v-if="!technologies.data.length" class="rounded-lg border p-10 text-center text-sm text-muted-foreground">
            Nenhuma tecnologia cadastrada.
        </div>
    </div>
</template>
