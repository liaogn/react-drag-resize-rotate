import ReactDragResizeRotate from '../../index'
import { centerRect } from './helpers'

const minMaxRect = centerRect(160, 120)

export default function DemoMinMax() {
  return (
    <div className="vdr-demo-stage">
      <ReactDragResizeRotate {...minMaxRect} minWidth={80} minHeight={80} maxWidth={240} maxHeight={200}>
        <div className="vdr-demo-card vdr-demo-card--warn">min/max</div>
      </ReactDragResizeRotate>
    </div>
  )
}
