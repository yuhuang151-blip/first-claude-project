import { createElement } from 'react'

/**
 * Interpolates {field} placeholders in a string using the data context.
 */
function interpolate(template, data) {
  return template.replace(/\{(\w+)\}/g, (_, key) => data[key] ?? '')
}

/**
 * Enriches raw product data with computed fields used by schemas.
 */
export function enrichProduct(product) {
  const discount = Math.round((1 - product.price / product.originalPrice) * 100)
  return {
    ...product,
    discount,
    hasDiscount: discount > 0,
    formattedPrice: `$${product.price.toFixed(2)}`,
    formattedOriginal: `$${product.originalPrice.toFixed(2)}`,
  }
}

/**
 * Recursively renders a schema node tree into React elements.
 */
function SchemaNode({ node, data }) {
  if (!node) return null

  // Conditional rendering
  if (node.showIf && !data[node.showIf]) return null

  // Repeat: render this node once per array item
  if (node.repeat) {
    const items = data[node.repeat] || []
    const nodeWithoutRepeat = { ...node, repeat: undefined }
    return items.map((item, i) => {
      const itemData = typeof item === 'object' ? { ...data, ...item } : { ...data, _item: item }
      return <SchemaNode key={i} node={nodeWithoutRepeat} data={itemData} />
    })
  }

  const tag = node.type || 'div'

  // <img> is a void element — handle separately
  if (tag === 'img') {
    return createElement(tag, {
      style: node.style,
      src: interpolate(node.src, data),
      alt: interpolate(node.alt || '', data),
    })
  }

  // Resolve text content: static text > bind+format > nothing
  let textContent = null
  if (node.text != null) {
    textContent = interpolate(String(node.text), data)
  } else if (node.bind) {
    const value = data[node.bind]
    textContent = node.format ? interpolate(node.format.replace('{value}', value), data) : value
  }

  return createElement(
    tag,
    { style: node.style },
    textContent,
    ...(node.children || []).map((child, i) => (
      <SchemaNode key={i} node={child} data={data} />
    )),
  )
}

/**
 * Renders a single product card from a card schema + product data.
 */
export default function SchemaRenderer({ schema, product }) {
  const data = enrichProduct(product)
  return <SchemaNode node={schema} data={data} />
}
