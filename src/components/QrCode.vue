<script setup>
import { computed } from 'vue'
import qrcode from 'qrcode-generator'

const props = defineProps({
  value: { type: String, required: true },
})

const QUIET = 4 // modules of white around the code, as the QR standard asks

// One <path> of 1×1 squares; shape-rendering keeps the edges sharp when printed.
const code = computed(() => {
  const qr = qrcode(0, 'M')
  qr.addData(props.value)
  qr.make()
  const size = qr.getModuleCount()
  let path = ''
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (qr.isDark(row, col)) path += `M${col + QUIET} ${row + QUIET}h1v1h-1z`
    }
  }
  return { path, box: size + QUIET * 2 }
})
</script>

<template>
  <svg :viewBox="`0 0 ${code.box} ${code.box}`" role="img" aria-hidden="true" shape-rendering="crispEdges">
    <rect :width="code.box" :height="code.box" fill="#fff" />
    <path :d="code.path" fill="#000" />
  </svg>
</template>
