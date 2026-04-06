import { useState, useEffect } from 'react'
import SchemaRenderer from '../components/SchemaRenderer'

const API_BASE = '/api'

export default function Landing() {
  const [products, setProducts] = useState([])
  const [dealList, setDealList] = useState([])
  const [dealId, setDealId] = useState('deal1')
  const [schema, setSchema] = useState(null)

  // Fetch product data + deal list on mount
  useEffect(() => {
    fetch(`${API_BASE}/products`).then(r => r.json()).then(setProducts)
    fetch(`${API_BASE}/schemas`).then(r => r.json()).then(setDealList)
  }, [])

  // Fetch the selected schema whenever dealId changes
  useEffect(() => {
    fetch(`${API_BASE}/schemas/${dealId}`)
      .then(r => r.json())
      .then(setSchema)
  }, [dealId])

  if (!schema) return null

  const pageStyle = schema.page?.style || {}
  const titleStyle = schema.page?.titleStyle || {}
  const subtitleStyle = schema.page?.subtitleStyle || {}

  return (
    <section className="landing" style={pageStyle}>
      <div className="landing-header">
        <div className="landing-hero">
          <h2 className="landing-title" style={titleStyle}>{schema.page?.title}</h2>
          <p className="landing-subtitle" style={subtitleStyle}>{schema.page?.subtitle}</p>
        </div>
        <select className="deal-select" value={dealId} onChange={e => setDealId(e.target.value)}>
          {dealList.map(d => (
            <option key={d.id} value={d.id}>{d.label}</option>
          ))}
        </select>
      </div>
      <div className="product-list">
        {products.map(product => (
          <SchemaRenderer key={product.id} schema={schema.card} product={product} />
        ))}
      </div>
    </section>
  )
}
