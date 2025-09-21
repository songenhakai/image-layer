import { useEffect, useMemo, useRef } from 'react'
import type { Stage as StageType } from 'konva/lib/Stage'
import { CHECKBOX_SIZE, DIMENSION_LIMITS, FONT_SIZE, FONT_WEIGHT_OPTIONS, LINE_GAP, STAGE_PADDING } from './constants'

declare global {
  interface Window {
    __todoStage?: StageType
  }
}

interface StageLayoutInput {
  lines: string[]
  fontStack: string
  fontWeight: 'regular' | 'bold'
  maxWidth: number
  maxHeight: number
  outlineWidth: number
  strokeColor: string
}

export const useStageLayout = ({
  lines,
  fontStack,
  fontWeight,
  maxWidth,
  maxHeight,
  outlineWidth,
  strokeColor
}: StageLayoutInput) => {
  const stageRef = useRef<StageType | null>(null)
  const measureCanvasRef = useRef<HTMLCanvasElement | null>(null)

  const isStrokeEnabled = useMemo(() => {
    const normalized = strokeColor.trim().toLowerCase()
    return outlineWidth > 0 && normalized.length > 0 && normalized !== 'transparent'
  }, [outlineWidth, strokeColor])

  const maxLineWidth = useMemo(() => {
    if (lines.length === 0) {
      return 0
    }

    if (typeof document === 'undefined') {
      return Math.max(...lines.map((line) => line.length * FONT_SIZE * 0.6))
    }

    if (!measureCanvasRef.current) {
      measureCanvasRef.current = document.createElement('canvas')
    }

    const context = measureCanvasRef.current.getContext('2d')
    if (!context) {
      return 0
    }

    const weight = FONT_WEIGHT_OPTIONS.find((option) => option.id === fontWeight)?.canvas ?? '400'
    context.font = `${weight} ${FONT_SIZE}px ${fontStack}`
    return lines.reduce((acc, line) => {
      const metrics = context.measureText(line)
      return Math.max(acc, metrics.width)
    }, 0)
  }, [fontStack, lines])

  const naturalWidth = useMemo(() => {
    const textWidth = maxLineWidth
    const outlinePadding = isStrokeEnabled ? outlineWidth * 2 : 0
    const baseWidth = CHECKBOX_SIZE + 16 + textWidth + outlinePadding
    return Math.max(baseWidth + STAGE_PADDING * 2, DIMENSION_LIMITS.minWidth)
  }, [fontWeight, isStrokeEnabled, maxLineWidth, outlineWidth])

  const naturalHeight = useMemo(() => {
    const count = Math.max(lines.length, 1)
    const contentHeight = count * (FONT_SIZE + LINE_GAP)
    return Math.max(contentHeight + STAGE_PADDING * 2, DIMENSION_LIMITS.minHeight)
  }, [lines.length])

  const stageScale = useMemo(() => {
    const widthScale = maxWidth / naturalWidth
    const heightScale = maxHeight / naturalHeight
    return Math.min(1, widthScale, heightScale)
  }, [maxHeight, maxWidth, naturalHeight, naturalWidth])

  const scaledWidth = Math.round(naturalWidth * stageScale)
  const scaledHeight = Math.round(naturalHeight * stageScale)

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) {
      return undefined
    }

    window.__todoStage = stage

    return () => {
      if (window.__todoStage === stage) {
        delete window.__todoStage
      }
    }
  }, [lines, outlineWidth, strokeColor, stageScale, scaledHeight, scaledWidth])

  return {
    stageRef,
    stageScale,
    scaledWidth,
    scaledHeight,
    isStrokeEnabled
  }
}

export type StageLayoutResult = ReturnType<typeof useStageLayout>
