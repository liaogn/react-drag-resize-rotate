import ReactDragResizeRotate from '../../index'
import { centerRect } from './helpers'

const centerRect180x140 = centerRect(180, 140)

export default function DemoSticks() {
  return (
    <div className="vdr-demo-stage">
      <ReactDragResizeRotate overflow="hidden" {...centerRect180x140} sticks={['tl', 'tr', 'bl', 'br', 'angle']}>
        <div className="vdr-demo-card vdr-demo-card--alt">corners only</div>
      </ReactDragResizeRotate>
    </div>
  )
}
