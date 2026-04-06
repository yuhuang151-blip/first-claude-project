import { useState } from 'react'
import Blog from './pages/Blog'
import About from './pages/About'
import Contact from './pages/Contact'
import BlogPost from './pages/BlogPost'
import Landing from './pages/Landing'
import Admin from './pages/Admin'
import './App.css'

function App() {
  const [page, setPage] = useState('blog')
  const [postId, setPostId] = useState(null)

  const openPost = (id) => { setPostId(id); setPage('post') }
  const backToBlog = () => { setPostId(null); setPage('blog') }

  return (
    <div className="blog">
      <header className="header">
        <h1 className="logo">Yu Huang</h1>
        <nav className="nav">
          <a href="#" className={`nav-link ${page === 'blog' || page === 'post' ? 'active' : ''}`} onClick={e => { e.preventDefault(); backToBlog() }}>Blog</a>
          <a href="#" className={`nav-link ${page === 'about' ? 'active' : ''}`} onClick={e => { e.preventDefault(); setPage('about') }}>About</a>
          <a href="#" className={`nav-link ${page === 'contact' ? 'active' : ''}`} onClick={e => { e.preventDefault(); setPage('contact') }}>Contact</a>
          <a href="#" className={`nav-link ${page === 'landing' ? 'active' : ''}`} onClick={e => { e.preventDefault(); setPage('landing') }}>Deals</a>
          <a href="#" className={`nav-link ${page === 'admin' ? 'active' : ''}`} onClick={e => { e.preventDefault(); setPage('admin') }}>Admin</a>
        </nav>
      </header>

      <main className="main">
        {page === 'blog' && <Blog onPostClick={openPost} />}
        {page === 'post' && <BlogPost postId={postId} onBack={backToBlog} />}
        {page === 'about' && <About />}
        {page === 'contact' && <Contact />}
        {page === 'landing' && <Landing />}
        {page === 'admin' && <Admin />}
      </main>

      <footer className="footer">
        <p>&copy; 2026 Yu Huang. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default App
