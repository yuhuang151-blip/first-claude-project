import { useState, useEffect } from 'react'
import './App.css'

const API_BASE = '/api'

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
  const [posts, setPosts] = useState([])
  const [photos, setPhotos] = useState([])

  useEffect(() => {
    fetch(`${API_BASE}/posts`).then(r => r.json()).then(setPosts)
    fetch(`${API_BASE}/photos`).then(r => r.json()).then(setPhotos)
  }, [])

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
