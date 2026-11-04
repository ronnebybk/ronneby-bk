import { onBeforeUnmount } from 'vue'

// Module-level open counter shared by every dialog on the page. The root and body get
// overflow: hidden while the counter is above 0, so nested dialogs (event pop-up + lightbox)
// keep the page locked until the last one closes.
function applyScrollLock(locked) {
  const value = locked ? 'hidden' : ''
  document.documentElement.style.overflow = value
  document.body.style.overflow = value
}

const scrollLock = createScrollLock(applyScrollLock)

// Pure counting helper, unit-tested without a DOM: acquire/release adjust a count and only
// call apply when it crosses 0. release is idempotent per lock instance.
export function createScrollLock(apply) {
  let count = 0
  return {
    acquire() {
      count += 1
      apply(count > 0)
    },
    release() {
      if (count === 0) return
      count -= 1
      apply(count > 0)
    },
  }
}

// useModalDialog(dialogRef) — wraps a <dialog> element with scroll locking. open() shows the
// modal and takes one lock; release() gives it back (idempotent per instance, safe to call from
// the close event, Esc, unmount, etc.). The composable releases on unmount so leaving the page
// never leaves the document locked.
export function useModalDialog(dialogRef) {
  let locked = false

  function acquire() {
    if (locked) return
    locked = true
    scrollLock.acquire()
  }

  function release() {
    if (!locked) return
    locked = false
    scrollLock.release()
  }

  onBeforeUnmount(release)

  return {
    open() {
      dialogRef.value?.showModal()
      acquire()
    },
    close() {
      dialogRef.value?.close()
    },
    release,
    onBackdropClick(event) {
      if (event.target === dialogRef.value) dialogRef.value?.close()
    },
  }
}
