import inertia from '@inertiajs/vite';
import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import laravel from 'laravel-vite-plugin';
import { defineConfig } from 'vite';
import { execSync } from 'child_process';

// Detecta se o PHP está disponível no ambiente de build.
const phpAvailable = (() => {
    try {
        execSync('php -v', { stdio: 'ignore' });
        return true;
    } catch {
        return false;
    }
})();

export default defineConfig(async () => {
    const plugins: any[] = [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.ts'],
            refresh: true,
        }),
        inertia(),
        tailwindcss(),
        vue({
            template: {
                transformAssetUrls: {
                    base: null,
                    includeAbsolute: false,
                },
            },
        }),
    ];

    if (phpAvailable) {
        try {
            const mod = await import('@laravel/vite-plugin-wayfinder');
            if (mod && typeof mod.wayfinder === 'function') {
                plugins.push(mod.wayfinder({ formVariants: true }));
            }
        } catch (e) {
            // Não falhar o build só por não conseguir carregar o plugin
            // (por exemplo, problema temporário no npm install).
            // Registrar no console para facilitar debug remoto.
            // eslint-disable-next-line no-console
            console.warn('Could not load @laravel/vite-plugin-wayfinder:', e);
        }
    }

    return {
        plugins,
    };
});
