import { useState, useEffect, useCallback, createElement } from 'react'
import { enrichProduct } from '../components/SchemaRenderer'

const API_BASE = '/api'

/* ------------------------------------------------------------------ */
/*  Path utilities                                                     */
/* ------------------------------------------------------------------ */
function pathEq(a, b) {
  if (!a || !b || a.length !== b.length) return false
  return a.every((v, i) => v === b[i])
}

function getNode(root, path) {
  let n = root
  for (const i of path) {
    if (!n.children?.[i]) return null
    n = n.children[i]
  }
  return n
}

function cloneAndUpdate(schema, path, updater) {
  const clone = JSON.parse(JSON.stringify(schema))
  let n = clone
  for (const i of path) n = n.children[i]
  updater(n)
  return clone
}

/* ------------------------------------------------------------------ */
/*  Interpolation (same logic as SchemaRenderer)                       */
/* ------------------------------------------------------------------ */
function interp(tpl, data) {
  return String(tpl).replace(/\{(\w+)\}/g, (_, k) => data[k] ?? '')
}

/* ------------------------------------------------------------------ */
/*  EditableNode — renders schema nodes with selection & drag          */
/* ------------------------------------------------------------------ */
function EditableNode({ node, data, path, selectedPath, onSelect, onDragStart }) {
  if (!node) return null
  if (node.showIf && !data[node.showIf]) return null

  if (node.repeat) {
    const items = data[node.repeat] || []
    const clean = { ...node, repeat: undefined }
    return items.map((item, i) => {
      const d = typeof item === 'object' ? { ...data, ...item } : { ...data, _item: item }
      return <EditableNode key={i} node={clean} data={d} path={path} selectedPath={selectedPath} onSelect={onSelect} onDragStart={onDragStart} />
    })
  }

  const tag = node.type || 'div'
  const isSelected = pathEq(selectedPath, path)

  const highlight = isSelected
    ? { outline: '2px solid #3b82f6', outlineOffset: '1px', cursor: 'move' }
    : {}

  const style = { ...node.style, ...highlight, position: node.style?.position || 'relative', zIndex: isSelected ? 10 : undefined }

  const handlePointerDown = (e) => {
    e.stopPropagation()
    onSelect(path)
    onDragStart(e, path)
  }

  if (tag === 'img') {
    return createElement(tag, {
      style,
      src: interp(node.src || '', data),
      alt: interp(node.alt || '', data),
      onPointerDown: handlePointerDown,
      draggable: false,
    })
  }

  let text = null
  if (node.text != null) text = interp(node.text, data)
  else if (node.bind) {
    const v = data[node.bind]
    text = node.format ? interp(node.format.replace('{value}', v), data) : v
  }

  return createElement(
    tag,
    { style, onPointerDown: handlePointerDown },
    text,
    ...(node.children || []).map((child, i) => (
      <EditableNode key={i} node={child} data={data} path={[...path, i]} selectedPath={selectedPath} onSelect={onSelect} onDragStart={onDragStart} />
    )),
  )
}

