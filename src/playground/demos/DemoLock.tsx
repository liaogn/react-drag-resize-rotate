import ReactDragResizeRotate from '../../index'
import { centerRect } from './helpers'

const lockedRect = centerRect(180, 120)

export default function DemoLock() {
  return (
    <div className="vdr-demo-stage">
      <ReactDragResizeRotate {...lockedRect} overflow="hidden" lock>
        <div className="vdr-demo-card vdr-demo-card--alt">lock</div>
      </ReactDragResizeRotate>
    </div>
  )
}
