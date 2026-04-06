import express from 'express'
import cors from 'cors'

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

const photos = [
  { id: 1, src: 'https://picsum.photos/seed/a1/400/300', caption: 'Morning light' },
  { id: 2, src: 'https://picsum.photos/seed/b2/400/300', caption: 'City walk' },
  { id: 3, src: 'https://picsum.photos/seed/c3/400/300', caption: 'Quiet corner' },
  { id: 4, src: 'https://picsum.photos/seed/d4/400/300', caption: 'Weekend escape' },
  { id: 5, src: 'https://picsum.photos/seed/e5/400/300', caption: 'Sunset view' },
  { id: 6, src: 'https://picsum.photos/seed/f6/400/300', caption: 'Coffee time' },
]

const posts = [
  {
    id: 1,
    title: 'Building a Minimal Blog with React',
    date: '2026-04-01',
    lastModified: '2026-04-03',
    author: 'Yu Huang',
    summary: 'How I built this blog from scratch using React and Vite, keeping things as simple as possible.',
    tag: 'Dev',
    content: `When I set out to build my personal blog, I wanted something dead simple — no CMS, no heavy framework, just React and Vite.

## Why Vite?

Vite offers lightning-fast HMR and a clean dev experience out of the box. No webpack config headaches, no waiting around for builds. It just works.

## The Stack

- **React** for the UI
- **Express** for the API layer
- **Vite** for bundling and dev server

## Lessons Learned

The biggest takeaway was that you don't need much to build something functional and beautiful. A few components, some clean CSS, and a simple API — that's really all it takes.

Keep it minimal. Ship it. Iterate later.`,
  },
  {
    id: 2,
    title: 'On Simplicity in Design',
    date: '2026-03-20',
    lastModified: '2026-03-22',
    author: 'Yu Huang',
    summary: 'Less is more. A reflection on why minimalism leads to better user experiences.',
    tag: 'Design',
    content: `Simplicity is not the absence of complexity — it's the result of mastering it. Every great design feels obvious in hindsight, but getting there takes deliberate effort.

## The Paradox of Choice

When users are overwhelmed with options, they choose nothing. Reducing choices isn't limiting — it's liberating.

## White Space is Not Wasted Space

Breathing room lets content speak. Cramming every pixel with information creates noise, not value.

## My Design Principles

1. **Clarity over cleverness** — if a user has to think about how to use it, it's too complex.
2. **Consistency builds trust** — patterns should be predictable.
3. **Every element must earn its place** — if it doesn't serve the user, remove it.

Good design disappears. The user just accomplishes what they came to do.`,
  },
  {
    id: 3,
    title: 'Tools I Use Every Day',
    date: '2026-03-10',
    lastModified: '2026-03-15',
    author: 'Yu Huang',
    summary: 'A curated list of tools that help me stay productive without the clutter.',
    tag: 'Productivity',
    content: `I'm picky about my tools. If something adds friction, it's gone. Here's what survived the cut.

## Editor

**VS Code** with a minimal extension set. I use the Vim keybindings extension and a clean theme. No distractions.

## Terminal

**Windows Terminal** with bash. Simple prompt, fast startup. I keep aliases for common git and npm commands.

## Notes

**Obsidian** for everything. Markdown-based, local-first, and blazing fast. I use it for project notes, daily logs, and drafting blog posts like this one.

## Browser

**Arc** — the tab management alone is worth the switch. Spaces keep work and personal browsing completely separate.

## The Rule

If a tool requires more configuration than the problem it solves, I don't use it. Simplicity wins, every time.`,
  },
]

app.get('/api/posts', (req, res) => {
  const list = posts.map(({ content, ...rest }) => rest)
  res.json(list)
})

app.get('/api/posts/:id', (req, res) => {
  const post = posts.find(p => p.id === Number(req.params.id))
  if (!post) return res.status(404).json({ error: 'Post not found' })
  res.json(post)
})

app.get('/api/photos', (req, res) => {
  res.json(photos)
})


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
