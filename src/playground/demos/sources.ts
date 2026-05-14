export const demoSources: Record<string, string> = {
  basic: `import { useState } from 'react'
import ReactDragResizeRotate, { type PosData } from '@liaogn/react-drag-resize-rotate'
import '@liaogn/react-drag-resize-rotate/style.css'

export default function Demo() {
  const [rect, setRect] = useState({ w: 180, h: 140, x: 120, y: 120, r: 0 })
  const update = (pos: PosData) => setRect((current) => ({ ...current, x: pos.x, y: pos.y, w: pos.w, h: pos.h, r: pos.r }))

  return (
    <ReactDragResizeRotate {...rect} overflow="hidden" onDragging={update} onResizing={update} onRotating={update}>
      <div>drag · resize · rotate</div>
    </ReactDragResizeRotate>
  )
}`,
  lock: `<ReactDragResizeRotate w={180} h={120} x={120} y={130} lock overflow="hidden" />`,
  'min-max': `<ReactDragResizeRotate w={160} h={120} x={130} y={130} minWidth={80} minHeight={80} maxWidth={240} maxHeight={200} />`,
  flip: `<ReactDragResizeRotate w={160} h={120} x={130} y={130} overflow="hidden" onFliped={(pos) => console.log(pos.flipSign)} />`,
  nested: `const root = {
  uuid: 'root',
  w: 320, h: 220, x: 50, y: 80,
  childrens: [
    { uuid: 'child-1', w: 140, h: 100, x: 40, y: 40, r: 15 },
    { uuid: 'child-2', w: 90, h: 90, x: 190, y: 100, r: -10, lock: true },
  ],
}

<ReactDragResizeRotate {...root} />`,
  'nested-clip': `<ReactDragResizeRotate w={320} h={220} x={50} y={80} overflow="hidden" childrens={[{ w: 200, h: 160, x: 60, y: 30, r: 20 }]} />`,
  sticks: `<ReactDragResizeRotate w={180} h={140} x={120} y={120} sticks={['tl', 'tr', 'bl', 'br', 'angle']} />`,
  'custom-cursor': `<ReactDragResizeRotate w={180} h={140} x={120} y={120} stickHoverRender={(cursorRotate) => ({ x: 16, y: 16, htmlText: '<svg />' })} />`,
  flags: `<ReactDragResizeRotate active draggable resizeable rotateable w={180} h={140} x={120} y={120} />`,
  theming: `<div style={{ '--vdr-stick-color': 'crimson' } as React.CSSProperties}>
  <ReactDragResizeRotate w={180} h={140} x={120} y={120} />
</div>`,
  boundary: `<ReactDragResizeRotate w={120} h={100} x={150} y={140} r={20} limitX={[10, 410]} limitY={[10, 370]} />`,
  'nested-boundary': `<ReactDragResizeRotate w={280} h={220} x={70} y={80} limitX={[10, 410]} limitY={[10, 370]}>
  <ReactDragResizeRotate w={120} h={90} x={30} y={30} limitX={[12, 268]} limitY={[12, 208]} />
</ReactDragResizeRotate>`,
}
