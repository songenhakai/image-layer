import type { TodoLayerState } from './types'

export const STORAGE_KEY = 'todo-layer:v1'

export const CHECKBOX_SIZE = 40
export const STAGE_PADDING = 32
export const FONT_SIZE = 36
export const LINE_GAP = 16

export const FONT_OPTIONS = [
  {
    id: 'biz-ud-gothic',
    label: 'BIZ UDPゴシック',
    stack: '"BIZ UDPGothic", "Hiragino Sans", "Yu Gothic", system-ui, sans-serif'
  },
  {
    id: 'biz-ud-mincho',
    label: 'BIZ UDP明朝',
    stack: '"BIZ UDPMincho", "Hiragino Mincho ProN", "Yu Mincho", serif'
  },
  {
    id: 'noto-sans',
    label: 'Noto Sans JP',
    stack: '"Noto Sans JP", "BIZ UDPGothic", system-ui, sans-serif'
  }
] as const

export const FONT_WEIGHT_OPTIONS = [
  { id: 'regular' as const, label: 'レギュラー', css: 'normal', canvas: '400' },
  { id: 'bold' as const, label: 'ボールド', css: 'bold', canvas: '700' }
] as const

export const TEXT_COLOR_PRESETS = [
  '#ef4444',
  '#f97316',
  '#facc15',
  '#22c55e',
  '#0ea5e9',
  '#6366f1',
  '#ec4899',
  '#111827',
  '#f1f5f9'
] as const

export const STROKE_COLOR_PRESETS = [
  { label: '黒', value: '#111111' },
  { label: '白', value: '#ffffff' }
] as const

export const OUTLINE_WIDTH_OPTIONS = [0, 2, 4, 6, 8] as const

export const DIMENSION_LIMITS = {
  minWidth: 360,
  maxWidth: 2400,
  minHeight: 200,
  maxHeight: 2400
} as const

export const defaultRawText = ['今日やること', 'ラフを描く', '色ラフ作成', '仕上げチェック'].join('\n')

export const defaultState: TodoLayerState = {
  rawText: defaultRawText,
  textColor: '#6366f1',
  strokeColor: STROKE_COLOR_PRESETS[1].value,
  fontId: 'noto-sans',
  fontWeight: 'bold',
  maxWidth: 900,
  maxHeight: 1200,
  outlineWidth: 8
}
