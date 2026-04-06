export default function Gallery({ photos }) {
  return (
    <section className="gallery">
      <h2 className="section-title">Gallery</h2>
      <div className="feed-grid">
        {photos.map(photo => (
          <figure key={photo.id} className={`feed-item feed-${photo.span || 'normal'}`}>
            <img src={photo.src} alt={photo.caption} />
            <figcaption>{photo.caption}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
