import type { MutableRefObject } from 'react'
import { Group, Layer, Rect, Stage, Text } from 'react-konva'
import type { Stage as StageType } from 'konva/lib/Stage'
import { CHECKBOX_SIZE, FONT_SIZE, LINE_GAP, STAGE_PADDING } from './constants'

interface PreviewStageProps {
  stageRef: MutableRefObject<StageType | null>
  stageScale: number
  width: number
  height: number
  lines: string[]
  fontStack: string
  fontWeight: 'regular' | 'bold'
  textColor: string
  strokeColor: string
  outlineWidth: number
  isStrokeEnabled: boolean
}

export const PreviewStage = ({
  stageRef,
  stageScale,
  width,
  height,
  lines,
  fontStack,
  fontWeight,
  textColor,
  strokeColor,
  outlineWidth,
  isStrokeEnabled
}: PreviewStageProps) => (
  <div className="preview__canvas-frame">
    <div className="preview__checker" />
    <Stage
      width={width}
      height={height}
      scaleX={stageScale}
      scaleY={stageScale}
      ref={(node) => {
        stageRef.current = node
      }}
    >
      <Layer listening={false}>
        {lines.length === 0 ? (
          <Text
            text="TODO を入力するとここに表示されます"
            x={STAGE_PADDING}
            y={STAGE_PADDING}
            fontFamily={fontStack}
            fontSize={28}
            fill="#6b7280"
          />
        ) : (
          lines.map((line, index) => {
            const y = STAGE_PADDING + index * (FONT_SIZE + LINE_GAP)
            const textX = CHECKBOX_SIZE + 16
            const textY = (CHECKBOX_SIZE - FONT_SIZE) / 2

            return (
              <Group key={`${line}-${index}`} y={y} x={STAGE_PADDING} listening={false}>
                <Rect
                  width={CHECKBOX_SIZE}
                  height={CHECKBOX_SIZE}
                  stroke={strokeColor}
                  strokeWidth={3}
                  cornerRadius={6}
                />
                <Text
                  name="todo-text-outline"
                  text={line}
                  x={textX}
                  y={textY}
                  fontFamily={fontStack}
                  fontSize={FONT_SIZE}
                  fontStyle={fontWeight === 'bold' ? 'bold' : 'normal'}
                  fillEnabled={false}
                  strokeEnabled={isStrokeEnabled}
                  stroke={strokeColor}
                  strokeWidth={outlineWidth}
                  listening={false}
                />
                <Text
                  name="todo-text-fill"
                  text={line}
                  x={textX}
                  y={textY}
                  fontFamily={fontStack}
                  fontSize={FONT_SIZE}
                  fontStyle={fontWeight === 'bold' ? 'bold' : 'normal'}
                  fill={textColor}
                  strokeEnabled={false}
                  listening={false}
                />
              </Group>
            )
          })
        )}
      </Layer>
    </Stage>
  </div>
)
