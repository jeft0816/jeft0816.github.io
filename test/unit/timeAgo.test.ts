import { describe, expect, it } from 'vitest'
import { timeAgo } from '../../app/utils/timeAgo'

describe('timeAgo', () => {
  it('returns fallback for invalid input', () => {
    expect(timeAgo(undefined, 1000)).toBe('önce')
    expect(timeAgo(null, 1000)).toBe('önce')
  })

  it('formats seconds range', () => {
    expect(timeAgo(9000, 10000)).toBe('saniyeler önce')
  })

  it('formats minutes range', () => {
    expect(timeAgo(0, 10 * 60 * 1000)).toBe('10dk önce')
  })

  it('formats hours range', () => {
    expect(timeAgo(0, 3 * 60 * 60 * 1000)).toBe('3sa önce')
  })

  it('formats days range', () => {
    expect(timeAgo(0, 2 * 24 * 60 * 60 * 1000)).toBe('2g önce')
  })
})
