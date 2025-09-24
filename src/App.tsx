import './App.css'
import { ControlsPanel } from './todoLayer/ControlsPanel'
import { PreviewStage } from './todoLayer/PreviewStage'
import { useClipboardSupport } from './todoLayer/useClipboardSupport'
import { useStageLayout } from './todoLayer/useStageLayout'
import { useTodoLayerState } from './todoLayer/useTodoLayerState'
import { useStageExporter } from './todoLayer/useStageExporter'
import { useDerivedTodoState } from './todoLayer/useDerivedTodoState'

function App() {
  const { state, reset, updateState, updateDimension } = useTodoLayerState()
  const { fontWeight, strokeColor, textColor, maxWidth, maxHeight, outlineWidth } = state
  const clipboardSupported = useClipboardSupport()

  const { font, lines } = useDerivedTodoState(state)

  const { stageRef, stageScale, scaledWidth, scaledHeight, isStrokeEnabled } = useStageLayout({
    lines,
    fontStack: font.stack,
    fontWeight,
    maxWidth,
    maxHeight,
    outlineWidth,
    strokeColor
  })

  const { handleCopy, handleDownload, copyLabel, resetCopyState } = useStageExporter(stageRef)

  const outputSize = { width: scaledWidth, height: scaledHeight }

  const handleReset = () => {
    reset()
    resetCopyState()
  }

  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">やることリスト画像メーカー</h1>
      </header>

      <main className="app__body">
        <ControlsPanel
          rawText={state.rawText}
          fontId={state.fontId}
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
          copyLabel={copyLabel}
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
