import { useState, useEffect } from 'react'

export default function Carousel({ photos }) {
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
