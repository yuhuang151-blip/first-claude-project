/**
 * Card schemas — each describes a complete card DOM tree.
 *
 * Node shape:
 *   type      – HTML tag name (div, span, h3, img, button …)
 *   style     – inline CSS (camelCase)
 *   children  – child nodes
 *   text      – static text, supports {field} interpolation
 *   bind      – render product[field] as text; pair with `format` for template
 *   format    – e.g. "-{value}%" or "${value}"
 *   repeat    – iterate product[field] array; current item exposed as `_item`
 *   showIf    – only render when data[field] is truthy
 *   src / alt – for <img>, support {field} interpolation
 */

/* ------------------------------------------------------------------ */
/*  Shared style fragments (keep schemas DRY)                         */
/* ------------------------------------------------------------------ */
const imgFill = { width: '100%', height: '100%', objectFit: 'cover', display: 'block' }

const imgNode = { type: 'img', src: '{image}', alt: '{title}', style: imgFill }

const badge = (extra = {}) => ({
  type: 'span', showIf: 'hasDiscount', bind: 'discount', format: '-{value}%',
  style: { position: 'absolute', top: '12px', left: '12px', background: '#e53e3e', color: '#fff', fontSize: '13px', fontWeight: 700, padding: '4px 10px', borderRadius: '6px', ...extra },
})

const tagList = (tagStyle) => ({
  type: 'div',
  style: { display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' },
  children: [{ type: 'span', repeat: 'tags', bind: '_item', style: tagStyle }],
})

const defaultTagStyle = { fontSize: '11px', fontWeight: 600, padding: '3px 8px', borderRadius: '4px', background: 'rgba(170,59,255,0.1)', color: '#aa3bff', textTransform: 'uppercase', letterSpacing: '0.3px' }

const pricingRow = (priceStyle, originalStyle, gap = '10px', mb = '10px') => ({
  type: 'div',
  style: { display: 'flex', alignItems: 'baseline', gap, marginBottom: mb },
  children: [
    { type: 'span', bind: 'formattedPrice', style: priceStyle },
    { type: 'span', bind: 'formattedOriginal', style: originalStyle },
  ],
})

const defaultPriceStyle = { fontSize: '22px', fontWeight: 700, color: '#e53e3e' }
const defaultOriginalStyle = { fontSize: '14px', color: '#6b6375', textDecoration: 'line-through' }

const endTag = (extra = {}) => ({
  type: 'span', bind: 'endTag',
  style: { display: 'inline-block', fontSize: '12px', fontWeight: 500, color: '#6b6375', background: '#f4f3ec', padding: '3px 10px', borderRadius: '4px', ...extra },
})

const titleNode = (extra = {}) => ({
  type: 'h3', bind: 'title',
  style: { fontSize: '16px', fontWeight: 600, margin: '0 0 10px', color: '#08060d', lineHeight: '1.4', ...extra },
})

/* ------------------------------------------------------------------ */
/*  1 · Classic — vertical card, clean & simple                       */
/* ------------------------------------------------------------------ */
const deal1 = {
  id: 'deal1',
  label: 'Deal 1 — Classic',
  page: { title: "Today's Deals", subtitle: 'Handpicked products at unbeatable prices. Limited time only.', style: {} },
  card: {
    type: 'div',
    style: { border: '1px solid #e5e4e7', borderRadius: '12px', overflow: 'hidden', background: '#fff' },
    children: [
      { type: 'div', style: { position: 'relative', aspectRatio: '1', overflow: 'hidden' }, children: [imgNode, badge()] },
      { type: 'div', style: { padding: '16px' }, children: [titleNode(), tagList(defaultTagStyle), pricingRow(defaultPriceStyle, defaultOriginalStyle), endTag()] },
    ],
  },
}

/* ------------------------------------------------------------------ */
/*  2 · Mega Sale — Southeast-Asia promo vibes                        */
/* ------------------------------------------------------------------ */
const deal2 = {
  id: 'deal2',
  label: 'Deal 2 — Mega Sale',
  page: {
    title: 'MEGA DEALS',
    subtitle: 'Biggest discounts of the season! Grab them before they are gone!',
    style: { background: 'linear-gradient(180deg, #fff1f0 0%, #fff 120px)', margin: '-20px auto 0', padding: '20px 16px 0', borderRadius: '16px' },
    titleStyle: { color: '#e53e3e', fontSize: '30px', letterSpacing: '1px', textTransform: 'uppercase' },
    subtitleStyle: { color: '#e53e3e', opacity: 0.75 },
  },
  card: {
    type: 'div',
    style: { border: '2px solid #e53e3e', borderRadius: '16px', overflow: 'hidden', background: '#fff' },
    children: [
      { type: 'div', text: 'MEGA SALE', style: { background: 'linear-gradient(90deg, #e53e3e, #ff6b35)', color: '#fff', textAlign: 'center', fontSize: '13px', fontWeight: 800, letterSpacing: '2px', padding: '6px 0', textTransform: 'uppercase' } },
      { type: 'div', style: { position: 'relative', aspectRatio: '1', overflow: 'hidden' }, children: [imgNode, { type: 'span', showIf: 'hasDiscount', bind: 'discount', format: '{value}% OFF', style: { position: 'absolute', top: '12px', right: '12px', background: 'linear-gradient(135deg, #ff6b35, #e53e3e)', color: '#fff', fontSize: '14px', fontWeight: 800, padding: '6px 12px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(229,62,62,0.4)' } }] },
      { type: 'div', style: { padding: '16px' }, children: [
        tagList({ fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '4px', background: '#fff1f0', color: '#e53e3e', border: '1px solid #fecaca', textTransform: 'uppercase', letterSpacing: '0.3px' }),
        titleNode({ fontSize: '17px', fontWeight: 700 }),
        pricingRow({ fontSize: '26px', fontWeight: 800, color: '#e53e3e' }, { fontSize: '15px', color: '#6b6375', textDecoration: 'line-through' }, '10px', '14px'),
        { type: 'div', style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }, children: [
          { type: 'span', bind: 'endTag', style: { fontSize: '12px', fontWeight: 600, color: '#e53e3e', background: '#fff1f0', padding: '4px 10px', borderRadius: '4px', border: '1px dashed #fecaca' } },
          { type: 'button', text: 'Buy Now', style: { background: 'linear-gradient(90deg, #e53e3e, #ff6b35)', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '8px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.5px' } },
        ] },
      ] },
    ],
  },
}

