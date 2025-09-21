import { useEffect, useState } from 'react'
import { STORAGE_KEY, defaultState } from './constants'
import type { TodoLayerState } from './types'
import { normalizeState } from './utils'

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

  return { state, setState, reset }
}
