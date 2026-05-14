import { useState } from 'react'
import ReactDragResizeRotate from '../../index'
import { centerRect, themes } from './helpers'

const centerRect180x140 = centerRect(180, 140)

export default function DemoTheming() {
  const [theme, setTheme] = useState('default')
  const currentTheme = themes.find((item) => item.name === theme)?.vars ?? {}

  return (
    <div className="vdr-demo-stage" style={currentTheme}>
      <div className="vdr-demo-stage-tools vdr-demo-toggles">
        {themes.map((item) => (
          <label key={item.name}>
            <input
              type="radio"
              name="vdr-theme"
              value={item.name}
              checked={theme === item.name}
              onChange={() => setTheme(item.name)}
            />
            <span>{item.name}</span>
          </label>
        ))}
      </div>
      <ReactDragResizeRotate overflow="hidden" {...centerRect180x140}>
        <div className="vdr-demo-card vdr-demo-card--alt">themed</div>
      </ReactDragResizeRotate>
    </div>
  )
}
