export default function About() {
  return (
    <section className="about">
      <div className="about-photo">
        <img src="https://picsum.photos/seed/avatar/300/300" alt="Yu Huang" />
      </div>
      <h2 className="about-name">Yu Huang</h2>
      <p className="about-bio">
        Developer & writer. I build things for the web and share thoughts on code, design, and simplicity.
      </p>
      <div className="about-contact">
        <h3 className="about-section-title">Contact</h3>
        <ul className="about-list">
          <li>
            <span className="about-label">Email</span>
            <a href="mailto:yuhuang@example.com">yuhuang@example.com</a>
          </li>
          <li>
            <span className="about-label">Phone</span>
            <a href="tel:+1234567890">+1 (234) 567-890</a>
          </li>
          <li>
            <span className="about-label">Address</span>
            <span>123 Main Street, San Francisco, CA 94102</span>
          </li>
        </ul>
      </div>
    </section>
  )
}
