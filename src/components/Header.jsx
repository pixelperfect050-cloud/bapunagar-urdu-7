import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Menu, X } from 'lucide-react';
import { useState } from 'react';
import './Header.css';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Videos', path: '/videos' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="header">
      <div className="container header-container">
        <Link to="/" className="logo-section">
          <BookOpen className="logo-icon" size={32} />
          <div className="logo-text">
            <h1>Bapunagar Urdu 7</h1>
            <span>Excellence in Education</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          {navLinks.map(link => (
            <Link 
              key={link.path} 
              to={link.path} 
              className={`nav-link ${isActive(link.path) ? 'active' : ''}`}
            >
              {link.name}
            </Link>
          ))}
          <a href="#contact" className="btn btn-accent contact-btn">Contact Us</a>
        </nav>

        {/* Mobile Menu Toggle */}
        <button 
          className="mobile-menu-btn"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="mobile-nav">
          {navLinks.map(link => (
            <Link 
              key={link.path} 
              to={link.path} 
              className={`mobile-nav-link ${isActive(link.path) ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <a href="#contact" className="btn btn-accent mobile-contact-btn" onClick={() => setIsMenuOpen(false)}>
            Contact Us
          </a>
        </div>
      )}
    </header>
  );
}
