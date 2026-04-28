<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { FolderKanban, Home, LayoutGrid, Link2, Sparkles, UserRound } from 'lucide-vue-next';
import AppLogo from '@/components/AppLogo.vue';
import NavFooter from '@/components/NavFooter.vue';
import NavMain from '@/components/NavMain.vue';
import NavUser from '@/components/NavUser.vue';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Painel',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Projetos',
        href: '/admin/projetos',
        icon: FolderKanban,
    },
    {
        title: 'Tecnologias',
        href: '/admin/tecnologias',
        icon: Sparkles,
    },
    {
        title: 'Perfil',
        href: '/admin/perfil',
        icon: UserRound,
    },
    {
        title: 'Links',
        href: '/admin/links',
        icon: Link2,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Ver site',
        href: '/',
        icon: Home,
    },
];
</script>

<template>
    <Sidebar collapsible="icon" variant="inset">
        <SidebarHeader>
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton size="lg" as-child>
                        <Link :href="dashboard()">
                            <AppLogo />
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
            <NavMain :items="mainNavItems" />
        </SidebarContent>

        <SidebarFooter>
            <NavFooter :items="footerNavItems" />
            <NavUser />
        </SidebarFooter>
    </Sidebar>
    <slot />
</template>
