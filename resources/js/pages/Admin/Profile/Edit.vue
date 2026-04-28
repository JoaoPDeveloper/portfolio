<script setup lang="ts">
import { Head, useForm } from '@inertiajs/vue3';
import { Save } from 'lucide-vue-next';
import InputError from '@/components/InputError.vue';

type Profile = {
    id: number;
    name: string;
    role: string;
    headline: string;
    intro: string;
    bio?: string | null;
    about_points?: string[] | null;
    avatar_url?: string | null;
    resolved_avatar_url?: string | null;
    email?: string | null;
    location?: string | null;
    resume_url?: string | null;
};

const props = defineProps<{
    profile: Profile | null;
}>();

const form = useForm({
    _method: 'put',
    name: props.profile?.name ?? '',
    role: props.profile?.role ?? '',
    headline: props.profile?.headline ?? '',
    intro: props.profile?.intro ?? '',
    bio: props.profile?.bio ?? '',
    about_points: (props.profile?.about_points ?? []).join('\n'),
    avatar_url: props.profile?.avatar_url ?? '',
    avatar: null as File | null,
    email: props.profile?.email ?? '',
    location: props.profile?.location ?? '',
    resume_url: props.profile?.resume_url ?? '',
});

const submit = () => {
    form.post('/admin/perfil', {
        forceFormData: true,
    });
};

const updateAvatar = (event: Event) => {
    const input = event.target as HTMLInputElement;
    form.avatar = input.files?.[0] ?? null;
};
</script>

<template>
    <Head title="Perfil" />

    <div class="space-y-6 p-4 sm:p-6">
        <section class="flex flex-col justify-between gap-4 border-b pb-6 sm:flex-row sm:items-end">
            <div>
                <p class="text-sm font-medium text-muted-foreground">Conteúdo</p>
                <h1 class="mt-2 text-3xl font-semibold tracking-normal">Perfil público</h1>
            </div>
            <button type="button" class="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground" @click="submit">
                <Save class="size-4" /> Salvar
            </button>
        </section>

        <form class="grid gap-6 lg:grid-cols-[1fr_340px]" @submit.prevent="submit">
            <section class="space-y-5 rounded-lg border bg-background p-5">
                <div class="grid gap-4 md:grid-cols-2">
                    <label class="block space-y-2">
                        <span class="text-sm font-medium">Nome</span>
                        <input v-model="form.name" class="h-10 w-full rounded-md border bg-background px-3 text-sm" />
                        <InputError :message="form.errors.name" />
                    </label>
                    <label class="block space-y-2">
                        <span class="text-sm font-medium">Cargo</span>
                        <input v-model="form.role" class="h-10 w-full rounded-md border bg-background px-3 text-sm" />
                        <InputError :message="form.errors.role" />
                    </label>
                </div>

                <label class="block space-y-2">
                    <span class="text-sm font-medium">Headline</span>
                    <input v-model="form.headline" class="h-10 w-full rounded-md border bg-background px-3 text-sm" />
                    <InputError :message="form.errors.headline" />
                </label>

                <label class="block space-y-2">
                    <span class="text-sm font-medium">Introdução</span>
                    <textarea v-model="form.intro" rows="3" class="w-full rounded-md border bg-background px-3 py-2 text-sm" />
                    <InputError :message="form.errors.intro" />
                </label>

                <label class="block space-y-2">
                    <span class="text-sm font-medium">Bio</span>
                    <textarea v-model="form.bio" rows="5" class="w-full rounded-md border bg-background px-3 py-2 text-sm" />
                    <InputError :message="form.errors.bio" />
                </label>

                <label class="block space-y-2">
                    <span class="text-sm font-medium">Pontos sobre você</span>
                    <textarea v-model="form.about_points" rows="5" class="w-full rounded-md border bg-background px-3 py-2 text-sm" placeholder="Um ponto por linha" />
                    <InputError :message="form.errors.about_points" />
                </label>
            </section>

            <aside class="space-y-5">
                <section class="rounded-lg border bg-background p-5">
                    <h2 class="font-semibold">Imagem</h2>
                    <div v-if="profile?.resolved_avatar_url" class="mt-4 overflow-hidden rounded-lg border bg-muted">
                        <img :src="profile.resolved_avatar_url" :alt="profile.name" class="aspect-square w-full object-cover" />
                    </div>
                    <label class="mt-4 block space-y-2">
                        <span class="text-sm font-medium">URL externa</span>
                        <input v-model="form.avatar_url" class="h-10 w-full rounded-md border bg-background px-3 text-sm" />
                        <InputError :message="form.errors.avatar_url" />
                    </label>
                    <label class="mt-4 block space-y-2">
                        <span class="text-sm font-medium">Upload</span>
                        <input type="file" accept="image/*" class="w-full text-sm" @change="updateAvatar" />
                        <InputError :message="form.errors.avatar" />
                    </label>
                </section>

                <section class="space-y-4 rounded-lg border bg-background p-5">
                    <h2 class="font-semibold">Contato</h2>
                    <label class="block space-y-2">
                        <span class="text-sm font-medium">Email</span>
                        <input v-model="form.email" class="h-10 w-full rounded-md border bg-background px-3 text-sm" />
                        <InputError :message="form.errors.email" />
                    </label>
                    <label class="block space-y-2">
                        <span class="text-sm font-medium">Localização</span>
                        <input v-model="form.location" class="h-10 w-full rounded-md border bg-background px-3 text-sm" />
                    </label>
                    <label class="block space-y-2">
                        <span class="text-sm font-medium">Currículo ou link extra</span>
                        <input v-model="form.resume_url" class="h-10 w-full rounded-md border bg-background px-3 text-sm" />
                        <InputError :message="form.errors.resume_url" />
                    </label>
                </section>
            </aside>
        </form>
    </div>
</template>
