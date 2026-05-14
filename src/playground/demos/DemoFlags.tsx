import { useState } from 'react'
import ReactDragResizeRotate from '../../index'
import { centerRect } from './helpers'

const centerRect180x140 = centerRect(180, 140)

export default function DemoFlags() {
  const [flags, setFlags] = useState({
    active: true,
    draggable: true,
    resizeable: true,
    rotateable: true,
  })

  function toggle(key: keyof typeof flags) {
    setFlags((current) => ({ ...current, [key]: !current[key] }))
  }

  return (
    <div className="vdr-demo-stage">
      <div className="vdr-demo-stage-tools vdr-demo-toggles">
        {(Object.keys(flags) as (keyof typeof flags)[]).map((key) => (
          <label key={key}>
            <input type="checkbox" checked={flags[key]} onChange={() => toggle(key)} />
            {key}
          </label>
        ))}
      </div>
      <ReactDragResizeRotate {...centerRect180x140} {...flags} overflow="hidden">
        <div className="vdr-demo-card">flags</div>
      </ReactDragResizeRotate>
    </div>
  )
}
