import { describe, expect, it } from 'vitest'
import { urlSemCache } from './planilha'

const URL_PUBLICADA =
  'https://docs.google.com/spreadsheets/d/e/ABC/pub?gid=0&single=true&output=csv'

describe('urlSemCache', () => {
  it('acrescenta o parâmetro anti-cache mantendo os parâmetros do Google', () => {
    const url = new URL(urlSemCache(URL_PUBLICADA, 1000))

    expect(url.searchParams.get('_')).toBe('1000')
    expect(url.searchParams.get('gid')).toBe('0')
    expect(url.searchParams.get('single')).toBe('true')
    expect(url.searchParams.get('output')).toBe('csv')
  })

  it('gera URLs diferentes em momentos diferentes', () => {
    expect(urlSemCache(URL_PUBLICADA, 1000)).not.toBe(urlSemCache(URL_PUBLICADA, 2000))
  })

  it('substitui o parâmetro em vez de repeti-lo', () => {
    const duasVezes = urlSemCache(urlSemCache(URL_PUBLICADA, 1000), 2000)

    expect(new URL(duasVezes).searchParams.getAll('_')).toEqual(['2000'])
  })
})
