import { useState, RefObject, useMemo } from 'react'
import type Konva from 'konva'
import type { CopyState } from './types'

const getStageBlob = async (stageRef: RefObject<Konva.Stage>): Promise<Blob | null> => {
  const stage = stageRef.current
  if (!stage) {
    return null
  }

  const pixelRatio = Math.min(1, window.devicePixelRatio || 1)
  const dataUrl = stage.toDataURL({ pixelRatio })
  const response = await fetch(dataUrl)
  return await response.blob()
}

export const useStageExporter = (stageRef: RefObject<Konva.Stage>) => {
  const [copyState, setCopyState] = useState<CopyState>('idle')

  const copyLabel = useMemo(() => {
    if (copyState === 'success') {
      return 'コピーしました'
    }
    if (copyState === 'error') {
      return 'コピーできませんでした'
    }
    return 'クリップボードにコピー'
  }, [copyState])

  const handleCopy = async () => {
    try {
      const blob = await getStageBlob(stageRef)
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
      const blob = await getStageBlob(stageRef)
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

  const resetCopyState = () => {
    setCopyState('idle')
  }

  return { handleCopy, handleDownload, copyLabel, resetCopyState }
}
