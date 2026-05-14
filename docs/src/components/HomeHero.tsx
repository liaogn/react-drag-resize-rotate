import { useEffect, useMemo, useRef, useState } from 'react'
import ReactDragResizeRotate from '../../../src'

interface RectState {
  w: number
  h: number
  x: number
  y: number
  r: number
}

interface StageSize {
  width: number
  height: number
}

interface PanelLimit {
  ready: boolean
  lx0: number
  lx1: number
  ly0: number
  ly1: number
}

const DEFAULT_STAGE_SIZE: StageSize = {
  width: 620,
  height: 540,
}

const GITHUB = 'https://github.com/liaogn/react-drag-resize-rotate'

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function getDemoPanel(stageSize: StageSize): RectState {
  const width = Math.round(clamp(stageSize.width - 32, 220, 500))
  const height = Math.round(width * 0.64)

  return {
    w: width,
    h: height,
    x: Math.round((stageSize.width - width) / 2),
    y: Math.round((stageSize.height - height) / 2 + stageSize.height * 0.02),
    r: stageSize.width < 420 ? -4 : -7,
  }
}

function getNestedPanel(demoPanel: RectState): RectState {
  const width = Math.round(clamp(demoPanel.w * 0.26, 92, 130))
  const height = Math.round(width * 0.62)

  return {
    w: width,
    h: height,
    x: Math.round((demoPanel.w - width) / 2),
    y: Math.round((demoPanel.h - height) / 2),
    r: 10,
  }
}

