<script setup lang="ts">
import { Head, Link, useForm } from '@inertiajs/vue3';
import { ArrowLeft, Save } from 'lucide-vue-next';
import InputError from '@/components/InputError.vue';

type SocialLink = {
    id: number;
    label: string;
    url: string;
    icon?: string | null;
    sort_order: number;
    is_published: boolean;
};

const props = defineProps<{
    link: SocialLink | null;
}>();

const form = useForm({
    _method: props.link ? 'put' : 'post',
    label: props.link?.label ?? '',
    url: props.link?.url ?? '',
    icon: props.link?.icon ?? '',
    sort_order: props.link?.sort_order ?? 0,
    is_published: props.link?.is_published ?? true,
});

const submit = () => {
    const url = props.link ? `/admin/links/${props.link.id}` : '/admin/links';
    form.post(url);
};
</script>

<template>
    <Head :title="link ? 'Editar link' : 'Novo link'" />

    <div class="space-y-6 p-4 sm:p-6">
        <section class="flex items-center justify-between border-b pb-6">
            <div>
                <Link href="/admin/links" class="mb-3 inline-flex items-center gap-2 text-sm text-muted-foreground">
                    <ArrowLeft class="size-4" /> Voltar
                </Link>
                <h1 class="text-3xl font-semibold tracking-normal">{{ link ? 'Editar link' : 'Novo link' }}</h1>
            </div>
            <button type="button" class="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground" @click="submit">
                <Save class="size-4" /> Salvar
            </button>
        </section>

        <form class="max-w-2xl space-y-5 rounded-lg border bg-background p-5" @submit.prevent="submit">
            <label class="block space-y-2">
                <span class="text-sm font-medium">Rótulo</span>
                <input v-model="form.label" class="h-10 w-full rounded-md border bg-background px-3 text-sm" />
                <InputError :message="form.errors.label" />
            </label>
            <label class="block space-y-2">
                <span class="text-sm font-medium">URL</span>
                <input v-model="form.url" class="h-10 w-full rounded-md border bg-background px-3 text-sm" />
                <InputError :message="form.errors.url" />
            </label>
            <label class="block space-y-2">
                <span class="text-sm font-medium">Ícone Lucide</span>
                <input v-model="form.icon" class="h-10 w-full rounded-md border bg-background px-3 text-sm" placeholder="Github, Linkedin, Mail, Coffee" />
                <InputError :message="form.errors.icon" />
            </label>
            <div class="grid gap-4 md:grid-cols-2">
                <label class="block space-y-2">
                    <span class="text-sm font-medium">Ordem</span>
                    <input v-model="form.sort_order" type="number" min="0" class="h-10 w-full rounded-md border bg-background px-3 text-sm" />
                </label>
                <label class="mt-8 flex items-center gap-3 text-sm">
                    <input v-model="form.is_published" type="checkbox" class="size-4 rounded border" />
                    Publicado
                </label>
            </div>
        </form>
    </div>
</template>
