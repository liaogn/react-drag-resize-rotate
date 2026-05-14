import { useState } from 'react'
import { Highlight, themes } from 'prism-react-renderer'
import { DemoLocaleContext, type DemoLocale } from './i18n'

interface DemoPreviewProps {
  title: string
  description: string
  component: React.ComponentType
  source: string
  locale?: DemoLocale
}

export default function DemoPreview({
  title,
  description,
  component: Component,
  source,
  locale = 'zh',
}: DemoPreviewProps) {
  const [expanded, setExpanded] = useState(false)
  const [copied, setCopied] = useState(false)
  const labels =
    locale === 'en'
      ? { expand: 'Show code', collapse: 'Hide code', copy: 'Copy code', copied: 'Copied' }
      : { expand: '展开代码', collapse: '收起代码', copy: '复制代码', copied: '已复制' }

  async function copyCode() {
    if (typeof navigator === 'undefined' || !navigator.clipboard) return
    await navigator.clipboard.writeText(source)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1400)
  }

  return (
    <DemoLocaleContext.Provider value={locale}>
      <section className="vdr-demo-preview">
        <div className="vdr-demo-preview__info">
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
        <div className="vdr-demo-preview__canvas">
          <Component />
        </div>
        <div className="vdr-demo-preview__bar">
          <button type="button" onClick={() => setExpanded((value) => !value)}>
            {expanded ? labels.collapse : labels.expand}
          </button>
          <button type="button" onClick={copyCode}>
            {copied ? labels.copied : labels.copy}
          </button>
        </div>
        {expanded ? (
          <div className="vdr-demo-preview__source">
            <Highlight theme={themes.github} code={source} language="tsx">
              {({ className, style, tokens, getLineProps, getTokenProps }) => (
                <pre className={className} style={style}>
                  {tokens.map((line, index) => (
                    <div key={index} {...getLineProps({ line })}>
                      {line.map((token, tokenIndex) => (
                        <span key={tokenIndex} {...getTokenProps({ token })} />
                      ))}
                    </div>
                  ))}
                </pre>
              )}
            </Highlight>
          </div>
        ) : null}
      </section>
    </DemoLocaleContext.Provider>
  )
}
