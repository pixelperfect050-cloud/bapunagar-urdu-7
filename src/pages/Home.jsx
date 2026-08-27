import { Link } from 'react-router-dom';
import { ArrowRight, Image as ImageIcon, PlayCircle, Book, Monitor, Building, Droplets, Zap, Accessibility, Activity } from 'lucide-react';
import './Home.css';

export default function Home() {
  return (
    <div className="home fade-in">
      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-content">
          <h1>Welcome to Bapunagar Urdu 7</h1>
          <p>Nurturing minds, building character, and shaping the future of our students with excellence in education.</p>
          <div className="hero-buttons">
            <Link to="/gallery" className="btn btn-primary">
              View Gallery <ArrowRight size={18} style={{ marginLeft: '8px' }} />
            </Link>
            <a href="#about" className="btn btn-accent">
              Discover More
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section about-section">
        <div className="container">
          <div className="about-grid">
            <div className="about-text">
              <h2 className="section-title" style={{ textAlign: 'left' }}>About Our School</h2>
              <p>
                Established in 1972, Bapunagar Urdu 7 is a premier Co-educational Upper Primary School (Grades 6 to 8) located in Rakhiyal, Ahmedabad. 
                With a rich heritage of providing quality education through the Urdu medium, our dedicated faculty works tirelessly to ensure 
                that every student reaches their full potential in a safe and engaging environment.
              </p>
              <p>
                Under the guidance of our Head Teacher, Ms. Noorjahan Banu M. Shaikh, and our experienced staff of 21 teachers, we focus on academic excellence, 
                cultural values, and empowering our students to become responsible leaders of tomorrow.
              </p>
            </div>
            <div className="about-features">
              <div className="feature-card">
                <ImageIcon size={32} className="feature-icon" />
                <h3>Vibrant Activities</h3>
                <p>Explore our latest events and student activities in the photo gallery.</p>
                <Link to="/gallery" className="feature-link">View Photos</Link>
              </div>
              <div className="feature-card">
                <PlayCircle size={32} className="feature-icon" />
                <h3>Video Highlights</h3>
                <p>Watch educational content and event highlights on our YouTube channel.</p>
                <Link to="/videos" className="feature-link">Watch Videos</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Facilities Section */}
      <section className="section facilities-section">
        <div className="container">
          <h2 className="section-title">Our Facilities</h2>
          <div className="facilities-grid">
            <div className="facility-card">
              <Building className="facility-icon" size={28} />
              <h4>Modern Classrooms</h4>
              <p>12 well-maintained classrooms providing a great learning environment.</p>
            </div>
            <div className="facility-card">
              <Monitor className="facility-icon" size={28} />
              <h4>Computer Lab</h4>
              <p>A dedicated computer-aided learning lab with 15 functional computers.</p>
            </div>
            <div className="facility-card">
              <Book className="facility-icon" size={28} />
              <h4>Rich Library</h4>
              <p>An extensive collection of over 1200 books to foster a love for reading.</p>
            </div>
            <div className="facility-card">
              <Activity className="facility-icon" size={28} />
              <h4>Playground</h4>
              <p>A spacious playground for sports, physical education, and recreation.</p>
            </div>
            <div className="facility-card">
              <Droplets className="facility-icon" size={28} />
              <h4>Clean Drinking Water</h4>
              <p>Reliable tap water facility for all students.</p>
            </div>
            <div className="facility-card">
              <Accessibility className="facility-icon" size={28} />
              <h4>Accessible Campus</h4>
              <p>Campus equipped with ramps for disabled children and proper electrification.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
