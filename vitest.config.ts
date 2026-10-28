import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

const root = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  resolve: {
    alias: {
      // Mesmo alias `~` do Nuxt: raiz do projeto
      '~': root.replace(/[\\/]$/, '')
    }
  },
  test: {
    // Módulos puros rodam em Node; testes de DOM optam por arquivo com
    // `// @vitest-environment happy-dom`
    environment: 'node',
    setupFiles: ['tests/setup.ts'],
    include: ['tests/**/*.test.ts']
  }
})
