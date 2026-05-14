import { useState } from 'react'
import ReactDragResizeRotate, { type PosData } from '../../../src'

interface RectState {
  w: number
  h: number
  x: number
  y: number
  r: number
}

function updateRect(rect: RectState, pos: PosData): RectState {
  return {
    ...rect,
    x: pos.x,
    y: pos.y,
    w: pos.w,
    h: pos.h,
    r: pos.r,
  }
}

export default function HomeHero({ locale = 'zh' }: { locale?: 'zh' | 'en' }) {
  const [rect, setRect] = useState<RectState>({ w: 196, h: 132, x: 92, y: 82, r: -8 })
  const [panel, setPanel] = useState<RectState>({ w: 112, h: 86, x: 260, y: 198, r: 9 })
  const isEn = locale === 'en'
  const docsPrefix = isEn ? '/react-drag-resize-rotate/en' : '/react-drag-resize-rotate'

  const onRectChange = (pos: PosData) => setRect((current) => updateRect(current, pos))
  const onPanelChange = (pos: PosData) => setPanel((current) => updateRect(current, pos))

  return (
    <section className="rrr-home">
      <div className="rrr-home__copy">
        <span className="rrr-home__eyebrow">React canvas editing component</span>
        <h1>react-drag-resize-rotate</h1>
        <p>
          {isEn
            ? 'A rectangle editing component for annotation tools, poster editors, low-code canvases, and visual builders. Drag, resize, rotate, nesting, boundary limits, and theming follow the same API shape as the Vue package.'
            : '面向图片标注、海报编辑、低代码画布和可视化搭建器的矩形编辑组件。拖拽、缩放、旋转、嵌套、边界限制和主题定制都保持与 Vue 版一致的 API。'}
        </p>

        <div className="rrr-home__actions">
          <a className="rrr-home__button rrr-home__button--primary" href={`${docsPrefix}/guide/getting-started`}>
            {isEn ? 'Get started' : '快速开始'}
          </a>
          <a className="rrr-home__button" href={`${docsPrefix}/examples/basic`}>
            {isEn ? 'View examples' : '查看示例'}
          </a>
        </div>

        <div className="rrr-home__install" aria-label="Install command">
          <code>pnpm add @liaogn/react-drag-resize-rotate</code>
        </div>

        <div className="rrr-home__meta">
          <span>React 18 / 19</span>
          <span>TypeScript</span>
          <span>ESM + CJS</span>
        </div>
      </div>

      <div className="rrr-home__preview" aria-label="Interactive preview">
        <div className="rrr-home__stage">
          <div className="rrr-home__grid" />
          <div className="rrr-home__toolbar">
            <span />
            <span />
            <span />
          </div>
          <ReactDragResizeRotate
            {...rect}
            minWidth={96}
            minHeight={72}
            maxWidth={260}
            maxHeight={210}
            limitX={[18, 472]}
            limitY={[18, 342]}
            overflow="hidden"
            onDragging={onRectChange}
            onResizing={onRectChange}
            onRotating={onRectChange}
          >
            <div className="rrr-home__node rrr-home__node--image">
              <strong>Poster block</strong>
              <small>{Math.round(rect.w)} x {Math.round(rect.h)} · {Math.round(rect.r)}°</small>
            </div>
          </ReactDragResizeRotate>
          <ReactDragResizeRotate
            {...panel}
            lock
            sticks={['tl', 'tr', 'br', 'bl', 'angle']}
            limitX={[18, 472]}
            limitY={[18, 342]}
            overflow="hidden"
            onDragging={onPanelChange}
            onResizing={onPanelChange}
            onRotating={onPanelChange}
          >
            <div className="rrr-home__node rrr-home__node--tag">
              <strong>Label</strong>
              <small>lock ratio</small>
            </div>
          </ReactDragResizeRotate>
        </div>
      </div>
    </section>
  )
}
