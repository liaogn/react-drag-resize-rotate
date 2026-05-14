import {
  type CSSProperties,
  type HTMLAttributes,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  getSymStick,
  RectDrager,
  RectRotator,
  RectFliper,
  getElementGeometricInfo,
  calcVerticalCrossPoint,
  calcRotatedPoint,
  calcRotatedContactor,
  normalizeSizeLimits,
  hasMinSizeLimit,
  getLimitedSize,
  getValidWhRatio,
  calcRectResetRotated,
  computeResize,
  buildStickCursor,
  shouldResetStickCursor,
  hasBoundary,
  clampPositionWithinLimits,
  isRectInsideLimits,
  fitResizeWithinLimits,
  type LimitRange,
  type ElementGeometricInfo,
  type FlipSign,
  type Point,
  type PosData,
  type StickHoverRender,
  type StickType,
} from '../core'

export type VdrEventHandler = (pos: PosData, event: MouseEvent) => void

export type ChildWrapAttr = HTMLAttributes<HTMLDivElement> & {
  style?: CSSProperties
}

export interface ReactDragResizeRotateProps {
  overflow?: string
  uuid?: string | number
  bg?: string
  lock?: boolean
  w?: number
  h?: number
  minWidth?: number
  minHeight?: number
  maxWidth?: number
  maxHeight?: number
  x?: number
  y?: number
  z?: number | string
  r?: number
  sticks?: string[]
  active?: boolean
  draggable?: boolean
  resizeable?: boolean
  rotateable?: boolean
  activeable?: boolean
  childrens?: ChildConfig[]
  childWrapAttr?: ChildWrapAttr
  stickHoverRender?: StickHoverRender
  limitX?: [number, number] | null
  limitY?: [number, number] | null
  className?: string
  style?: CSSProperties
  children?: ReactNode
  onActivated?: VdrEventHandler
  onDragStart?: VdrEventHandler
  onDragging?: VdrEventHandler
  onDragStop?: VdrEventHandler
  onResizeStart?: VdrEventHandler
  onResizing?: VdrEventHandler
  onResizeStop?: VdrEventHandler
  onRotateStart?: VdrEventHandler
  onRotating?: VdrEventHandler
  onRotateStop?: VdrEventHandler
  onFliped?: VdrEventHandler
}

export type ChildConfig = Omit<ReactDragResizeRotateProps, 'children'> & {
  uuid?: string | number
}

interface RectState {
  width: number
  height: number
  left: number
  top: number
  zIndex: number | string
  rotate: number
  whRatio: number
  currentStick: string
  activeStickIndex: number
  flipSign: FlipSign
  stickDrag: boolean
  isMiddlePoint: RegExpMatchArray | null
}

const DEFAULT_STICKS = ['tl', 'tm', 'tr', 'mr', 'br', 'bm', 'bl', 'ml', 'angle']

function isValidLimit(limit: [number, number] | null | undefined): limit is [number, number] {
  return Array.isArray(limit) && limit.length === 2 && limit[0] <= limit[1]
}

function toMouseEvent(ev: ReactMouseEvent): MouseEvent {
  return ev.nativeEvent
}

