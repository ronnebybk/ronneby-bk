import { describe, it, expect, vi } from 'vitest'
import { createScrollLock } from './useModalDialog.js'

describe('createScrollLock', () => {
  it('applies overflow hidden while the count is above 0', () => {
    const apply = vi.fn()
    const lock = createScrollLock(apply)
    lock.acquire()
    expect(apply).toHaveBeenLastCalledWith(true)
    lock.acquire()
    expect(apply).toHaveBeenLastCalledWith(true)
    lock.release()
    expect(apply).toHaveBeenLastCalledWith(true)
    lock.release()
    expect(apply).toHaveBeenLastCalledWith(false)
  })

  it('release is idempotent — extra releases do not push the count below 0', () => {
    const apply = vi.fn()
    const lock = createScrollLock(apply)
    lock.release()
    lock.release()
    expect(apply).not.toHaveBeenCalled()
    lock.acquire()
    lock.release()
    lock.release()
    expect(apply).toHaveBeenLastCalledWith(false)
    expect(apply).toHaveBeenCalledTimes(2)
  })

  it('overflow only clears at 0', () => {
    const apply = vi.fn()
    const lock = createScrollLock(apply)
    lock.acquire()
    lock.acquire()
    lock.acquire()
    lock.release()
    lock.release()
    expect(apply).toHaveBeenLastCalledWith(true)
    lock.release()
    expect(apply).toHaveBeenLastCalledWith(false)
  })
})
