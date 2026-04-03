import { useState, useEffect } from 'react'
import './App.css'

const photos = [
  {
    id: 1,
    src: 'https://picsum.photos/seed/a1/400/300',
    caption: 'Morning light',
  },
  {
    id: 2,
    src: 'https://picsum.photos/seed/b2/400/300',
    caption: 'City walk',
  },
  {
    id: 3,
    src: 'https://picsum.photos/seed/c3/400/300',
    caption: 'Quiet corner',
  },
  {
    id: 4,
    src: 'https://picsum.photos/seed/d4/400/300',
    caption: 'Weekend escape',
  },
  {
    id: 5,
    src: 'https://picsum.photos/seed/e5/400/300',
    caption: 'Sunset view',
  },
  {
    id: 6,
    src: 'https://picsum.photos/seed/f6/400/300',
    caption: 'Coffee time',
  },
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

function Carousel({ photos }) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(i => (i + 1) % photos.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [photos.length])

  const prev = () => setCurrent(i => (i - 1 + photos.length) % photos.length)
  const next = () => setCurrent(i => (i + 1) % photos.length)

  return (
    <section className="gallery">
      <h2 className="section-title">Gallery</h2>
      <div className="carousel">
        <button className="carousel-btn prev" onClick={prev}>&lsaquo;</button>
        <div className="carousel-track">
          {photos.map((photo, index) => (
            <figure
              key={photo.id}
              className={`carousel-slide ${index === current ? 'active' : ''}`}
            >
              <img src={photo.src} alt={photo.caption} />
              <figcaption>{photo.caption}</figcaption>
            </figure>
          ))}
        </div>
        <button className="carousel-btn next" onClick={next}>&rsaquo;</button>
      </div>
      <div className="carousel-dots">
        {photos.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === current ? 'active' : ''}`}
            onClick={() => setCurrent(index)}
          />
        ))}
      </div>
    </section>
  )
}

function App() {
  return (
    <div className="blog">
      <header className="header">
        <h1 className="logo">Yu Huang</h1>
        <nav className="nav">
          <a href="#" className="nav-link active">Blog</a>
          <a href="#" className="nav-link">About</a>
          <a href="#" className="nav-link">Contact</a>
        </nav>
      </header>

      <main className="main">
        <section className="intro">
          <p>Developer & writer. I share thoughts on code, design, and simplicity.</p>
        </section>

        <section className="posts">
          {posts.map(post => (
            <article key={post.id} className="post">
              <div className="post-meta">
                <time>{post.date}</time>
                <span className="tag">{post.tag}</span>
              </div>
              <h2 className="post-title">{post.title}</h2>
              <p className="post-summary">{post.summary}</p>
            </article>
          ))}
        </section>

        <Carousel photos={photos} />
      </main>

      <footer className="footer">
        <p>&copy; 2026 Yu Huang. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default App