/* ------------------------------------------------------------------ */
/*  StyleEditor — property panel for the selected node                 */
/* ------------------------------------------------------------------ */
function StyleEditor({ node, onStyleChange, onPropChange, onDeleteStyle }) {
  const [newProp, setNewProp] = useState('')
  const [newVal, setNewVal] = useState('')

  if (!node) {
    return <div className="admin-panel-empty">Click an element on the canvas to inspect &amp; edit</div>
  }

  const entries = Object.entries(node.style || {})

  const handleAdd = () => {
    if (newProp && newVal) {
      onStyleChange(newProp, newVal)
      setNewProp('')
      setNewVal('')
    }
  }

  return (
    <div className="admin-style-editor">
      <h4 className="admin-section-label">Node</h4>
      <div className="admin-prop-row">
        <label>type</label>
        <input value={node.type || 'div'} onChange={e => onPropChange('type', e.target.value)} />
      </div>
      {node.text != null && (
        <div className="admin-prop-row">
          <label>text</label>
          <input value={node.text} onChange={e => onPropChange('text', e.target.value)} />
        </div>
      )}
      {node.bind && (
        <div className="admin-prop-row">
          <label>bind</label>
          <input value={node.bind} onChange={e => onPropChange('bind', e.target.value)} />
        </div>
      )}
      {node.format && (
        <div className="admin-prop-row">
          <label>format</label>
          <input value={node.format} onChange={e => onPropChange('format', e.target.value)} />
        </div>
      )}
      {node.showIf && (
        <div className="admin-prop-row">
          <label>showIf</label>
          <input value={node.showIf} onChange={e => onPropChange('showIf', e.target.value)} />
        </div>
      )}

      <h4 className="admin-section-label">Styles ({entries.length})</h4>
      <div className="admin-style-list">
        {entries.map(([prop, value]) => (
          <div key={prop} className="admin-prop-row">
            <label>{prop}</label>
            <input value={String(value)} onChange={e => onStyleChange(prop, e.target.value)} />
            <button className="admin-del-btn" onClick={() => onDeleteStyle(prop)}>&times;</button>
          </div>
        ))}
      </div>

      <div className="admin-add-row">
        <input placeholder="property" value={newProp} onChange={e => setNewProp(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAdd()} />
        <input placeholder="value" value={newVal} onChange={e => setNewVal(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAdd()} />
        <button onClick={handleAdd}>+</button>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Admin Page                                                         */
/* ------------------------------------------------------------------ */
export default function Admin() {
  const [dealList, setDealList] = useState([])
  const [dealId, setDealId] = useState('deal1')
  const [cardSchema, setCardSchema] = useState(null)
  const [products, setProducts] = useState([])
  const [productIdx, setProductIdx] = useState(0)
  const [selectedPath, setSelectedPath] = useState(null)
  const [dragInfo, setDragInfo] = useState(null)
  const [showJson, setShowJson] = useState(false)

  // Fetch data on mount
  useEffect(() => {
    fetch(`${API_BASE}/products`).then(r => r.json()).then(setProducts)
    fetch(`${API_BASE}/schemas`).then(r => r.json()).then(setDealList)
  }, [])

  // Fetch schema when deal changes
  useEffect(() => {
    fetch(`${API_BASE}/schemas/${dealId}`)
      .then(r => r.json())
      .then(s => {
        setCardSchema(JSON.parse(JSON.stringify(s.card)))
        setSelectedPath(null)
      })
  }, [dealId])

  const product = products[productIdx]
  const data = product ? enrichProduct(product) : null
  const selectedNode = selectedPath ? getNode(cardSchema, selectedPath) : null

  // ---- Style / prop change handlers ----
  const handleStyleChange = (prop, value) => {
    if (!selectedPath) return
    setCardSchema(prev => cloneAndUpdate(prev, selectedPath, n => {
      if (!n.style) n.style = {}
      const num = Number(value)
      n.style[prop] = (value !== '' && !isNaN(num) && !/px|%|#|rgb|hsl|deg|grad|url|calc|var|solid|dashed|none|auto|inherit|flex|wrap|column|row|center|space|baseline|cover|block|hidden|scroll|uppercase|lowercase|italic|monospace|serif|sans/i.test(value))
        ? num : value
    }))
  }

  const handleDeleteStyle = (prop) => {
    if (!selectedPath) return
    setCardSchema(prev => cloneAndUpdate(prev, selectedPath, n => {
      delete n.style[prop]
    }))
  }

  const handlePropChange = (prop, value) => {
    if (!selectedPath) return
    setCardSchema(prev => cloneAndUpdate(prev, selectedPath, n => { n[prop] = value }))
  }

  // ---- Drag ----
  const handleDragStart = useCallback((e, path) => {
    const node = getNode(cardSchema, path)
    if (!node) return
    const s = node.style || {}
    const isAbsolute = s.position === 'absolute'
    setDragInfo({
      path,
      startX: e.clientX,
      startY: e.clientY,
      isAbsolute,
      origX: parseInt(isAbsolute ? (s.left ?? s.right ?? 0) : (s.marginLeft ?? 0)) || 0,
      origY: parseInt(isAbsolute ? (s.top ?? s.bottom ?? 0) : (s.marginTop ?? 0)) || 0,
      useRight: isAbsolute && s.right != null && s.left == null,
      useBottom: isAbsolute && s.bottom != null && s.top == null,
    })
  }, [cardSchema])

  useEffect(() => {
    if (!dragInfo) return

    const handleMove = (e) => {
      const dx = e.clientX - dragInfo.startX
      const dy = e.clientY - dragInfo.startY

      setCardSchema(prev => cloneAndUpdate(prev, dragInfo.path, n => {
        if (!n.style) n.style = {}
        if (dragInfo.isAbsolute) {
          const propX = dragInfo.useRight ? 'right' : 'left'
          const propY = dragInfo.useBottom ? 'bottom' : 'top'
          const signX = dragInfo.useRight ? -1 : 1
          const signY = dragInfo.useBottom ? -1 : 1
          n.style[propX] = `${dragInfo.origX + dx * signX}px`
          n.style[propY] = `${dragInfo.origY + dy * signY}px`
        } else {
          const ml = dragInfo.origX + dx
          const mt = dragInfo.origY + dy
          if (ml) n.style.marginLeft = `${ml}px`; else delete n.style.marginLeft
          if (mt) n.style.marginTop = `${mt}px`; else delete n.style.marginTop
        }
      }))
    }

    const handleUp = () => setDragInfo(null)

    document.addEventListener('pointermove', handleMove)
    document.addEventListener('pointerup', handleUp)
    return () => {
      document.removeEventListener('pointermove', handleMove)
      document.removeEventListener('pointerup', handleUp)
    }
  }, [dragInfo])

  if (!cardSchema || !data) return null

  return (
    <section className="admin" style={{ userSelect: dragInfo ? 'none' : undefined }}>
      {/* Toolbar */}
      <div className="admin-toolbar">
        <div className="admin-toolbar-group">
          <label>Schema</label>
          <select value={dealId} onChange={e => setDealId(e.target.value)}>
            {dealList.map(d => <option key={d.id} value={d.id}>{d.label}</option>)}
          </select>
        </div>
        <div className="admin-toolbar-group">
          <label>Preview product</label>
          <select value={productIdx} onChange={e => setProductIdx(Number(e.target.value))}>
            {products.map((p, i) => <option key={p.id} value={i}>{p.title}</option>)}
          </select>
        </div>
        <button className="admin-json-toggle" onClick={() => setShowJson(v => !v)}>
          {showJson ? 'Hide' : 'Show'} JSON
        </button>
      </div>

      {/* Workspace */}
      <div className="admin-workspace">
        {/* Canvas */}
        <div className="admin-canvas" onClick={() => setSelectedPath(null)}>
          <div className="admin-card-frame">
            <EditableNode
              node={cardSchema}
              data={data}
              path={[]}
              selectedPath={selectedPath}
              onSelect={setSelectedPath}
              onDragStart={handleDragStart}
            />
          </div>
        </div>

        {/* Property panel */}
        <div className="admin-panel">
          <h3 className="admin-panel-title">Inspector</h3>
          {selectedPath && (
            <div className="admin-path">
              {selectedPath.length === 0 ? 'root' : `root → ${selectedPath.join(' → ')}`}
            </div>
          )}
          <StyleEditor
            node={selectedNode}
            onStyleChange={handleStyleChange}
            onPropChange={handlePropChange}
            onDeleteStyle={handleDeleteStyle}
          />
        </div>
      </div>

      {/* JSON preview */}
      {showJson && (
        <div className="admin-json">
          <pre>{JSON.stringify(cardSchema, null, 2)}</pre>
        </div>
      )}
    </section>
  )
}