/* ------------------------------------------------------------------ */
/*  3 · Compact — horizontal left-image / right-info                  */
/* ------------------------------------------------------------------ */
const deal3 = {
  id: 'deal3',
  label: 'Deal 3 — Compact',
  page: { title: "Today's Deals", subtitle: 'Handpicked products at unbeatable prices. Limited time only.', style: {} },
  card: {
    type: 'div',
    style: { display: 'flex', flexDirection: 'row', border: '1px solid #e5e4e7', borderRadius: '12px', overflow: 'hidden', background: '#fff' },
    children: [
      { type: 'div', style: { position: 'relative', width: '140px', minHeight: '160px', flexShrink: 0, overflow: 'hidden' }, children: [imgNode, badge()] },
      { type: 'div', style: { flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '14px 16px' }, children: [titleNode(), tagList(defaultTagStyle), pricingRow(defaultPriceStyle, defaultOriginalStyle), endTag()] },
    ],
  },
}

/* ------------------------------------------------------------------ */
/*  4 · Premium — dark luxury theme with gold accents                 */
/* ------------------------------------------------------------------ */
const deal4 = {
  id: 'deal4',
  label: 'Deal 4 — Premium',
  page: {
    title: 'Exclusive Collection',
    subtitle: 'Luxury picks curated just for you.',
    style: { background: '#1a1a2e', padding: '24px 16px', borderRadius: '16px', margin: '-20px auto 0' },
    titleStyle: { color: '#d4af37', fontWeight: 300, letterSpacing: '2px', textTransform: 'uppercase' },
    subtitleStyle: { color: 'rgba(212,175,55,0.6)' },
  },
  card: {
    type: 'div',
    style: { border: '1px solid #d4af37', borderRadius: '12px', overflow: 'hidden', background: '#16213e' },
    children: [
      { type: 'div', style: { position: 'relative', aspectRatio: '4/3', overflow: 'hidden' }, children: [
        imgNode,
        badge({ background: '#d4af37', color: '#1a1a2e', fontWeight: 800, borderRadius: '0 0 6px 0', top: '0', left: '0', padding: '6px 14px' }),
      ] },
      { type: 'div', style: { padding: '20px' }, children: [
        titleNode({ color: '#f0e6d3', fontWeight: 300, letterSpacing: '0.5px', fontSize: '18px' }),
        tagList({ fontSize: '10px', fontWeight: 600, padding: '3px 10px', borderRadius: '2px', background: 'transparent', color: '#d4af37', border: '1px solid rgba(212,175,55,0.4)', textTransform: 'uppercase', letterSpacing: '1px' }),
        pricingRow({ fontSize: '24px', fontWeight: 300, color: '#d4af37', letterSpacing: '1px' }, { fontSize: '14px', color: 'rgba(240,230,211,0.4)', textDecoration: 'line-through' }),
        endTag({ color: '#d4af37', background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)' }),
      ] },
    ],
  },
}

/* ------------------------------------------------------------------ */
/*  5 · Story — full-bleed image with gradient overlay text           */
/* ------------------------------------------------------------------ */
const deal5 = {
  id: 'deal5',
  label: 'Deal 5 — Story',
  page: {
    title: 'Featured Stories',
    subtitle: 'Swipe through the hottest deals of the day.',
    style: {},
  },
  card: {
    type: 'div',
    style: { position: 'relative', borderRadius: '20px', overflow: 'hidden', height: '420px' },
    children: [
      imgNode,
      { type: 'div', style: { position: 'absolute', inset: '0', background: 'linear-gradient(0deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.15) 50%, transparent 100%)' } },
      { type: 'span', showIf: 'hasDiscount', bind: 'discount', format: '-{value}%', style: { position: 'absolute', top: '16px', left: '16px', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', color: '#fff', fontSize: '14px', fontWeight: 700, padding: '6px 14px', borderRadius: '20px' } },
      { type: 'div', style: { position: 'absolute', bottom: '0', left: '0', right: '0', padding: '24px' }, children: [
        { type: 'div', style: { display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }, children: [
          { type: 'span', repeat: 'tags', bind: '_item', style: { fontSize: '10px', fontWeight: 700, padding: '3px 10px', borderRadius: '20px', background: 'rgba(255,255,255,0.2)', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.5px' } },
        ] },
        titleNode({ color: '#fff', fontSize: '20px', fontWeight: 700, margin: '0 0 8px' }),
        { type: 'div', style: { display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '8px' }, children: [
          { type: 'span', bind: 'formattedPrice', style: { fontSize: '28px', fontWeight: 700, color: '#fff' } },
          { type: 'span', bind: 'formattedOriginal', style: { fontSize: '16px', color: 'rgba(255,255,255,0.5)', textDecoration: 'line-through' } },
        ] },
        endTag({ color: '#fff', background: 'rgba(255,255,255,0.15)', border: 'none' }),
      ] },
    ],
  },
}

/* ------------------------------------------------------------------ */
/*  6 · Minimal — borderless, typography-focused whitespace           */
/* ------------------------------------------------------------------ */
const deal6 = {
  id: 'deal6',
  label: 'Deal 6 — Minimal',
  page: {
    title: 'Deals',
    subtitle: 'Less noise, better prices.',
    style: {},
    titleStyle: { fontWeight: 300, letterSpacing: '2px', textTransform: 'uppercase', fontSize: '20px' },
    subtitleStyle: { fontStyle: 'italic', opacity: 0.6 },
  },
  card: {
    type: 'div',
    style: { paddingBottom: '32px', borderBottom: '1px solid #e5e4e7' },
    children: [
      { type: 'div', style: { position: 'relative', aspectRatio: '16/9', overflow: 'hidden', borderRadius: '4px', marginBottom: '16px' }, children: [imgNode, badge({ background: '#08060d', borderRadius: '0', top: '0', right: '0', left: 'auto', padding: '4px 12px', fontSize: '12px' })] },
      titleNode({ fontSize: '18px', fontWeight: 400, letterSpacing: '-0.3px', margin: '0 0 6px' }),
      { type: 'div', style: { display: 'flex', gap: '8px', marginBottom: '8px', opacity: 0.5, fontSize: '12px' }, children: [
        { type: 'span', repeat: 'tags', bind: '_item', style: { fontSize: '12px', fontWeight: 400, color: '#6b6375', textTransform: 'lowercase' } },
      ] },
      { type: 'div', style: { display: 'flex', alignItems: 'baseline', gap: '8px' }, children: [
        { type: 'span', bind: 'formattedPrice', style: { fontSize: '20px', fontWeight: 600, color: '#08060d' } },
        { type: 'span', bind: 'formattedOriginal', style: { fontSize: '14px', color: '#ccc', textDecoration: 'line-through' } },
        endTag({ marginLeft: 'auto' }),
      ] },
    ],
  },
}

/* ------------------------------------------------------------------ */
/*  7 · Coupon — tear-off voucher / ticket style                      */
/* ------------------------------------------------------------------ */
const deal7 = {
  id: 'deal7',
  label: 'Deal 7 — Coupon',
  page: {
    title: 'Clip Your Coupons',
    subtitle: 'Exclusive vouchers — save big on every order!',
    style: { background: '#fffbeb', padding: '24px 16px', borderRadius: '16px', margin: '-20px auto 0' },
    titleStyle: { color: '#92400e' },
    subtitleStyle: { color: '#b45309' },
  },
  card: {
    type: 'div',
    style: { display: 'flex', flexDirection: 'row', border: '2px dashed #f59e0b', borderRadius: '12px', overflow: 'hidden', background: '#fff' },
    children: [
      { type: 'div', style: { width: '110px', flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #f59e0b, #d97706)', padding: '16px 8px', textAlign: 'center', gap: '4px' }, children: [
        { type: 'span', showIf: 'hasDiscount', bind: 'discount', format: '{value}%', style: { fontSize: '32px', fontWeight: 800, color: '#fff', lineHeight: '1' } },
        { type: 'span', text: 'OFF', style: { fontSize: '14px', fontWeight: 700, color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', letterSpacing: '2px' } },
      ] },
      { type: 'div', style: { borderLeft: '2px dashed #f59e0b' } },
      { type: 'div', style: { flex: 1, padding: '14px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }, children: [
        titleNode({ fontSize: '15px', margin: '0 0 6px' }),
        tagList({ fontSize: '10px', fontWeight: 600, padding: '2px 6px', borderRadius: '3px', background: '#fffbeb', color: '#b45309', border: '1px solid #fcd34d', textTransform: 'uppercase', letterSpacing: '0.3px' }),
        pricingRow({ fontSize: '20px', fontWeight: 700, color: '#d97706' }, defaultOriginalStyle, '8px', '6px'),
        endTag({ color: '#92400e', background: '#fef3c7' }),
      ] },
    ],
  },
}

/* ------------------------------------------------------------------ */
/*  8 · Neon — dark cyberpunk with glow effects                       */
/* ------------------------------------------------------------------ */
const deal8 = {
  id: 'deal8',
  label: 'Deal 8 — Neon',
  page: {
    title: 'CYBER DEALS',
    subtitle: 'Plug in. Power up. Save big.',
    style: { background: '#0d0d0d', padding: '24px 16px', borderRadius: '16px', margin: '-20px auto 0' },
    titleStyle: { color: '#0ff', textTransform: 'uppercase', letterSpacing: '4px', fontWeight: 300, textShadow: '0 0 20px rgba(0,255,255,0.5)' },
    subtitleStyle: { color: 'rgba(0,255,255,0.5)' },
  },
  card: {
    type: 'div',
    style: { border: '1px solid #0ff', borderRadius: '8px', overflow: 'hidden', background: '#111', boxShadow: '0 0 15px rgba(0,255,255,0.15), inset 0 0 15px rgba(0,255,255,0.05)' },
    children: [
      { type: 'div', style: { position: 'relative', aspectRatio: '16/9', overflow: 'hidden' }, children: [
        imgNode,
        { type: 'div', style: { position: 'absolute', inset: '0', background: 'linear-gradient(180deg, transparent 50%, rgba(0,255,255,0.1) 100%)' } },
        badge({ background: '#0ff', color: '#000', fontWeight: 800, borderRadius: '2px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }),
      ] },
      { type: 'div', style: { padding: '16px', borderTop: '1px solid rgba(0,255,255,0.2)' }, children: [
        titleNode({ color: '#eee', fontWeight: 400, fontSize: '15px', fontFamily: 'monospace' }),
        tagList({ fontSize: '10px', fontWeight: 600, padding: '3px 8px', borderRadius: '2px', background: 'transparent', color: '#0ff', border: '1px solid rgba(0,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '1px', fontFamily: 'monospace' }),
        pricingRow({ fontSize: '24px', fontWeight: 700, color: '#0ff', fontFamily: 'monospace', textShadow: '0 0 10px rgba(0,255,255,0.4)' }, { fontSize: '14px', color: '#555', textDecoration: 'line-through', fontFamily: 'monospace' }),
        endTag({ color: '#f0f', background: 'rgba(255,0,255,0.1)', border: '1px solid rgba(255,0,255,0.3)', fontFamily: 'monospace' }),
      ] },
    ],
  },
}

/* ------------------------------------------------------------------ */
/*  9 · Polaroid — photo-card with white border & caption below       */
/* ------------------------------------------------------------------ */
const deal9 = {
  id: 'deal9',
  label: 'Deal 9 — Polaroid',
  page: {
    title: 'Snap Deals',
    subtitle: 'Picture-perfect prices, captured just for you.',
    style: { background: '#f5f0eb', padding: '24px 16px', borderRadius: '16px', margin: '-20px auto 0' },
    titleStyle: { fontFamily: 'Georgia, serif', fontWeight: 400, fontStyle: 'italic' },
    subtitleStyle: { fontFamily: 'Georgia, serif', fontStyle: 'italic', opacity: 0.6 },
  },
  card: {
    type: 'div',
    style: { background: '#fff', padding: '16px 16px 20px', borderRadius: '4px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', transform: 'rotate(-1deg)' },
    children: [
      { type: 'div', style: { position: 'relative', aspectRatio: '1', overflow: 'hidden', marginBottom: '16px' }, children: [imgNode, badge({ borderRadius: '50px', padding: '4px 12px' })] },
      titleNode({ fontFamily: 'Georgia, serif', fontWeight: 400, fontStyle: 'italic', fontSize: '17px', margin: '0 0 8px' }),
      { type: 'div', style: { display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }, children: [
        { type: 'span', repeat: 'tags', bind: '_item', style: { fontSize: '11px', fontWeight: 500, padding: '2px 8px', borderRadius: '20px', background: '#f5f0eb', color: '#8b7355', fontFamily: 'Georgia, serif' } },
      ] },
      { type: 'div', style: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }, children: [
        { type: 'div', style: { display: 'flex', alignItems: 'baseline', gap: '8px' }, children: [
          { type: 'span', bind: 'formattedPrice', style: { fontSize: '22px', fontWeight: 600, color: '#8b7355' } },
          { type: 'span', bind: 'formattedOriginal', style: { fontSize: '13px', color: '#ccc', textDecoration: 'line-through' } },
        ] },
        endTag({ color: '#8b7355', background: '#f5f0eb', fontFamily: 'Georgia, serif', fontStyle: 'italic' }),
      ] },
    ],
  },
}

/* ------------------------------------------------------------------ */
/*  10 · Banner — full-width hero card with CTA bar                   */
/* ------------------------------------------------------------------ */
const deal10 = {
  id: 'deal10',
  label: 'Deal 10 — Banner',
  page: {
    title: 'Top Picks',
    subtitle: 'Handpicked by our team. Big cards, big savings.',
    style: {},
    titleStyle: { fontSize: '28px', fontWeight: 800 },
  },
  card: {
    type: 'div',
    style: { borderRadius: '16px', overflow: 'hidden', background: '#fff', boxShadow: '0 2px 20px rgba(0,0,0,0.08)' },
    children: [
      { type: 'div', style: { position: 'relative', height: '220px', overflow: 'hidden' }, children: [
        imgNode,
        { type: 'div', style: { position: 'absolute', inset: '0', background: 'linear-gradient(135deg, rgba(170,59,255,0.7) 0%, rgba(59,130,246,0.5) 100%)' } },
        { type: 'div', style: { position: 'absolute', top: '20px', left: '20px', right: '20px' }, children: [
          { type: 'div', style: { display: 'flex', gap: '6px', marginBottom: '12px' }, children: [
            { type: 'span', repeat: 'tags', bind: '_item', style: { fontSize: '11px', fontWeight: 700, padding: '4px 12px', borderRadius: '20px', background: 'rgba(255,255,255,0.25)', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.5px' } },
          ] },
          titleNode({ color: '#fff', fontSize: '22px', fontWeight: 700, margin: '0', textShadow: '0 1px 4px rgba(0,0,0,0.2)' }),
        ] },
        { type: 'span', showIf: 'hasDiscount', bind: 'discount', format: '-{value}%', style: { position: 'absolute', bottom: '16px', right: '16px', background: '#fff', color: '#aa3bff', fontSize: '18px', fontWeight: 800, padding: '8px 16px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' } },
      ] },
      { type: 'div', style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', background: '#fafafa', borderTop: '1px solid #eee' }, children: [
        { type: 'div', style: { display: 'flex', alignItems: 'baseline', gap: '10px' }, children: [
          { type: 'span', bind: 'formattedPrice', style: { fontSize: '26px', fontWeight: 800, color: '#aa3bff' } },
          { type: 'span', bind: 'formattedOriginal', style: { fontSize: '15px', color: '#bbb', textDecoration: 'line-through' } },
        ] },
        { type: 'div', style: { display: 'flex', alignItems: 'center', gap: '12px' }, children: [
          endTag({ color: '#aa3bff', background: 'rgba(170,59,255,0.08)' }),
          { type: 'button', text: 'Shop Now', style: { background: '#aa3bff', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' } },
        ] },
      ] },
    ],
  },
}

export const schemas = [deal1, deal2, deal3, deal4, deal5, deal6, deal7, deal8, deal9, deal10]