export function ReactDragResizeRotate({
  overflow = '',
  uuid = '',
  bg = '',
  lock = false,
  w = 100,
  h = 100,
  minWidth = 0,
  minHeight = 0,
  maxWidth = Infinity,
  maxHeight = Infinity,
  x = 0,
  y = 0,
  z = '',
  r = 0,
  sticks,
  active = true,
  draggable = true,
  resizeable = true,
  rotateable = true,
  activeable = true,
  childrens,
  childWrapAttr,
  stickHoverRender,
  limitX = null,
  limitY = null,
  className,
  style,
  children,
  onActivated,
  onDragStart,
  onDragging,
  onDragStop,
  onResizeStart,
  onResizing,
  onResizeStop,
  onRotateStart,
  onRotating,
  onRotateStop,
  onFliped,
}: ReactDragResizeRotateProps) {
  const vdrRef = useRef<HTMLDivElement | null>(null)
  const rectDragerRef = useRef(new RectDrager())
  const rectRotatorRef = useRef(new RectRotator())
  const rectFliperRef = useRef<RectFliper | null>(null)
  const elementInfoRef = useRef<ElementGeometricInfo | null>(null)
  const parentInfoRef = useRef<ElementGeometricInfo | null>(null)
  const absoluteContactorRef = useRef<Point | null>(null)
  const symAbsoluteContactorRef = useRef<Point | null>(null)
  const symRelativeContactorRef = useRef<Point | null>(null)

  const [state, setState] = useState<RectState>(() => ({
    width: w,
    height: h,
    left: x,
    top: y,
    zIndex: z,
    rotate: r,
    whRatio: 1,
    currentStick: '',
    activeStickIndex: -1,
    flipSign: '',
    stickDrag: false,
    isMiddlePoint: null,
  }))
  const stateRef = useRef(state)

  const allSticks = sticks ?? DEFAULT_STICKS
  const resizeSticks = useMemo(() => allSticks.filter((item) => item !== 'angle'), [allSticks])
  const limitXRange = isValidLimit(limitX) ? limitX : null
  const limitYRange = isValidLimit(limitY) ? limitY : null
  const sizeLimits = useMemo(
    () =>
      normalizeSizeLimits({
        minWidth,
        minHeight,
        maxWidth,
        maxHeight,
      }),
    [minWidth, minHeight, maxWidth, maxHeight]
  )

  const getPosData = useCallback(
    (source = stateRef.current): PosData => ({
      x: source.left,
      y: source.top,
      w: source.width,
      h: source.height,
      r: source.rotate,
      z: source.zIndex,
      stick: source.currentStick as PosData['stick'],
      lock,
      active,
      uuid,
      flipSign: source.flipSign,
    }),
    [active, lock, uuid]
  )

  const patchState = useCallback((patch: Partial<RectState>) => {
    stateRef.current = {
      ...stateRef.current,
      ...patch,
    }
    setState(stateRef.current)
  }, [])

  const syncWhRatio = useCallback(() => {
    const current = stateRef.current
    if (current.width > 0 && current.height > 0) {
      patchState({ whRatio: current.width / current.height })
    }
  }, [patchState])

  const applyBoundaryToCurrent = useCallback(() => {
    if (!hasBoundary(limitXRange as LimitRange, limitYRange as LimitRange)) return
    const current = stateRef.current
    const clamped = clampPositionWithinLimits(
      {
        left: current.left,
        top: current.top,
        width: current.width,
        height: current.height,
        rotate: current.rotate,
      },
      limitXRange as LimitRange,
      limitYRange as LimitRange
    )
    if (clamped.fits) {
      patchState({ left: clamped.left, top: clamped.top })
    }
  }, [limitXRange, limitYRange, patchState])

  const limitCurrentSize = useCallback(() => {
    const current = stateRef.current
    const { width, height } = getLimitedSize({
      width: current.width,
      height: current.height,
      lock,
      baseAxis: 'width',
      limits: sizeLimits,
      whRatio: getValidWhRatio(current.whRatio),
    })
    patchState({ width, height })
  }, [lock, patchState, sizeLimits])

  const cacheRectDomInfo = useCallback((element: HTMLElement) => {
    elementInfoRef.current = getElementGeometricInfo(element)
    const parentElement = element.parentNode as HTMLElement
    parentInfoRef.current = getElementGeometricInfo(parentElement)
  }, [])

  const syncDomToData = useCallback(() => {
    const el = vdrRef.current
    if (!el) return
    const current = stateRef.current
    el.style.width = `${current.width}px`
    el.style.height = `${current.height}px`
    el.style.transform = `translate3d(${current.left}px,${current.top}px,0) rotateZ(${current.rotate}deg)`
  }, [])

  const stickDownHandle = useCallback(
    (stick: string) => {
      const el = vdrRef.current
      if (!el) return

      syncDomToData()
      cacheRectDomInfo(el)

      const current = stateRef.current
      const isMiddlePoint = stick.match('m')
      patchState({ currentStick: stick, isMiddlePoint })

      if (current.stickDrag) return
      if (!elementInfoRef.current || !parentInfoRef.current) return

      const stickKey = stick as StickType
      const absoluteContactor = calcRotatedContactor(elementInfoRef.current, stickKey) as Point
      const symAbsoluteContactor = calcRotatedContactor(
        elementInfoRef.current,
        getSymStick(stickKey) as StickType
      ) as Point
      const symRotatedContactor = calcRotatedPoint(
        symAbsoluteContactor,
        [parentInfoRef.current.cx, parentInfoRef.current.cy],
        parentInfoRef.current.absoluteRotate
      )

      absoluteContactorRef.current = absoluteContactor
      symAbsoluteContactorRef.current = symAbsoluteContactor
      symRelativeContactorRef.current = [
        symRotatedContactor[0] - parentInfoRef.current.left,
        symRotatedContactor[1] - parentInfoRef.current.top,
      ]
      rectFliperRef.current = new RectFliper(elementInfoRef.current, stickKey)
    },
    [cacheRectDomInfo, patchState, syncDomToData]
  )

  const bodyMove = useCallback(
    (ev: MouseEvent) => {
      const current = stateRef.current
      const moveInfo = rectDragerRef.current.moveHandle(ev)
      let nextLeft = moveInfo[0]
      let nextTop = moveInfo[1]

      if (hasBoundary(limitXRange as LimitRange, limitYRange as LimitRange)) {
        const clamped = clampPositionWithinLimits(
          {
            left: nextLeft,
            top: nextTop,
            width: current.width,
            height: current.height,
            rotate: current.rotate,
          },
          limitXRange as LimitRange,
          limitYRange as LimitRange
        )
        if (clamped.fits) {
          nextLeft = clamped.left
          nextTop = clamped.top
        } else {
          nextLeft = current.left
          nextTop = current.top
        }
      }

      patchState({ left: nextLeft, top: nextTop })
      onDragging?.(getPosData({ ...stateRef.current, left: nextLeft, top: nextTop }), ev)
    },
    [getPosData, limitXRange, limitYRange, onDragging, patchState]
  )

  const rotateMove = useCallback(
    (ev: MouseEvent) => {
      const current = stateRef.current
      const nextRotate = rectRotatorRef.current.moveHandle(ev)

      if (hasBoundary(limitXRange as LimitRange, limitYRange as LimitRange)) {
        const clamped = clampPositionWithinLimits(
          {
            left: current.left,
            top: current.top,
            width: current.width,
            height: current.height,
            rotate: nextRotate,
          },
          limitXRange as LimitRange,
          limitYRange as LimitRange
        )
        if (!clamped.fits) return
        patchState({ rotate: nextRotate, left: clamped.left, top: clamped.top })
        onRotating?.(
          getPosData({ ...stateRef.current, rotate: nextRotate, left: clamped.left, top: clamped.top }),
          ev
        )
      } else {
        patchState({ rotate: nextRotate })
        onRotating?.(getPosData({ ...stateRef.current, rotate: nextRotate }), ev)
      }
    },
    [getPosData, limitXRange, limitYRange, onRotating, patchState]
  )

  const stickMove = useCallback(
    (ev: MouseEvent) => {
      const current = stateRef.current
      if (
        !absoluteContactorRef.current ||
        !symAbsoluteContactorRef.current ||
        !symRelativeContactorRef.current ||
        !parentInfoRef.current
      ) {
        return
      }

      let mousePoint: number[] = [ev.clientX, ev.clientY]
      if (lock || current.isMiddlePoint) {
        mousePoint = calcVerticalCrossPoint(
          mousePoint,
          absoluteContactorRef.current,
          symAbsoluteContactorRef.current
        )
      }

      const { newMousePoint, newSymPoint } = calcRectResetRotated(
        mousePoint,
        symRelativeContactorRef.current,
        parentInfoRef.current,
        current.rotate
      )

      const next = computeResize({
        point: newMousePoint,
        symPoint: newSymPoint,
        stick: current.currentStick,
        lock,
        rotate: current.rotate,
        width: current.width,
        height: current.height,
        whRatio: getValidWhRatio(current.whRatio),
        limits: sizeLimits,
        symRelativeContactor: symRelativeContactorRef.current,
      })

      let patch: Partial<RectState> = {}
      if (next) {
        let result = next
        if (
          hasBoundary(limitXRange as LimitRange, limitYRange as LimitRange) &&
          !isRectInsideLimits(
            {
              left: next.left ?? current.left,
              top: next.top ?? current.top,
              width: next.width,
              height: next.height,
              rotate: current.rotate,
            },
            limitXRange as LimitRange,
            limitYRange as LimitRange
          )
        ) {
          result = fitResizeWithinLimits(
            {
              width: next.width,
              height: next.height,
              prevWidth: current.width,
              prevHeight: current.height,
              stick: current.currentStick as StickType,
              rotate: current.rotate,
              symRelativeContactor: symRelativeContactorRef.current,
              lock,
              whRatio: getValidWhRatio(current.whRatio),
              limits: sizeLimits,
            },
            limitXRange as LimitRange,
            limitYRange as LimitRange
          )
        }

        patch = {
          width: result.width,
          height: result.height,
          ...(result.left !== undefined ? { left: result.left } : {}),
          ...(result.top !== undefined ? { top: result.top } : {}),
        }
        patchState(patch)
      }

      if (!hasMinSizeLimit(sizeLimits) && rectFliperRef.current) {
        rectFliperRef.current.borderSignsWatcher(mousePoint, (isDegFlip: boolean, sign: FlipSign) => {
          const nextRotate = isDegFlip
            ? stateRef.current.rotate + (sign === '-' ? -180 : 180)
            : stateRef.current.rotate
          const flipPatch = { flipSign: sign, rotate: nextRotate }
          patchState(flipPatch)
          onFliped?.(getPosData({ ...stateRef.current, ...flipPatch }), ev)
          if (rectFliperRef.current) {
            stickDownHandle(rectFliperRef.current.getFlipStick(stateRef.current.currentStick as StickType))
          }
        })
      }

      onResizing?.(getPosData({ ...stateRef.current, ...patch }), ev)
    },
    [
      getPosData,
      limitXRange,
      limitYRange,
      lock,
      onFliped,
      onResizing,
      patchState,
      sizeLimits,
      stickDownHandle,
    ]
  )

  const move = useCallback(
    (ev: MouseEvent) => {
      const current = stateRef.current
      if (draggable && rectDragerRef.current.isDrag && !current.stickDrag) {
        bodyMove(ev)
      }
      if (resizeable && current.stickDrag) {
        stickMove(ev)
      }
      if (rotateable && rectRotatorRef.current.isDrag) {
        rotateMove(ev)
      }
    },
    [bodyMove, draggable, resizeable, rotateMove, rotateable, stickMove]
  )

  const up = useCallback(
    (ev: MouseEvent) => {
      const current = stateRef.current
      if (draggable && rectDragerRef.current.isDrag) {
        rectDragerRef.current.upHandle()
        onDragStop?.(getPosData(), ev)
      }
      if (resizeable && current.stickDrag) {
        patchState({ stickDrag: false })
        onResizeStop?.(getPosData({ ...stateRef.current, stickDrag: false }), ev)
      }
      if (rotateable && rectRotatorRef.current.isDrag) {
        rectRotatorRef.current.upHandle()
        onRotateStop?.(getPosData(), ev)
      }
      syncWhRatio()
    },
    [
      draggable,
      getPosData,
      onDragStop,
      onResizeStop,
      onRotateStop,
      patchState,
      resizeable,
      rotateable,
      syncWhRatio,
    ]
  )

  function bodyDown(ev: ReactMouseEvent<HTMLDivElement>) {
    ev.stopPropagation()
    if (!activeable || !vdrRef.current) return
    const nativeEvent = toMouseEvent(ev)
    patchState({ currentStick: '' })
    rectDragerRef.current.downHandle(nativeEvent, [stateRef.current.left, stateRef.current.top], vdrRef.current)
    onActivated?.(getPosData({ ...stateRef.current, currentStick: '' }), nativeEvent)
    onDragStart?.(getPosData({ ...stateRef.current, currentStick: '' }), nativeEvent)
  }

  function rotateDown(ev: ReactMouseEvent<HTMLSpanElement>) {
    ev.stopPropagation()
    ev.preventDefault()
    if (!activeable || !vdrRef.current) return
    const nativeEvent = toMouseEvent(ev)
    patchState({ currentStick: 'angle' })
    rectRotatorRef.current.downHandle(nativeEvent, vdrRef.current, stateRef.current.rotate)
    onRotateStart?.(getPosData({ ...stateRef.current, currentStick: 'angle' }), nativeEvent)
  }

  function stickDown(ev: ReactMouseEvent<HTMLSpanElement>, stick: string, index: number) {
    ev.stopPropagation()
    ev.preventDefault()
    if (!activeable || !resizeable) return
    syncWhRatio()
    patchState({ activeStickIndex: index })
    stickDownHandle(stick)
    patchState({ stickDrag: true })
    onResizeStart?.(getPosData({ ...stateRef.current, currentStick: stick, stickDrag: true }), toMouseEvent(ev))
  }

  function onStickMouseenter(ev: ReactMouseEvent<HTMLSpanElement>, stick: string) {
    const cursor = buildStickCursor(
      toMouseEvent(ev),
      stick,
      {
        stickDrag: stateRef.current.stickDrag,
        currentStick: stateRef.current.currentStick,
        resizeable,
      },
      { hoverRender: stickHoverRender }
    )
    if (cursor !== null) ev.currentTarget.style.cursor = cursor
  }

  function onStickMouseout(ev: ReactMouseEvent<HTMLSpanElement>, stick: string) {
    if (shouldResetStickCursor(stick, { stickDrag: stateRef.current.stickDrag })) {
      ev.currentTarget.style.cursor = ''
    }
  }

  useEffect(() => {
    stateRef.current = state
  }, [state])

  useEffect(() => {
    syncWhRatio()
    limitCurrentSize()
    applyBoundaryToCurrent()
    if (vdrRef.current) cacheRectDomInfo(vdrRef.current)
  }, [applyBoundaryToCurrent, cacheRectDomInfo, limitCurrentSize, syncWhRatio])

  useEffect(() => {
    document.documentElement.addEventListener('mousemove', move)
    document.documentElement.addEventListener('mouseup', up)
    return () => {
      document.documentElement.removeEventListener('mousemove', move)
      document.documentElement.removeEventListener('mouseup', up)
    }
  }, [move, up])

  useEffect(() => {
    patchState({ left: x })
    queueMicrotask(applyBoundaryToCurrent)
  }, [applyBoundaryToCurrent, patchState, x])

  useEffect(() => {
    patchState({ top: y })
    queueMicrotask(applyBoundaryToCurrent)
  }, [applyBoundaryToCurrent, patchState, y])

  useEffect(() => {
    const current = stateRef.current
    patchState({
      width: getLimitedSize({
        width: w,
        height: current.height,
        lock,
        baseAxis: 'width',
        limits: sizeLimits,
        whRatio: getValidWhRatio(current.whRatio),
      }).width,
    })
  }, [lock, patchState, sizeLimits, w])

  useEffect(() => {
    const current = stateRef.current
    patchState({
      height: getLimitedSize({
        width: current.width,
        height: h,
        lock,
        baseAxis: 'height',
        limits: sizeLimits,
        whRatio: getValidWhRatio(current.whRatio),
      }).height,
    })
  }, [h, lock, patchState, sizeLimits])

  useEffect(() => {
    patchState({ rotate: r })
    queueMicrotask(applyBoundaryToCurrent)
  }, [applyBoundaryToCurrent, patchState, r])

  useEffect(() => {
    patchState({ zIndex: z })
  }, [patchState, z])

  const classNames = [
    'vdr',
    active && activeable ? 'vdr-active' : '',
    !activeable ? 'vdr-not-active' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')

  let cursor = 'pointer'
  if (active) cursor = draggable ? 'move' : 'no-drop'
  if (!activeable) cursor = 'no-drop'

  const rootStyle: CSSProperties = {
    ...style,
    zIndex: state.zIndex,
    width: `${state.width}px`,
    height: `${state.height}px`,
    backgroundImage: bg ? `url(${bg})` : undefined,
    transform: `translate3d(${state.left}px,${state.top}px,0) rotateZ(${state.rotate}deg)`,
    cursor,
  }

  const mergedChildWrapAttr: ChildWrapAttr | undefined =
    overflow || childWrapAttr
      ? {
          ...(childWrapAttr ?? {}),
          style: {
            ...(childWrapAttr?.style ?? {}),
            ...(overflow ? { overflow } : {}),
          },
        }
      : undefined

  const renderedChildren = (
    <>
      {childrens?.map((child, index) => (
        <ReactDragResizeRotate key={child.uuid ?? `child_${index}`} {...child} />
      ))}
      {children}
    </>
  )

  return (
    <div ref={vdrRef} className={classNames} style={rootStyle} onClick={(ev) => ev.stopPropagation()} onMouseDown={bodyDown}>
      {active && activeable ? <i className="vdr-outline" aria-hidden="true" /> : null}
      {active && activeable
        ? resizeSticks.map((stick, stickIndex) => (
            <span
              key={stick}
              className={`vdr-stick vdr-stick-${stick}`}
              style={{ zIndex: state.activeStickIndex === stickIndex ? 10 : 9 }}
              onMouseDown={(ev) => stickDown(ev, stick, stickIndex)}
              onMouseEnter={(ev) => onStickMouseenter(ev, stick)}
              onMouseOut={(ev) => onStickMouseout(ev, stick)}
            />
          ))
        : null}
      {active && activeable && allSticks.includes('angle') ? (
        <>
          <span className="vdr-stick-rotate-line" />
          <span
            className="vdr-stick vdr-angle"
            style={{ cursor: !rotateable ? 'no-drop' : undefined }}
            onMouseDown={rotateDown}
          />
        </>
      ) : null}
      {mergedChildWrapAttr ? (
        <div {...mergedChildWrapAttr} className={['childWrap', mergedChildWrapAttr.className].filter(Boolean).join(' ')}>
          {renderedChildren}
        </div>
      ) : (
        renderedChildren
      )}
    </div>
  )
}

export default ReactDragResizeRotate
