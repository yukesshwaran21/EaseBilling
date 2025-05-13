import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaFileInvoiceDollar, FaBoxes, FaUsersCog, FaChartLine } from 'react-icons/fa';
import './Homepage.css';

const Homepage = () => {
  const navigate = useNavigate();

 
const features = [
  {
    icon: <FaFileInvoiceDollar size={40} color="#ef4444" />,
    title: 'Invoice Generation',
    description: 'Generate and manage invoices for electricity services or usage, including payment tracking.',
  },
  {
    icon: <FaBoxes size={40} color="#14b8a6" />,
    title: 'Inventory Management',
    description: 'Track and manage electrical equipment, meters, and parts efficiently.',
  },
  {
    icon: <FaUsersCog size={40} color="#ef4444" />,
    title: 'Worker Management',
    description: 'Assign tasks, monitor performance, and manage your labor team effectively.',
  },
  {
    icon: <FaChartLine size={40} color="#14b8a6" />,
    title: 'Sales Overview',
    description: 'Analyze total sales, revenue trends, and invoice data with visual charts and reports.',
  },
];



  return (
    <div className="homepage-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">⚡ Electro Bill</div>
        <button className="signup-button" onClick={() => navigate('/login')}>
          LOGIN 
        </button>
      </nav>

      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="hero-section">
          <h1 className="hero-title">
            Take Control of Your <span className="highlight">Electricity</span> Bills
          </h1>
          <p className="hero-subtitle">
           <b> Smart. Efficient. User-Friendly. Manage your electricity effortlessly from anywhere.</b>
          </p>
        </div>

        {/* Features Section */}
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="flex flex-col items-center text-center">
                {feature.icon}
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action Section */}
        <div className="cta-section">
          <h2 className="cta-title">Join Electro Bill Today</h2>
          <p className="cta-description">
            Experience a smarter way to monitor and pay for electricity.
          </p>
          <button className="secondary-button" onClick={() => navigate('/login')}>
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
