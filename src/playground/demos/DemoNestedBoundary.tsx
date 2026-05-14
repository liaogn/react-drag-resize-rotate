import { useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
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

function getBoundedNestedRoot(width = STAGE_WIDTH, height = STAGE_HEIGHT) {
  return centerRectInBoundary(280, 220, 0, width, height)
}

const nestedChildBoundaryStyle: CSSProperties = {
  position: 'absolute',
  left: '12px',
  top: '12px',
  width: '256px',
  height: '196px',
  pointerEvents: 'none',
}

export default function DemoNestedBoundary() {
  const stageRef = useRef<HTMLDivElement | null>(null)
  const [stageSize, setStageSize] = useState({ width: STAGE_WIDTH, height: STAGE_HEIGHT })
  const [rootTouched, setRootTouched] = useState(false)
  const [boundedNestedRoot, setBoundedNestedRoot] = useState(getBoundedNestedRoot)
  const boundary = useMemo(() => getBoundary(stageSize.width, stageSize.height), [stageSize.height, stageSize.width])
  const bound = {
    lx0: boundary.x0,
    lx1: boundary.x1,
    ly0: boundary.y0,
    ly1: boundary.y1,
  }

  function updateBoundedNestedRoot(pos: PosDataLike) {
    setRootTouched(true)
    setBoundedNestedRoot((rect) => assignPos(rect, pos))
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
    if (!rootTouched) {
      setBoundedNestedRoot(getBoundedNestedRoot(stageSize.width, stageSize.height))
    }
  }, [rootTouched, stageSize.height, stageSize.width])

  return (
    <div className="vdr-demo-stage" ref={stageRef}>
      <div className="vdr-demo-boundary-hint vdr-demo-boundary-hint--orange" style={boundaryStyle(bound)} />
      <ReactDragResizeRotate
        {...boundedNestedRoot}
        limitX={[bound.lx0, bound.lx1]}
        limitY={[bound.ly0, bound.ly1]}
        uuid="nest-root"
        overflow="hidden"
        onDragging={updateBoundedNestedRoot}
        onResizing={updateBoundedNestedRoot}
        onRotating={updateBoundedNestedRoot}
        onFliped={updateBoundedNestedRoot}
      >
        <div className="vdr-demo-nested-limit-root-bg" />
        <div className="vdr-demo-boundary-hint vdr-demo-boundary-hint--cyan" style={nestedChildBoundaryStyle} />
        <ReactDragResizeRotate
          w={120}
          h={90}
          x={30}
          y={30}
          r={15}
          limitX={[12, 268]}
          limitY={[12, 208]}
          uuid="nest-child-a"
          overflow="hidden"
        >
          <div className="vdr-demo-card">child A</div>
        </ReactDragResizeRotate>
        <ReactDragResizeRotate
          w={80}
          h={80}
          x={160}
          y={100}
          r={-10}
          lock
          limitX={[12, 268]}
          limitY={[12, 208]}
          uuid="nest-child-b"
          overflow="hidden"
        >
          <div className="vdr-demo-card vdr-demo-card--alt">child B (lock)</div>
        </ReactDragResizeRotate>
      </ReactDragResizeRotate>
    </div>
  )
}
