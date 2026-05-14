import { useState } from 'react'
import ReactDragResizeRotate from '../../index'
import { assignPos, centerRect, type PosDataLike } from './helpers'

export default function DemoBasic() {
  const [basic, setBasic] = useState(centerRect(180, 140))
  const updateBasic = (pos: PosDataLike) => setBasic((rect) => assignPos(rect, pos))

  return (
    <div className="vdr-demo-stage">
      <ReactDragResizeRotate
        w={basic.w}
        h={basic.h}
        x={basic.x}
        y={basic.y}
        r={basic.r}
        overflow="hidden"
        onDragging={updateBasic}
        onResizing={updateBasic}
        onRotating={updateBasic}
      >
        <div className="vdr-demo-card">drag · resize · rotate</div>
      </ReactDragResizeRotate>
    </div>
  )
}
