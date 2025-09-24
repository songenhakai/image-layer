import { useMemo } from 'react'
import { FONT_OPTIONS } from './constants'
import { splitLines } from './utils'
import type { TodoLayerState } from './types'

export const useDerivedTodoState = (state: TodoLayerState) => {
  const { fontId, rawText } = state

  const font = useMemo(
    () => FONT_OPTIONS.find((option) => option.id === fontId) ?? FONT_OPTIONS[0],
    [fontId]
  )

  const lines = useMemo(() => splitLines(rawText), [rawText])

  return { font, lines }
}
