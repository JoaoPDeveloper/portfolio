<script setup lang="ts">
import { Head, Link, useForm } from '@inertiajs/vue3';
import { ArrowLeft, Save } from 'lucide-vue-next';
import InputError from '@/components/InputError.vue';

type Technology = {
    id: number;
    name: string;
    slug: string;
    color?: string | null;
    icon_url?: string | null;
    resolved_icon_url?: string | null;
    url?: string | null;
    sort_order: number;
    is_featured: boolean;
};

const props = defineProps<{
    technology: Technology | null;
}>();

const form = useForm({
    _method: props.technology ? 'put' : 'post',
    name: props.technology?.name ?? '',
    slug: props.technology?.slug ?? '',
    color: props.technology?.color ?? '#11b5a4',
    icon_url: props.technology?.icon_url ?? '',
    icon: null as File | null,
    url: props.technology?.url ?? '',
    sort_order: props.technology?.sort_order ?? 0,
    is_featured: props.technology?.is_featured ?? true,
});

const submit = () => {
    const url = props.technology ? `/admin/tecnologias/${props.technology.id}` : '/admin/tecnologias';

    form.post(url, {
        forceFormData: true,
    });
};

const updateIcon = (event: Event) => {
    const input = event.target as HTMLInputElement;
    form.icon = input.files?.[0] ?? null;
};
</script>

<template>
    <Head :title="technology ? 'Editar tecnologia' : 'Nova tecnologia'" />

    <div class="space-y-6 p-4 sm:p-6">
        <section class="flex items-center justify-between border-b pb-6">
            <div>
                <Link href="/admin/tecnologias" class="mb-3 inline-flex items-center gap-2 text-sm text-muted-foreground">
                    <ArrowLeft class="size-4" /> Voltar
                </Link>
                <h1 class="text-3xl font-semibold tracking-normal">{{ technology ? 'Editar tecnologia' : 'Nova tecnologia' }}</h1>
            </div>
            <button type="button" class="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground" @click="submit">
                <Save class="size-4" /> Salvar
            </button>
        </section>

        <form class="grid gap-6 lg:grid-cols-[1fr_320px]" @submit.prevent="submit">
            <section class="space-y-5 rounded-lg border bg-background p-5">
                <label class="block space-y-2">
                    <span class="text-sm font-medium">Nome</span>
                    <input v-model="form.name" class="h-10 w-full rounded-md border bg-background px-3 text-sm" />
                    <InputError :message="form.errors.name" />
                </label>
                <label class="block space-y-2">
                    <span class="text-sm font-medium">Slug</span>
                    <input v-model="form.slug" class="h-10 w-full rounded-md border bg-background px-3 text-sm" placeholder="gerado automaticamente se ficar vazio" />
                    <InputError :message="form.errors.slug" />
                </label>
                <label class="block space-y-2">
                    <span class="text-sm font-medium">Site oficial</span>
                    <input v-model="form.url" class="h-10 w-full rounded-md border bg-background px-3 text-sm" />
                    <InputError :message="form.errors.url" />
                </label>
                <label class="block space-y-2">
                    <span class="text-sm font-medium">URL do ícone</span>
                    <input v-model="form.icon_url" class="h-10 w-full rounded-md border bg-background px-3 text-sm" />
                    <InputError :message="form.errors.icon_url" />
                </label>
            </section>

            <aside class="space-y-5">
                <section class="rounded-lg border bg-background p-5">
                    <h2 class="font-semibold">Exibição</h2>
                    <div class="mt-4 space-y-4">
                        <label class="block space-y-2">
                            <span class="text-sm font-medium">Cor</span>
                            <input v-model="form.color" type="color" class="h-10 w-full rounded-md border bg-background p-1" />
                        </label>
                        <label class="block space-y-2">
                            <span class="text-sm font-medium">Ordem</span>
                            <input v-model="form.sort_order" type="number" min="0" class="h-10 w-full rounded-md border bg-background px-3 text-sm" />
                        </label>
                        <label class="flex items-center gap-3 text-sm">
                            <input v-model="form.is_featured" type="checkbox" class="size-4 rounded border" />
                            Mostrar na home
                        </label>
                    </div>
                </section>

                <section class="rounded-lg border bg-background p-5">
                    <h2 class="font-semibold">Upload</h2>
                    <div v-if="technology?.resolved_icon_url" class="mt-4 flex size-16 items-center justify-center rounded-md border">
                        <img :src="technology.resolved_icon_url" :alt="technology.name" class="size-10 object-contain" />
                    </div>
                    <input type="file" accept="image/*" class="mt-4 w-full text-sm" @change="updateIcon" />
                    <InputError :message="form.errors.icon" />
                </section>
            </aside>
        </form>
    </div>
</template>
