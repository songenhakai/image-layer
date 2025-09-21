import { DIMENSION_LIMITS, FONT_OPTIONS, FONT_WEIGHT_OPTIONS, OUTLINE_WIDTH_OPTIONS, STROKE_COLOR_PRESETS, TEXT_COLOR_PRESETS } from './constants'

interface ControlsPanelProps {
  rawText: string
  fontId: string
  fontWeight: 'regular' | 'bold'
  textColor: string
  strokeColor: string
  outlineWidth: number
  maxWidth: number
  maxHeight: number
  onRawTextChange: (value: string) => void
  onFontChange: (fontId: string) => void
  onFontWeightChange: (fontWeight: 'regular' | 'bold') => void
  onTextColorChange: (color: string) => void
  onStrokeColorChange: (color: string) => void
  onOutlineWidthChange: (width: number) => void
  onDimensionChange: (key: 'maxWidth' | 'maxHeight', value: number) => void
  onReset: () => void
  onCopy: () => void
  onDownload: () => void
  copyLabel: string
  copyDisabled: boolean
  downloadDisabled: boolean
  clipboardSupported: boolean
  outputSize: { width: number; height: number }
}

export const ControlsPanel = ({
  rawText,
  fontId,
  fontWeight,
  textColor,
  strokeColor,
  outlineWidth,
  maxWidth,
  maxHeight,
  onRawTextChange,
  onFontChange,
  onFontWeightChange,
  onTextColorChange,
  onStrokeColorChange,
  onOutlineWidthChange,
  onDimensionChange,
  onReset,
  onCopy,
  onDownload,
  copyLabel,
  copyDisabled,
  downloadDisabled,
  clipboardSupported,
  outputSize
}: ControlsPanelProps) => (
  <section className="controls">
    <label className="field">
      <span className="field__label">TODO テキスト</span>
      <textarea
        className="textarea"
        value={rawText}
        onChange={(event) => onRawTextChange(event.target.value)}
        placeholder="1行につき1件入力します"
      />
    </label>

    <div className="field">
      <span className="field__label">フォント</span>
      <div className="field__options">
        {FONT_OPTIONS.map((option) => (
          <label key={option.id} className={`chip ${option.id === fontId ? 'chip--active' : ''}`}>
            <input
              type="radio"
              name="font"
              value={option.id}
              checked={option.id === fontId}
              onChange={() => onFontChange(option.id)}
            />
            <span style={{ fontFamily: option.stack }}>{option.label}</span>
          </label>
        ))}
      </div>
    </div>

    <div className="field">
      <span className="field__label">ウェイト</span>
      <div className="field__options">
        {FONT_WEIGHT_OPTIONS.map((option) => (
          <label key={option.id} className={`chip chip--compact ${option.id === fontWeight ? 'chip--active' : ''}`}>
            <input
              type="radio"
              name="fontWeight"
              value={option.id}
              checked={option.id === fontWeight}
              onChange={() => onFontWeightChange(option.id)}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </div>

    <div className="field">
      <span className="field__label">文字色</span>
      <div className="field__options">
        {TEXT_COLOR_PRESETS.map((preset) => (
          <button
            key={preset}
            type="button"
            className={`color-swatch ${preset.toLowerCase() === textColor.toLowerCase() ? 'color-swatch--active' : ''}`}
            style={{ background: preset }}
            onClick={() => onTextColorChange(preset)}
            aria-label={`色 ${preset}`}
          />
        ))}
      </div>
    </div>

    <div className="field">
      <span className="field__label">縁取り色</span>
      <div className="field__options">
        {STROKE_COLOR_PRESETS.map((option) => (
          <label key={option.value} className={`chip chip--compact ${option.value.toLowerCase() === strokeColor.toLowerCase() ? 'chip--active' : ''}`}>
            <input
              type="radio"
              name="strokeColor"
              value={option.value}
              checked={option.value.toLowerCase() === strokeColor.toLowerCase()}
              onChange={() => onStrokeColorChange(option.value)}
            />
            <span className="chip__color-preview" style={{ background: option.value }} />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </div>

    <div className="field">
      <span className="field__label">縁取り太さ</span>
      <div className="field__options">
        {OUTLINE_WIDTH_OPTIONS.map((option) => (
          <label key={option} className={`chip chip--compact ${option === outlineWidth ? 'chip--active' : ''}`}>
            <input
              type="radio"
              name="outlineWidth"
              value={option}
              checked={option === outlineWidth}
              onChange={() => onOutlineWidthChange(option)}
            />
            <span>{option}px</span>
          </label>
        ))}
      </div>
    </div>

    <div className="field">
      <span className="field__label">出力サイズ (最大)</span>
      <div className="dimensions">
        <label className="dimension">
          <span className="dimension__title">横幅 (px)</span>
          <input
            className="dimension__input"
            type="number"
            inputMode="numeric"
            min={DIMENSION_LIMITS.minWidth}
            max={DIMENSION_LIMITS.maxWidth}
            value={maxWidth}
            onChange={(event) => onDimensionChange('maxWidth', Number(event.target.value))}
            aria-label="出力の最大横幅 (px)"
          />
        </label>
        <label className="dimension">
          <span className="dimension__title">高さ (px)</span>
          <input
            className="dimension__input"
            type="number"
            inputMode="numeric"
            min={DIMENSION_LIMITS.minHeight}
            max={DIMENSION_LIMITS.maxHeight}
            value={maxHeight}
            onChange={(event) => onDimensionChange('maxHeight', Number(event.target.value))}
            aria-label="出力の最大縦幅 (px)"
          />
        </label>
      </div>
      <p className="dimension__hint">現在の出力: {outputSize.width} × {outputSize.height}px</p>
    </div>

    <div className="controls__actions">
      <button className="button button--secondary" type="button" onClick={onReset}>
        リセット
      </button>
      <button className="button button--secondary" type="button" onClick={onDownload} disabled={downloadDisabled}>
        PNG をダウンロード
      </button>
      <button className="button button--primary" type="button" onClick={onCopy} disabled={copyDisabled}>
        {copyLabel}
      </button>
    </div>
    {!clipboardSupported && (
      <p className="hint">ブラウザがクリップボードコピーに対応していません。PNG を保存するには右のプレビューを右クリックしてください。</p>
    )}
  </section>
)
