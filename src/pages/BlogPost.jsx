import { useState, useEffect } from 'react'

const API_BASE = '/api'

export default function BlogPost({ postId, onBack }) {
  const [post, setPost] = useState(null)

  useEffect(() => {
    fetch(`${API_BASE}/posts/${postId}`)
      .then(r => r.json())
      .then(setPost)
  }, [postId])

  if (!post) return <p>Loading...</p>

  return (
    <article className="blog-post">
      <button className="back-link" onClick={onBack}>&larr; Back to posts</button>
      <header className="blog-post-header">
        <span className="tag">{post.tag}</span>
        <h1 className="blog-post-title">{post.title}</h1>
        <div className="blog-post-meta">
          <span>{post.author}</span>
          <time>Published {post.date}</time>
          <time>Updated {post.lastModified}</time>
        </div>
      </header>
      <div className="blog-post-content">
        {post.content.split('\n\n').map((block, i) => {
          if (block.startsWith('## ')) {
            return <h2 key={i}>{block.replace('## ', '')}</h2>
          }
          if (block.includes('\n')) {
            return (
              <div key={i}>
                {block.split('\n').map((line, j) => {
                  const bold = line.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
                  if (/^\d+\.\s/.test(line)) {
                    return <p key={j} className="list-item" dangerouslySetInnerHTML={{ __html: bold }} />
                  }
                  if (line.startsWith('- ')) {
                    return <p key={j} className="list-item" dangerouslySetInnerHTML={{ __html: '• ' + bold.slice(2) }} />
                  }
                  return <p key={j} dangerouslySetInnerHTML={{ __html: bold }} />
                })}
              </div>
            )
          }
          const bold = block.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
          return <p key={i} dangerouslySetInnerHTML={{ __html: bold }} />
        })}
      </div>
    </article>
  )
}
