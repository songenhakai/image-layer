import { useMemo, useState } from 'react'
import './App.css'
import { ControlsPanel } from './todoLayer/ControlsPanel'
import { PreviewStage } from './todoLayer/PreviewStage'
import { DIMENSION_LIMITS, FONT_OPTIONS } from './todoLayer/constants'
import type { CopyState, TodoLayerState } from './todoLayer/types'
import { clamp, splitLines } from './todoLayer/utils'
import { useClipboardSupport } from './todoLayer/useClipboardSupport'
import { useStageLayout } from './todoLayer/useStageLayout'
import { useTodoLayerState } from './todoLayer/useTodoLayerState'

function App() {
  const { state, setState, reset } = useTodoLayerState()
  const { fontId, fontWeight, rawText, strokeColor, textColor, maxWidth, maxHeight, outlineWidth } = state
  const clipboardSupported = useClipboardSupport()
  const [copyState, setCopyState] = useState<CopyState>('idle')

  const font = useMemo(
    () => FONT_OPTIONS.find((option) => option.id === fontId) ?? FONT_OPTIONS[0],
    [fontId]
  )

  const lines = useMemo(() => splitLines(rawText), [rawText])

  const { stageRef, stageScale, scaledWidth, scaledHeight, isStrokeEnabled } = useStageLayout({
    lines,
    fontStack: font.stack,
    fontWeight,
    maxWidth,
    maxHeight,
    outlineWidth,
    strokeColor
  })

  const outputSize = { width: scaledWidth, height: scaledHeight }

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

  const renderCopyLabel = () => {
    if (copyState === 'success') {
      return 'コピーしました'
    }

    if (copyState === 'error') {
      return 'コピーできませんでした'
    }

    return 'クリップボードにコピー'
  }

  const getStageBlob = async () => {
    const stage = stageRef.current
    if (!stage) {
      return null
    }

    const pixelRatio = Math.min(1, window.devicePixelRatio || 1)
    const dataUrl = stage.toDataURL({ pixelRatio })
    const response = await fetch(dataUrl)
    return await response.blob()
  }

  const handleCopy = async () => {
    try {
      const blob = await getStageBlob()
      if (!blob) {
        return
      }

      const item = new ClipboardItem({ 'image/png': blob })
      await navigator.clipboard.write([item])
      setCopyState('success')
    } catch (error) {
      console.error('Failed to copy image', error)
      setCopyState('error')
    } finally {
      window.setTimeout(() => {
        setCopyState('idle')
      }, 2000)
    }
  }

  const handleDownload = async () => {
    try {
      const blob = await getStageBlob()
      if (!blob) {
        return
      }

      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      link.href = url
      link.download = `todo-layer-${timestamp}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to download image', error)
    }
  }

  const handleReset = () => {
    reset()
    setCopyState('idle')
  }

  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">TODO Layer</h1>
        <p className="app__subtitle">入力したリストを透過PNGでクリップボードにコピーできます</p>
      </header>

      <main className="app__body">
        <ControlsPanel
          rawText={rawText}
          fontId={fontId}
          textColor={textColor}
          strokeColor={strokeColor}
          fontWeight={fontWeight}
          outlineWidth={outlineWidth}
          maxWidth={maxWidth}
          maxHeight={maxHeight}
          onRawTextChange={(value) => updateState('rawText', value)}
          onFontChange={(value) => updateState('fontId', value)}
          onFontWeightChange={(value) => updateState('fontWeight', value)}
          onTextColorChange={(value) => updateState('textColor', value)}
          onStrokeColorChange={(value) => updateState('strokeColor', value)}
          onOutlineWidthChange={(value) => updateState('outlineWidth', value)}
          onDimensionChange={updateDimension}
          onReset={handleReset}
          onCopy={handleCopy}
          onDownload={handleDownload}
          copyLabel={renderCopyLabel()}
          copyDisabled={!clipboardSupported || lines.length === 0}
          downloadDisabled={lines.length === 0}
          clipboardSupported={clipboardSupported}
          outputSize={outputSize}
        />

        <section className="preview">
          <div className="preview__label">プレビュー</div>
          <PreviewStage
            stageRef={stageRef}
            stageScale={stageScale}
            width={scaledWidth}
            height={scaledHeight}
            lines={lines}
            fontStack={font.stack}
          textColor={textColor}
          strokeColor={strokeColor}
          fontWeight={fontWeight}
            outlineWidth={outlineWidth}
            isStrokeEnabled={isStrokeEnabled}
          />
        </section>
      </main>
    </div>
  )
}

export default App
