"use client"

import { useEffect, useState } from "react"

const ROMANTIC_DATA_CHANGED_EVENT = "romantic-data-changed"

export function notifyRomanticDataChanged() {
  window.dispatchEvent(new Event(ROMANTIC_DATA_CHANGED_EVENT))
}

export function useRomanticDataVersion() {
  const [version, setVersion] = useState(0)

  useEffect(() => {
    const handleDataChanged = () => setVersion((current) => current + 1)

    window.addEventListener(ROMANTIC_DATA_CHANGED_EVENT, handleDataChanged)
    return () => window.removeEventListener(ROMANTIC_DATA_CHANGED_EVENT, handleDataChanged)
  }, [])

  return version
}
