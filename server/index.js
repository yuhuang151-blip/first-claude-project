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
    summary: 'How I built this blog from scratch using React and Vite, keeping things as simple as possible.',
    tag: 'Dev',
  },
  {
    id: 2,
    title: 'On Simplicity in Design',
    date: '2026-03-20',
    summary: 'Less is more. A reflection on why minimalism leads to better user experiences.',
    tag: 'Design',
  },
  {
    id: 3,
    title: 'Tools I Use Every Day',
    date: '2026-03-10',
    summary: 'A curated list of tools that help me stay productive without the clutter.',
    tag: 'Productivity',
  },
]

app.get('/api/posts', (req, res) => {
  res.json(posts)
})

app.get('/api/photos', (req, res) => {
  res.json(photos)
})


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
