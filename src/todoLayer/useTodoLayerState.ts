import { useEffect, useState } from 'react'
import { DIMENSION_LIMITS, STORAGE_KEY, defaultState } from './constants'
import type { TodoLayerState } from './types'
import { clamp, normalizeState } from './utils'

const readInitialState = (): TodoLayerState => {
  if (typeof window === 'undefined') {
    return defaultState
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      return defaultState
    }

    const parsed = JSON.parse(stored) as Partial<TodoLayerState>
    return normalizeState(parsed)
  } catch (error) {
    console.warn('Failed to read state from storage', error)
    return defaultState
  }
}

export const useTodoLayerState = () => {
  const [state, setState] = useState<TodoLayerState>(readInitialState)

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const reset = () => setState(defaultState)

  const updateState = <Key extends keyof TodoLayerState>(key: Key, value: TodoLayerState[Key]) => {
    setState((prev) => ({ ...prev, [key]: value }))
  }

  const updateDimension = (key: 'maxWidth' | 'maxHeight', value: number) => {
    if (Number.isNaN(value)) {
      return
    }

    const [min, max] =
      key === 'maxWidth'
        ? [DIMENSION_LIMITS.minWidth, DIMENSION_LIMITS.maxWidth]
        : [DIMENSION_LIMITS.minHeight, DIMENSION_LIMITS.maxHeight]

    updateState(key, clamp(value, min, max))
  }

  return { state, setState, reset, updateState, updateDimension }
}
