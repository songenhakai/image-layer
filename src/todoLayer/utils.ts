import { DIMENSION_LIMITS, FONT_WEIGHT_OPTIONS, OUTLINE_WIDTH_OPTIONS, STROKE_COLOR_PRESETS, TEXT_COLOR_PRESETS, defaultState } from './constants'
import type { TodoLayerState } from './types'

export const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

export const clampOutlineWidth = (value: number): number => {
  const numeric = Number.isFinite(value) ? Math.round(value) : defaultState.outlineWidth
  const min = OUTLINE_WIDTH_OPTIONS[0]
  const max = OUTLINE_WIDTH_OPTIONS[OUTLINE_WIDTH_OPTIONS.length - 1]
  const clamped = clamp(numeric, min, max)
  const exact = OUTLINE_WIDTH_OPTIONS.find((option) => option === clamped)
  if (exact !== undefined) {
    return exact
  }

  return OUTLINE_WIDTH_OPTIONS.reduce((closest, option) => {
    return Math.abs(option - clamped) < Math.abs(closest - clamped) ? option : closest
  }, OUTLINE_WIDTH_OPTIONS[0])
}

const normalizeTextColor = (value: string | undefined) => {
  if (!value) {
    return defaultState.textColor
  }

  const match = TEXT_COLOR_PRESETS.find((preset) => preset.toLowerCase() === value.toLowerCase())
  return match ?? defaultState.textColor
}

const normalizeStrokeColor = (value: string | undefined) => {
  if (!value) {
    return defaultState.strokeColor
  }

  const match = STROKE_COLOR_PRESETS.find((preset) => preset.value.toLowerCase() === value.toLowerCase())
  return match?.value ?? defaultState.strokeColor
}

const normalizeFontWeight = (value: string | undefined) => {
  if (!value) {
    return defaultState.fontWeight
  }

  return FONT_WEIGHT_OPTIONS.some((option) => option.id === value)
    ? (value as (typeof FONT_WEIGHT_OPTIONS)[number]['id'])
    : defaultState.fontWeight
}

export const normalizeState = (raw: Partial<TodoLayerState>): TodoLayerState => {
  const merged: TodoLayerState = {
    ...defaultState,
    ...raw
  }

  return {
    ...merged,
    textColor: normalizeTextColor(merged.textColor),
    strokeColor: normalizeStrokeColor(merged.strokeColor),
    fontWeight: normalizeFontWeight(merged.fontWeight),
    outlineWidth: clampOutlineWidth(merged.outlineWidth),
    maxWidth: clamp(merged.maxWidth, DIMENSION_LIMITS.minWidth, DIMENSION_LIMITS.maxWidth),
    maxHeight: clamp(merged.maxHeight, DIMENSION_LIMITS.minHeight, DIMENSION_LIMITS.maxHeight)
  }
}

export const splitLines = (rawText: string) => rawText
  .split('\n')
  .map((line) => line.trim())
  .filter((line) => line.length > 0)
