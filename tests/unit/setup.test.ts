import { describe, expect, it } from 'vitest'
import { fileURLToPath } from 'node:url'
import { existsSync } from 'node:fs'
import profile from '~/data/profile.json'

describe('infraestrutura de testes', () => {
  it('resolve o alias ~ para a raiz do projeto', () => {
    expect(profile).toBeTruthy()
    expect(existsSync(fileURLToPath(new URL('../../package.json', import.meta.url)))).toBe(true)
  })

  it('expõe os stubs dos auto-imports do Nuxt', () => {
    const g = globalThis as Record<string, unknown>
    for (const name of [
      'useState',
      'navigateTo',
      'useRoute',
      'onMounted',
      'onBeforeUnmount',
      'ref',
      'computed',
      'watch',
      'nextTick'
    ]) {
      expect(typeof g[name], name).toBe('function')
    }
  })

  it('useState compartilha o valor pela chave e usa o init só na primeira vez', () => {
    const useState = (globalThis as any).useState as <T>(k: string, i?: () => T) => { value: T }
    const a = useState('k', () => 1)
    a.value = 5
    expect(useState('k', () => 99).value).toBe(5)
  })

  it('roda em ambiente node por padrão', () => {
    expect(typeof document).toBe('undefined')
  })
})
