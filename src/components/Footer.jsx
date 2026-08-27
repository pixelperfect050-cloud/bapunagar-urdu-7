import { BookOpen, MapPin, Phone, Mail } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-brand">
          <div className="footer-logo">
            <BookOpen className="logo-icon" size={28} />
            <h2>Bapunagar Urdu 7</h2>
          </div>
          <p className="footer-description">
            Dedicated to providing excellent education and fostering a nurturing environment for our students.
          </p>
        </div>

        <div className="footer-links">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/gallery">Gallery</a></li>
            <li><a href="/videos">Videos</a></li>
          </ul>
        </div>

        <div className="footer-contact" id="contact">
          <h3>Contact Us</h3>
          <ul>
            <li>
              <MapPin size={18} className="contact-icon" />
              <span>Rakhiyal, Ahmedabad, Gujarat 380024</span>
            </li>
            <li>
              <Phone size={18} className="contact-icon" />
              <span>+91 XXXXX XXXXX</span>
            </li>
            <li>
              <Mail size={18} className="contact-icon" />
              <span>info@bapunagarurdu7.edu</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {currentYear} Bapunagar Urdu 7 School. All rights reserved.</p>
      </div>
    </footer>
  );
}
