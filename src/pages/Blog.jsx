import { useState, useEffect } from 'react'
import Gallery from '../components/Gallery'

const API_BASE = '/api'

export default function Blog({ onPostClick }) {
  const [posts, setPosts] = useState([])
  const [photos, setPhotos] = useState([])

  useEffect(() => {
    fetch(`${API_BASE}/posts`).then(r => r.json()).then(setPosts)
    fetch(`${API_BASE}/photos`).then(r => r.json()).then(setPhotos)
  }, [])

  return (
    <>
      <Gallery photos={photos} />

      <section className="intro">
        <p>Developer & writer. I share thoughts on code, design, and simplicity.</p>
      </section>

      <section className="posts">
        {posts.map(post => (
          <article key={post.id} className="post" onClick={() => onPostClick(post.id)} style={{ cursor: 'pointer' }}>
            <div className="post-meta">
              <time>{post.date}</time>
              <span className="tag">{post.tag}</span>
            </div>
            <h2 className="post-title">{post.title}</h2>
            <p className="post-summary">{post.summary}</p>
          </article>
        ))}
      </section>
    </>
  )
}
