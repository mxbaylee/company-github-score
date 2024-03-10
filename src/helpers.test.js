import { describe, expect, it, vi } from 'vitest'
import { isWithinLastXMonths } from './helpers.js'

describe('isWithinLastXMonths', () => {
  it('works', () => {
    // Setup
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-03-21T09:12:41Z'))

    // Assert, 1 month
    expect(isWithinLastXMonths('2024-05-21T09:12:41Z', 1)).toEqual(false)
    expect(isWithinLastXMonths('2024-04-21T09:12:41Z', 1)).toEqual(true)
    expect(isWithinLastXMonths('2024-03-21T09:12:41Z', 1)).toEqual(true)
    expect(isWithinLastXMonths('2024-02-21T09:12:41Z', 1)).toEqual(true)
    expect(isWithinLastXMonths('2024-01-21T09:12:41Z', 1)).toEqual(false)

    // Assert, 12 months
    expect(isWithinLastXMonths('2025-04-21T09:12:41Z', 12)).toEqual(false)
    expect(isWithinLastXMonths('2025-03-21T09:12:41Z', 12)).toEqual(true)
    expect(isWithinLastXMonths('2024-04-21T09:12:41Z', 12)).toEqual(true)
    expect(isWithinLastXMonths('2024-02-21T09:12:41Z', 12)).toEqual(true)
    expect(isWithinLastXMonths('2023-03-21T09:12:41Z', 12)).toEqual(true)
    expect(isWithinLastXMonths('2023-02-21T09:12:41Z', 12)).toEqual(false)
  })
})
