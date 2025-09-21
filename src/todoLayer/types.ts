export interface TodoLayerState {
  rawText: string
  textColor: string
  strokeColor: string
  fontId: string
  fontWeight: 'regular' | 'bold'
  maxWidth: number
  maxHeight: number
  outlineWidth: number
}

export type CopyState = 'idle' | 'success' | 'error'
