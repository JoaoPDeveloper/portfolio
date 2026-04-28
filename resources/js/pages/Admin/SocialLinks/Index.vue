<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import { Edit3, Plus, Trash2 } from 'lucide-vue-next';

type SocialLink = {
    id: number;
    label: string;
    url: string;
    icon?: string | null;
    sort_order: number;
    is_published: boolean;
};

defineProps<{
    links: SocialLink[];
}>();
</script>

<template>
    <Head title="Links" />

    <div class="space-y-6 p-4 sm:p-6">
        <section class="flex flex-col justify-between gap-4 border-b pb-6 sm:flex-row sm:items-end">
            <div>
                <p class="text-sm font-medium text-muted-foreground">Contato</p>
                <h1 class="mt-2 text-3xl font-semibold tracking-normal">Links sociais</h1>
            </div>
            <Link href="/admin/links/create" class="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground">
                <Plus class="size-4" /> Novo link
            </Link>
        </section>

        <section class="overflow-hidden rounded-lg border bg-background">
            <div class="divide-y">
                <article v-for="link in links" :key="link.id" class="grid gap-4 px-5 py-5 md:grid-cols-[1fr_1.4fr_120px_120px] md:items-center">
                    <div>
                        <h2 class="font-semibold">{{ link.label }}</h2>
                        <p class="text-sm text-muted-foreground">Ícone: {{ link.icon || 'padrão' }}</p>
                    </div>
                    <a :href="link.url" target="_blank" class="truncate text-sm text-muted-foreground hover:text-foreground">{{ link.url }}</a>
                    <span class="rounded-full px-3 py-1 text-center text-xs" :class="link.is_published ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300' : 'bg-muted text-muted-foreground'">
                        {{ link.is_published ? 'Publicado' : 'Oculto' }}
                    </span>
                    <div class="flex justify-end gap-2">
                        <Link :href="`/admin/links/${link.id}/edit`" class="inline-flex size-9 items-center justify-center rounded-md border text-muted-foreground transition hover:text-foreground">
                            <Edit3 class="size-4" />
                        </Link>
                        <Link :href="`/admin/links/${link.id}`" method="delete" as="button" class="inline-flex size-9 items-center justify-center rounded-md border text-muted-foreground transition hover:border-red-300 hover:text-red-600">
                            <Trash2 class="size-4" />
                        </Link>
                    </div>
                </article>
                <div v-if="!links.length" class="p-10 text-center text-sm text-muted-foreground">
                    Nenhum link cadastrado.
                </div>
            </div>
        </section>
    </div>
</template>
