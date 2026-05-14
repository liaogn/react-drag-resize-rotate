import { useEffect, useMemo, useRef, useState } from 'react'
import ReactDragResizeRotate from '../../index'
import {
  STAGE_HEIGHT,
  STAGE_WIDTH,
  assignPos,
  boundaryStyle,
  centerRectInBoundary,
  getBoundary,
  type PosDataLike,
} from './helpers'

type BoundMode = 'limit' | 'minmax'

const boundModes: { value: BoundMode; label: string }[] = [
  { value: 'limit', label: 'limit' },
  { value: 'minmax', label: 'min/max' },
]

function getBoundRect(mode: BoundMode, width = STAGE_WIDTH, height = STAGE_HEIGHT) {
  return mode === 'minmax'
    ? centerRectInBoundary(140, 110, 10, width, height)
    : centerRectInBoundary(120, 100, 20, width, height)
}

export default function DemoBoundary() {
  const stageRef = useRef<HTMLDivElement | null>(null)
  const [stageSize, setStageSize] = useState({ width: STAGE_WIDTH, height: STAGE_HEIGHT })
  const [boundMode, setBoundMode] = useState<BoundMode>('limit')
  const [boundTouched, setBoundTouched] = useState(false)
  const [boundKey, setBoundKey] = useState(0)
  const [boundPos, setBoundPos] = useState(getBoundRect('limit'))
  const boundary = useMemo(() => getBoundary(stageSize.width, stageSize.height), [stageSize.height, stageSize.width])
  const [lock, setLock] = useState(false)
  const bound = {
    lx0: boundary.x0,
    lx1: boundary.x1,
    ly0: boundary.y0,
    ly1: boundary.y1,
  }

  const boundSizeProps =
    boundMode === 'minmax' ? { minWidth: 60, minHeight: 60, maxWidth: 240, maxHeight: 200 } : {}

  function updateBound(pos: PosDataLike) {
    setBoundTouched(true)
    setBoundPos((rect) => assignPos(rect, pos))
  }

  function resetBound() {
    setBoundPos(getBoundRect(boundMode, stageSize.width, stageSize.height))
    setBoundTouched(false)
    setLock(false)
    setBoundKey((key) => key + 1)
  }

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return

    const syncStageSize = () => {
      const rect = stage.getBoundingClientRect()
      setStageSize({ width: Math.round(rect.width), height: Math.round(rect.height) })
    }
    syncStageSize()
    const resizeObserver = new ResizeObserver(syncStageSize)
    resizeObserver.observe(stage)
    return () => resizeObserver.disconnect()
  }, [])

  useEffect(() => {
    if (!boundTouched) {
      setBoundPos(getBoundRect(boundMode, stageSize.width, stageSize.height))
      setBoundKey((key) => key + 1)
    }
  }, [boundMode, boundTouched, stageSize.height, stageSize.width])

  useEffect(() => {
    resetBound()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boundMode])

  return (
    <div className="vdr-demo-stage" ref={stageRef}>
      <div className="vdr-demo-stage-tools vdr-demo-toggles">
        {boundModes.map((mode) => (
          <label key={mode.value}>
            <input
              type="radio"
              name="bound-demo-mode"
              value={mode.value}
              checked={boundMode === mode.value}
              onChange={() => setBoundMode(mode.value)}
            />
            <span>{mode.label}</span>
          </label>
        ))}
        <label>
          <input type="checkbox" checked={lock} onChange={() => setLock((value) => !value)} /> lock
        </label>
        <button type="button" onClick={resetBound}>
          reset
        </button>
      </div>
      <div
        className={[
          'vdr-demo-boundary-hint',
          boundMode === 'minmax' ? 'vdr-demo-boundary-hint--cyan' : 'vdr-demo-boundary-hint--orange',
        ].join(' ')}
        style={boundaryStyle(bound)}
      />
      <ReactDragResizeRotate
        key={boundKey}
        {...boundSizeProps}
        w={boundPos.w}
        h={boundPos.h}
        x={boundPos.x}
        y={boundPos.y}
        r={boundPos.r}
        lock={lock}
        limitX={[bound.lx0, bound.lx1]}
        limitY={[bound.ly0, bound.ly1]}
        overflow="hidden"
        onDragging={updateBound}
        onResizing={updateBound}
        onRotating={updateBound}
        onFliped={updateBound}
      >
        <div className={['vdr-demo-card', boundMode === 'minmax' ? 'vdr-demo-card--alt' : ''].join(' ')}>
          {boundMode === 'minmax' ? 'bounded + min/max' : 'bounded · drag / resize / rotate / flip'}
        </div>
      </ReactDragResizeRotate>
    </div>
  )
}
