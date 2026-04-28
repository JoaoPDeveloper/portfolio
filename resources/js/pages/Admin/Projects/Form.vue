<script setup lang="ts">
import { Head, Link, useForm } from '@inertiajs/vue3';
import { ArrowLeft, Save } from 'lucide-vue-next';
import InputError from '@/components/InputError.vue';

type Technology = {
    id: number;
    name: string;
    color?: string | null;
};

type Project = {
    id: number;
    title: string;
    slug: string;
    short_description?: string | null;
    description: string;
    image_url?: string | null;
    resolved_image_url?: string | null;
    project_url?: string | null;
    github_url?: string | null;
    sort_order: number;
    is_published: boolean;
    is_featured: boolean;
    technology_ids: number[];
};

const props = defineProps<{
    project: Project | null;
    technologies: Technology[];
}>();

const form = useForm({
    _method: props.project ? 'put' : 'post',
    title: props.project?.title ?? '',
    slug: props.project?.slug ?? '',
    short_description: props.project?.short_description ?? '',
    description: props.project?.description ?? '',
    image_url: props.project?.image_url ?? '',
    image: null as File | null,
    project_url: props.project?.project_url ?? '',
    github_url: props.project?.github_url ?? '',
    sort_order: props.project?.sort_order ?? 0,
    is_published: props.project?.is_published ?? true,
    is_featured: props.project?.is_featured ?? false,
    technology_ids: props.project?.technology_ids ?? [],
});

const submit = () => {
    const url = props.project ? `/admin/projetos/${props.project.id}` : '/admin/projetos';

    form.post(url, {
        forceFormData: true,
    });
};

const updateImage = (event: Event) => {
    const input = event.target as HTMLInputElement;
    form.image = input.files?.[0] ?? null;
};
</script>

<template>
    <Head :title="project ? 'Editar projeto' : 'Novo projeto'" />

    <div class="space-y-6 p-4 sm:p-6">
        <section class="flex items-center justify-between border-b pb-6">
            <div>
                <Link href="/admin/projetos" class="mb-3 inline-flex items-center gap-2 text-sm text-muted-foreground">
                    <ArrowLeft class="size-4" /> Voltar
                </Link>
                <h1 class="text-3xl font-semibold tracking-normal">{{ project ? 'Editar projeto' : 'Novo projeto' }}</h1>
            </div>
            <button type="button" class="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground" @click="submit">
                <Save class="size-4" /> Salvar
            </button>
        </section>

        <form class="grid gap-6 lg:grid-cols-[1fr_360px]" @submit.prevent="submit">
            <section class="space-y-5 rounded-lg border bg-background p-5">
                <label class="block space-y-2">
                    <span class="text-sm font-medium">Título</span>
                    <input v-model="form.title" class="h-10 w-full rounded-md border bg-background px-3 text-sm" />
                    <InputError :message="form.errors.title" />
                </label>

                <label class="block space-y-2">
                    <span class="text-sm font-medium">Slug</span>
                    <input v-model="form.slug" class="h-10 w-full rounded-md border bg-background px-3 text-sm" placeholder="gerado automaticamente se ficar vazio" />
                    <InputError :message="form.errors.slug" />
                </label>

                <label class="block space-y-2">
                    <span class="text-sm font-medium">Descrição curta</span>
                    <textarea v-model="form.short_description" rows="3" class="w-full rounded-md border bg-background px-3 py-2 text-sm" />
                    <InputError :message="form.errors.short_description" />
                </label>

                <label class="block space-y-2">
                    <span class="text-sm font-medium">Descrição completa</span>
                    <textarea v-model="form.description" rows="8" class="w-full rounded-md border bg-background px-3 py-2 text-sm" />
                    <InputError :message="form.errors.description" />
                </label>

                <div class="grid gap-4 md:grid-cols-2">
                    <label class="block space-y-2">
                        <span class="text-sm font-medium">Link do projeto</span>
                        <input v-model="form.project_url" class="h-10 w-full rounded-md border bg-background px-3 text-sm" />
                        <InputError :message="form.errors.project_url" />
                    </label>
                    <label class="block space-y-2">
                        <span class="text-sm font-medium">Link GitHub</span>
                        <input v-model="form.github_url" class="h-10 w-full rounded-md border bg-background px-3 text-sm" />
                        <InputError :message="form.errors.github_url" />
                    </label>
                </div>
            </section>

            <aside class="space-y-5">
                <section class="rounded-lg border bg-background p-5">
                    <h2 class="font-semibold">Publicação</h2>
                    <div class="mt-4 space-y-3">
                        <label class="flex items-center gap-3 text-sm">
                            <input v-model="form.is_published" type="checkbox" class="size-4 rounded border" />
                            Publicado
                        </label>
                        <label class="flex items-center gap-3 text-sm">
                            <input v-model="form.is_featured" type="checkbox" class="size-4 rounded border" />
                            Destaque na home
                        </label>
                        <label class="block space-y-2">
                            <span class="text-sm font-medium">Ordem</span>
                            <input v-model="form.sort_order" type="number" min="0" class="h-10 w-full rounded-md border bg-background px-3 text-sm" />
                        </label>
                    </div>
                </section>

                <section class="rounded-lg border bg-background p-5">
                    <h2 class="font-semibold">Imagem</h2>
                    <div v-if="project?.resolved_image_url" class="mt-4 overflow-hidden rounded-md border">
                        <img :src="project.resolved_image_url" :alt="project.title" class="aspect-video w-full object-cover" />
                    </div>
                    <label class="mt-4 block space-y-2">
                        <span class="text-sm font-medium">URL externa</span>
                        <input v-model="form.image_url" class="h-10 w-full rounded-md border bg-background px-3 text-sm" />
                        <InputError :message="form.errors.image_url" />
                    </label>
                    <label class="mt-4 block space-y-2">
                        <span class="text-sm font-medium">Upload</span>
                        <input type="file" accept="image/*" class="w-full text-sm" @change="updateImage" />
                        <InputError :message="form.errors.image" />
                    </label>
                </section>

                <section class="rounded-lg border bg-background p-5">
                    <h2 class="font-semibold">Tecnologias</h2>
                    <div class="mt-4 grid gap-2">
                        <label v-for="technology in technologies" :key="technology.id" class="flex items-center gap-3 rounded-md border px-3 py-2 text-sm">
                            <input v-model="form.technology_ids" type="checkbox" :value="technology.id" class="size-4 rounded border" />
                            {{ technology.name }}
                        </label>
                    </div>
                    <InputError :message="form.errors.technology_ids" />
                </section>
            </aside>
        </form>
    </div>
</template>
