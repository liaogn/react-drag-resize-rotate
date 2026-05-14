import { useState } from 'react'
import ReactDragResizeRotate from '../../index'
import { centerRect } from './helpers'
import { useDemoLocale } from './i18n'

const flipRect = centerRect(160, 120)

export default function DemoFlip() {
  const locale = useDemoLocale()
  const [, setFlipCount] = useState(0)

  return (
    <div className="vdr-demo-stage">
      <ReactDragResizeRotate overflow="hidden" {...flipRect} onFliped={() => setFlipCount((count) => count + 1)}>
        <div className="vdr-demo-card vdr-demo-card--success">
          {locale === 'en' ? 'Drag a handle to flip' : '拖拽触点实现翻转'}
        </div>
      </ReactDragResizeRotate>
    </div>
  )
}
