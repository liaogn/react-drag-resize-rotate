import ReactDragResizeRotate from '../../index'
import { centerRect, redArrowRender } from './helpers'

const centerRect180x140 = centerRect(180, 140)

export default function DemoCustomCursor() {
  return (
    <div className="vdr-demo-stage">
      <ReactDragResizeRotate overflow="hidden" {...centerRect180x140} stickHoverRender={redArrowRender}>
        <div className="vdr-demo-card vdr-demo-card--warn">custom cursor</div>
      </ReactDragResizeRotate>
    </div>
  )
}
