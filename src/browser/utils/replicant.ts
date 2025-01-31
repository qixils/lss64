import { ref, onMounted, onUnmounted, computed } from 'vue'
import type { ReplicantBrowser } from 'nodecg/types/browser'
import { safeStringify } from './clone'

export function replicant<T>(name: string) {
  const localRef = ref<T>()

  function setValue(newVal: T, oldVal: T) {
    if (!newVal) return

    const stringify = JSON.stringify(newVal)
    if (stringify === safeStringify(oldVal)) return

    localRef.value = JSON.parse(stringify)
  }

  let replicant: ReplicantBrowser<T> | undefined

  onMounted(() => {
    const [base, namespace] = name.split("@")
    if (namespace) replicant = nodecg.Replicant(base, namespace)
    else replicant = nodecg.Replicant(base)

    replicant.on('change', setValue)

    if (localRef.value) replicant.value = localRef.value
  })

  onUnmounted(() => {
    if (!replicant) return

    replicant.off('change', setValue)
    replicant = undefined
  })

  const mutableRef = computed({
    get() {
      return localRef.value
    },
    set(newValue) {
      localRef.value = newValue
      if (replicant) replicant.value = newValue
    },
  })

  return mutableRef
}

export function messager<T>(name: string, toBundle?: string) {
  return (input: T) => {
    if (toBundle) nodecg.sendMessageToBundle(name, toBundle, input)
    else nodecg.sendMessage(name, input)
  }
}

export function voidMessager(name: string, toBundle?: string) {
  const msgr = messager<undefined>(name, toBundle)
  return () => msgr(undefined)
}
