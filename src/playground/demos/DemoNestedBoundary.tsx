import type { CSSProperties } from 'react'
import ReactDragResizeRotate from '../../index'
import { boundaryStyle, centerRectInBoundary, getBoundary } from './helpers'

const initialBoundary = getBoundary()
const bound = {
  lx0: initialBoundary.x0,
  lx1: initialBoundary.x1,
  ly0: initialBoundary.y0,
  ly1: initialBoundary.y1,
}
const boundedNestedRoot = centerRectInBoundary(280, 220)
const nestedChildBoundaryStyle: CSSProperties = {
  position: 'absolute',
  left: '12px',
  top: '12px',
  width: '256px',
  height: '196px',
  pointerEvents: 'none',
}

export default function DemoNestedBoundary() {
  return (
    <div className="vdr-demo-stage">
      <div className="vdr-demo-boundary-hint vdr-demo-boundary-hint--orange" style={boundaryStyle(bound)} />
      <ReactDragResizeRotate
        {...boundedNestedRoot}
        limitX={[bound.lx0, bound.lx1]}
        limitY={[bound.ly0, bound.ly1]}
        uuid="nest-root"
        overflow="hidden"
      >
        <div className="vdr-demo-nested-limit-root-bg" />
        <div className="vdr-demo-boundary-hint vdr-demo-boundary-hint--cyan" style={nestedChildBoundaryStyle} />
        <ReactDragResizeRotate w={120} h={90} x={30} y={30} r={15} limitX={[12, 268]} limitY={[12, 208]} uuid="nest-child-a" overflow="hidden">
          <div className="vdr-demo-card">child A</div>
        </ReactDragResizeRotate>
        <ReactDragResizeRotate w={80} h={80} x={160} y={100} r={-10} lock limitX={[12, 268]} limitY={[12, 208]} uuid="nest-child-b" overflow="hidden">
          <div className="vdr-demo-card vdr-demo-card--alt">child B (lock)</div>
        </ReactDragResizeRotate>
      </ReactDragResizeRotate>
    </div>
  )
}