export default function HomeHero({ locale = 'zh' }: { locale?: 'zh' | 'en' }) {
  const heroRef = useRef<HTMLElement | null>(null)
  const stageRef = useRef<HTMLDivElement | null>(null)
  const [stageSize, setStageSize] = useState<StageSize>(DEFAULT_STAGE_SIZE)
  const [panelLimit, setPanelLimit] = useState<PanelLimit>({
    ready: false,
    lx0: 0,
    lx1: 0,
    ly0: 0,
    ly1: 0,
  })
  const isEn = locale === 'en'
  const docsPrefix = isEn ? '/react-drag-resize-rotate/en' : '/react-drag-resize-rotate'
  const demoPanel = useMemo(() => getDemoPanel(stageSize), [stageSize])
  const nestedPanel = useMemo(() => getNestedPanel(demoPanel), [demoPanel])
  const panelLimitX = useMemo<[number, number] | null>(
    () => (panelLimit.ready ? [panelLimit.lx0, panelLimit.lx1] : null),
    [panelLimit]
  )
  const panelLimitY = useMemo<[number, number] | null>(
    () => (panelLimit.ready ? [panelLimit.ly0, panelLimit.ly1] : null),
    [panelLimit]
  )

  const copy = isEn
    ? {
        eyebrow: 'Try the demo on the right and feel the smooth interaction',
        titlePrefix: 'Drag · Resize ·',
        titleAccent: 'Rotate',
        titleSuffix: 'has never been easier.',
        lead:
          'react-drag-resize-rotate is a powerful, lightweight React component for dragging, resizing, rotating, and nested editing across visual web editor scenarios.',
        metaLabel: 'Project features',
        guideAction: 'Get Started',
        examplesAction: 'Examples',
        stageLabel: 'Drag resize rotate demo',
        infoTitle: 'A silky drag · resize · rotate React component.',
      }
    : {
        eyebrow: '请操作点击右侧的Demo，体验丝滑交互',
        titlePrefix: '拖拽 · 缩放 ·',
        titleAccent: '旋转',
        titleSuffix: '从未如此简单。',
        lead:
          'react-drag-resize-rotate 是一个功能强大、轻量灵活的 React 组件，提供拖拽、缩放、旋转、嵌套编辑等能力，适用于各类 Web 可视化编辑场景。',
        metaLabel: '项目特性',
        guideAction: '快速开始',
        examplesAction: '示例代码',
        stageLabel: '拖拽缩放旋转演示',
        infoTitle: '丝滑的拖拽 · 缩放 · 旋转的 React 组件。',
      }

  const stats = isEn
    ? [
        { icon: '▼', text: 'React 18 / 19' },
        { icon: '✧', text: 'Lightweight' },
        { icon: '↪', text: 'Nestable' },
        { icon: '↯', text: 'Performant' },
      ]
    : [
        { icon: '▼', text: 'React 18 / 19' },
        { icon: '✧', text: '极轻量' },
        { icon: '↪', text: '可嵌套' },
        { icon: '↯', text: '高性能' },
      ]

  const features = isEn
    ? [
        {
          icon: '🎯',
          index: '01',
          title: 'Drag / Resize / Rotate',
          text: 'Move freely, resize from 8 directional handles, and rotate 360 degrees for editor-ready canvas interactions.',
        },
        {
          icon: '🧱',
          index: '02',
          title: 'Nested Editing / Children',
          text: 'Support multi-level parent-child editing, arbitrary React children, and data-driven node rendering.',
        },
        {
          icon: '🔁',
          index: '03',
          title: 'Aspect Lock / Flip / Size Limits',
          text: 'Lock aspect ratio, flip by dragging handles across edges, and constrain minimum or maximum dimensions.',
        },
        {
          icon: '🎨',
          index: '04',
          title: 'Theming / Lightweight Setup',
          text: 'Only React is required. Use direct component imports, with visuals driven by CSS variables.',
        },
      ]
    : [
        {
          icon: '🎯',
          index: '01',
          title: '拖拽 / 缩放 / 旋转',
          text: '支持自由移动、8 方向触点缩放和 360° 旋转，快速获得画布元素编辑能力。',
        },
        {
          icon: '🧱',
          index: '02',
          title: '嵌套编辑 / Children 承载',
          text: '支持父子元素多层嵌套，可通过 children 放入任意内容，也支持数据配置渲染节点。',
        },
        {
          icon: '🔁',
          index: '03',
          title: '锁比例 / 翻转 / 尺寸限制',
          text: '支持固定比例缩放、拖拽触点自由翻转，并限制元素最小 / 最大宽高。',
        },
        {
          icon: '🎨',
          index: '04',
          title: '样式定制 / 轻量接入',
          text: '仅依赖 React，支持单组件引入，主题样式由 CSS 变量驱动。',
        },
      ]

  useEffect(() => {
    let resizeObserver: ResizeObserver | null = null
    let frame = 0

    function syncPanelLimit() {
      if (!stageRef.current) return

      const stage = stageRef.current
      const stageRect = stage.getBoundingClientRect()
      const scaleX = stageRect.width / (stage.offsetWidth || stageRect.width || 1) || 1
      const scaleY = stageRect.height / (stage.offsetHeight || stageRect.height || 1) || 1
      const width = Math.round(stage.offsetWidth || stageRect.width)
      const height = Math.round(stage.offsetHeight || stageRect.height)
      const nextLimit = {
        ready: true,
        lx0: 0,
        lx1: Math.ceil(stageRect.width / scaleX),
        ly0: 0,
        ly1: Math.ceil(stageRect.height / scaleY),
      }

      setStageSize((current) => (current.width === width && current.height === height ? current : { width, height }))
      setPanelLimit((current) =>
        current.ready === nextLimit.ready &&
        current.lx0 === nextLimit.lx0 &&
        current.lx1 === nextLimit.lx1 &&
        current.ly0 === nextLimit.ly0 &&
        current.ly1 === nextLimit.ly1
          ? current
          : nextLimit
      )
    }

    function setupObserver(retryCount = 0) {
      syncPanelLimit()
      if (!heroRef.current || !stageRef.current) {
        if (retryCount < 5) {
          frame = window.requestAnimationFrame(() => setupObserver(retryCount + 1))
        }
        return
      }

      resizeObserver = new ResizeObserver(syncPanelLimit)
      resizeObserver.observe(heroRef.current)
      resizeObserver.observe(stageRef.current)
      window.addEventListener('resize', syncPanelLimit)
    }

    setupObserver()

    return () => {
      resizeObserver?.disconnect()
      window.removeEventListener('resize', syncPanelLimit)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <main className="vdr-home">
      <section ref={heroRef} className="vdr-hero">
        <div className="vdr-hero__grid" aria-hidden="true" />
        <div className="vdr-hero__shade" aria-hidden="true" />

        <div className="vdr-hero__inner">
          <div className="vdr-hero__copy">
            <p className="vdr-eyebrow">{copy.eyebrow}</p>
            <h1>
              <span className="vdr-hero__title-line">
                {copy.titlePrefix} <span className="vdr-hero__accent">{copy.titleAccent}</span>
              </span>
              <br />
              {copy.titleSuffix}
            </h1>

            <div>
              <p className="vdr-hero__lead">{copy.lead}</p>

              <div className="vdr-hero__meta" aria-label={copy.metaLabel}>
                {stats.map((item) => (
                  <span key={item.text}>
                    <i>{item.icon}</i>
                    {item.text}
                  </span>
                ))}
              </div>
            </div>

            <div className="vdr-hero__actions">
              <a className="vdr-button vdr-button--primary" href={`${docsPrefix}/guide/getting-started`}>
                {copy.guideAction} <span>→</span>
              </a>
              <a className="vdr-button" href={`${docsPrefix}/examples/basic`}>
                {copy.examplesAction} <span>↘</span>
              </a>
              <a className="vdr-button" href={GITHUB} target="_blank" rel="noreferrer">
                GitHub <span>↗</span>
              </a>
            </div>
          </div>

          <div ref={stageRef} className="vdr-stage" aria-label={copy.stageLabel}>
            <ReactDragResizeRotate
              className="vdr-stage__panel"
              overflow="hidden"
              w={demoPanel.w}
              h={demoPanel.h}
              x={demoPanel.x}
              y={demoPanel.y}
              r={demoPanel.r}
              limitX={panelLimitX}
              limitY={panelLimitY}
            >
              <div className="vdr-stage__surface">
                <ReactDragResizeRotate
                  className="vdr-stage__nested"
                  limitX={[0, demoPanel.w]}
                  limitY={[0, demoPanel.h]}
                  w={nestedPanel.w}
                  h={nestedPanel.h}
                  x={nestedPanel.x}
                  y={nestedPanel.y}
                  r={nestedPanel.r}
                >
                  <div className="vdr-stage__label">nesting</div>
                </ReactDragResizeRotate>
              </div>
            </ReactDragResizeRotate>
          </div>
        </div>
      </section>

      <section className="vdr-info">
        <div className="vdr-info__heading">
          <h2>{copy.infoTitle}</h2>
        </div>

        <div className="vdr-feature-grid">
          {features.map((feature) => (
            <article key={feature.title} className="vdr-feature">
              <div className="vdr-feature__top">
                <span className="vdr-feature__icon" aria-hidden="true">
                  {feature.icon}
                </span>
                <span className="vdr-feature__index">{feature.index}</span>
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
