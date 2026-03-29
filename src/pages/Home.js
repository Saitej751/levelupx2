import { useNavigate } from "react-router-dom";
import "../App.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home">

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="logo">
          LevelUp<span>X</span>
        </div>

        <ul className="nav-links">
          <li>Features</li>
          <li>Solutions</li>
          <li>About</li>
          <li>Blog</li>
          <li>Contact</li>
        </ul>

        <button 
          className="nav-btn"
          onClick={() => navigate("/enterprise")}
        >
          MEET OUR ENTERPRISE
        </button>
      </nav>

      {/* WHY SECTION */}

<section className="why-section">

  <h2>Why LevelUpX Campus?</h2>

  <p className="why-subtitle">
    A complete AI-powered lab ecosystem designed for modern educational institutions.
  </p>

  <div className="why-cards">

    <div className="why-card">
      <h3>AI Lab Platform</h3>
      <p>
        Multi-level structured lab system for hands-on AI learning with real-time faculty monitoring.
      </p>
    </div>

    <div className="why-card">
      <h3>Role-Based Access</h3>
      <p>
        Separate dashboards for Admin, Faculty, and Students with secure authentication and permissions.
      </p>
    </div>

    <div className="why-card">
      <h3>Evaluation</h3>
      <p>
        Internal and external exams with secure environment, timers, and automated evaluation support.
      </p>
    </div>

    <div className="why-card">
      <h3>Outcome Analytics</h3>
      <p>
        Track student progress, lab completion, and semester-wise performance insights.
      </p>
    </div>

    <div className="why-card">
      <h3>Enterprise Ready</h3>
      <p>
        Designed for universities and institutions seeking a complete AI lab ecosystem.
      </p>
    </div>

  </div>

</section>

      {/* HERO SECTION */}
      <section className="hero-section">

        <div className="hero-left">
          <h1>
            Level up your campus <br />
            with our AI <span className="highlight">Lab platform</span>
          </h1>

          <p>
            Empower your students and faculty with advanced AI tools and
            hands-on lab experiences driven by innovative technology.
          </p>

          <button
            className="primary-btn"
            onClick={() => navigate("/enterprise")}
          >
            MEET OUR ENTERPRISE
          </button>
        </div>

        <div className="hero-right">
          <img src="/hero-image.png" alt="LevelUpX Dashboard" />
        </div>

      </section>

    </div>
  );
}

export default Home;