import { useSyncExternalStore } from "react"
import { useAuthStore } from "@/features/auth/store/auth.store"

function subscribe(onStoreChange: () => void) {
  return useAuthStore.persist?.onFinishHydration(onStoreChange) ?? (() => {})
}

function getSnapshot() {
  return useAuthStore.persist?.hasHydrated() ?? false
}

export function useAuthHydrated() {
  return useSyncExternalStore(
    subscribe,
    getSnapshot,
    () => false,
  )
}
