import { describe, it, expect } from 'vitest'
import { pad, toIso, weekday } from './dates.js'

describe('pad', () => {
  it('pads single digits to two characters', () => {
    expect(pad(0)).toBe('00')
    expect(pad(5)).toBe('05')
    expect(pad(12)).toBe('12')
  })
})

describe('toIso', () => {
  it('formats a Date as YYYY-MM-DD in local time', () => {
    expect(toIso(new Date(2025, 0, 5))).toBe('2025-01-05')
    expect(toIso(new Date(2025, 11, 31))).toBe('2025-12-31')
  })
})

describe('weekday', () => {
  it('returns Monday = 1 … Sunday = 7', () => {
    // 2025-01-06 is a Monday, 2025-01-12 is a Sunday.
    expect(weekday(new Date(2025, 0, 6))).toBe(1)
    expect(weekday(new Date(2025, 0, 12))).toBe(7)
  })
})
