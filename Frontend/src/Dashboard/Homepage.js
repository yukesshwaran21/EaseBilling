import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Homepage.css';
// import axios from 'axios';
import {
  FaFileInvoiceDollar,
  FaBoxes,
  FaUsersCog,
  FaChartLine,
  FaBolt,
  FaShieldAlt,
  FaMobile,
  FaClock,
  FaUsers,
  FaStar,
  FaArrowRight,
  FaCheckCircle,
  FaQuoteLeft,
  FaChevronUp,
  FaChevronDown,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaRocket
} from 'react-icons/fa';
function Homepage() {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);

  const testimonials = [
    {
      name: "Amit Patel",
      role: "Operations Manager",
      company: "Bright Electricals",
      image: "/images/testimonial3.jpg",
      rating: 5,
      text: "Managing electrical item stock levels and generating bills for electrical services is now seamless. Highly recommended for electrical businesses."
    }
  ];

  // Real-time clock update
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch real data on component mount
  useEffect(() => {
    // fetchRealData();
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const testimonialTimer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(testimonialTimer);
  }, [testimonials.length]);

  // ...existing code...

  const faqData = [
    {
      question: "How do I add electrical items to my inventory?",
      answer: "You can easily add electrical components, wires, switches, and equipment through our inventory management system. Simply enter the item details, specifications, and pricing information."
    },
    {
      question: "Does EaseBilling handle GST calculations for electrical goods?",
      answer: "Yes! Our system automatically calculates GST for electrical equipment and services based on the latest tax rates and regulations."
    },
    {
      question: "Can I generate invoices for electrical installations?",
      answer: "Absolutely. Create professional invoices for electrical services, equipment sales, and installations with itemized billing and automatic total calculations."
    },
    {
      question: "How does the inventory tracking work?",
      answer: "Track stock levels in real-time, get low stock alerts, and manage supplier information for all your electrical components and equipment."
    },
    {
      question: "Is my electrical business data secure?",
      answer: "Yes, we use bank-grade encryption and secure cloud storage to protect your business data, customer information, and financial records."
    }
  ];

  const features = [
    {
      icon: <FaFileInvoiceDollar size={48} />,
      title: 'Electrical Invoice Generation',
      description: 'Generate professional invoices for electrical services, installations, and equipment sales with automated calculations and GST compliance.',
      gradient: 'from-blue-500 to-purple-600',
      bgGradient: 'from-blue-50 to-purple-50'
    },
    {
      icon: <FaBoxes size={48} />,
      title: 'Electrical Inventory Management',
      description: 'Track electrical components, wires, switches, meters, and parts with real-time stock monitoring and automated reorder alerts.',
      gradient: 'from-emerald-500 to-teal-600',
      bgGradient: 'from-emerald-50 to-teal-50'
    },
    {
      icon: <FaUsersCog size={48} />,
      title: 'Customer & Supplier Management',
      description: 'Manage customer details, payment tracking, and supplier information for electrical equipment and services.',
      gradient: 'from-purple-500 to-pink-600',
      bgGradient: 'from-purple-50 to-pink-50'
    },
    {
      icon: <FaChartLine size={48} />,
      title: 'Business Analytics',
      description: 'Monitor sales performance, profit margins, and inventory turnover with detailed reports for your electrical business.',
      gradient: 'from-orange-500 to-red-600',
      bgGradient: 'from-orange-50 to-red-50'
    },
  ];

  const benefits = [
    {
      icon: <FaBolt size={32} />,
      title: 'GST Compliant',
      description: 'Automatic GST calculations for electrical goods and services'
    },
    {
      icon: <FaShieldAlt size={32} />,
      title: 'Secure & Reliable',
      description: 'Bank-grade security for your business data'
    },
    {
      icon: <FaMobile size={32} />,
      title: 'Mobile Access',
      description: 'Manage your business from anywhere'
    },
    {
      icon: <FaClock size={32} />,
      title: '24/7 Support',
      description: 'Round-the-clock technical assistance'
    }
  ];

  const stats = [
    { 
      icon: <FaUsers />, 
      number: '100+', 
      label: 'Active Users' 
    },
    { 
      icon: <FaFileInvoiceDollar />, 
      number: '10,000+', 
      label: 'Invoices Generated' 
    },
    { 
      icon: <FaStar />, 
      number: '4.9/5', 
      label: 'User Rating' 
    },
    { 
      icon: <FaClock />, 
      number: '24/7', 
      label: 'Support Available' 
    }
  ];

  return (
    <div className="homepage-container">
      {/* Enhanced Navbar */}
      <nav className="navbar">
        <div className="navbar-content">
          <div className="logo-container">
            <div className="logo">
              ⚡ EaseBilling
              <span className="live-indicator">
                <span className="pulse-dot"></span>
                LIVE
              </span>
            </div>
            <div className="real-time-clock">
              {currentTime.toLocaleTimeString()}
            </div>
          </div>
          
          <div className="nav-actions">
            <div className="nav-links">
              <a href="#features" className="nav-link">Features</a>
              <a href="#benefits" className="nav-link">Benefits</a>
              <a href="#stats" className="nav-link">Stats</a>
            </div>
            <button className="signup-button" onClick={() => navigate('/login')}>
              LOGIN 
              <FaArrowRight className="button-icon" />
            </button>
          </div>
        </div>
      </nav>

      <div className="container">
        {/* Enhanced Hero Section */}
        <div className="hero-section" id="hero">
          <div className="hero-background"></div>
          <div className="hero-content">
            <div className="hero-badge">
              <FaCheckCircle className="badge-icon" />
              Trusted by 100+ businesses • 10,000+ invoices generated
            </div>
            
            <h1 className="hero-title">
              Revolutionize Your <span className="highlight">Electrical Business</span> 
              <br />with Smart Billing Solutions
            </h1>
            
            <p className="hero-subtitle">
              Streamline your electrical business with automated invoicing, inventory management, 
              and GST compliance for electrical contractors and suppliers.
            </p>

            <div className="hero-actions">
              <button className="primary-cta-button" onClick={() => navigate('/login')}>
                Get Started Free
                <FaArrowRight className="button-icon" />
              </button>
              <button className="secondary-cta-button">
                Watch Demo
              </button>
            </div>

            <div className="hero-features">
              <div className="hero-feature">
                <FaCheckCircle className="check-icon" />
                <span>No setup fees</span>
              </div>
              <div className="hero-feature">
                <FaCheckCircle className="check-icon" />
                <span>14-day free trial</span>
              </div>
              <div className="hero-feature">
                <FaCheckCircle className="check-icon" />
                <span>24/7 support</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="stats-section" id="stats">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Features Section */}
        <div className="features-section" id="features">
          <div className="section-header">
            <h2 className="section-title">Essential Features for Electrical Businesses</h2>
            <p className="section-subtitle">
              Everything you need to manage electrical invoicing and inventory efficiently
            </p>
          </div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className={`feature-card bg-gradient-to-br ${feature.bgGradient}`}>
                <div className="feature-content">
                  <div className={`feature-icon bg-gradient-to-r ${feature.gradient}`}>
                    {feature.icon}
                  </div>
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                  <div className="feature-link">
                    Learn more <FaArrowRight />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="benefits-section" id="benefits">
          <div className="section-header">
            <h2 className="section-title">Why Choose EaseBilling for Electrical Business?</h2>
            <p className="section-subtitle">
              Designed specifically for electrical contractors, suppliers, and service providers
            </p>
          </div>

          <div className="benefits-grid">
            {benefits.map((benefit, index) => (
              <div key={index} className="benefit-card">
                <div className="benefit-icon">{benefit.icon}</div>
                <h3 className="benefit-title">{benefit.title}</h3>
                <p className="benefit-description">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced CTA Section */}
        <div className="cta-section">
          <div className="cta-background"></div>
          <div className="cta-content">
            <h2 className="cta-title">Ready to Transform Your Business?</h2>
            <p className="cta-description">
              Join thousands of electrical businesses already using EaseBilling to streamline 
              their operations and increase profitability.
            </p>
            
            <div className="cta-actions">
              <button className="primary-cta-button" onClick={() => navigate('/login')}>
                Start Free Trial
                <FaArrowRight className="button-icon" />
              </button>
              <button className="secondary-cta-button">
                Schedule Demo
              </button>
            </div>

            <div className="cta-guarantee">
              <FaShieldAlt className="guarantee-icon" />
              <span>30-day money-back guarantee • No long-term contracts</span>
            </div>
          </div>
        </div>

        {/* Real Business Insights Section */}
        <div className="insights-section" id="insights">
          <div className="section-header">
            <h2 className="section-title">Real-Time Electrical Business Insights</h2>
            <p className="section-subtitle">
              Live data from electrical contractors and suppliers using our platform
            </p>
          </div>

          {/* Real-Time Insights and Recent Activity sections removed as requested */}
        </div>

        {/* Testimonials Section */}
        <div className="testimonials-section" id="testimonials">
          <div className="section-header">
            <h2 className="section-title">What Electrical Professionals Say</h2>
            <p className="section-subtitle">
              Real feedback from electrical contractors and suppliers using EaseBilling
            </p>
          </div>

          <div className="testimonials-container">
            <div className="testimonial-card active">
              <div className="testimonial-content">
                <FaQuoteLeft className="quote-icon" />
                <p className="testimonial-text">{testimonials[currentTestimonial].text}</p>
                <div className="testimonial-rating">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <FaStar key={i} className="star-icon" />
                  ))}
                </div>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">
                  <FaUsers />
                </div>
                <div className="author-info">
                  <h4>{testimonials[currentTestimonial].name}</h4>
                  <p>{testimonials[currentTestimonial].role}</p>
                  <span>{testimonials[currentTestimonial].company}</span>
                </div>
              </div>
            </div>

            <div className="testimonial-indicators">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`indicator ${index === currentTestimonial ? 'active' : ''}`}
                  onClick={() => setCurrentTestimonial(index)}
                />
              ))}
            </div>
          </div>
        </div>

  {/* Pricing Section Removed */}

        {/* FAQ Section */}
        <div className="faq-section" id="faq">
          <div className="section-header">
            <h2 className="section-title">Electrical Billing FAQ</h2>
            <p className="section-subtitle">
              Common questions about managing electrical business with EaseBilling
            </p>
          </div>

          <div className="faq-container">
            {faqData.map((faq, index) => (
              <div key={index} className="faq-item">
                <button
                  className={`faq-question ${openFaq === index ? 'active' : ''}`}
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <span>{faq.question}</span>
                  {openFaq === index ? <FaChevronUp /> : <FaChevronDown />}
                </button>
                <div className={`faq-answer ${openFaq === index ? 'open' : ''}`}>
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA Section */}
        <div className="final-cta-section">
          <div className="final-cta-content">
            <h2 className="final-cta-title">Start Managing Your Electrical Business Today</h2>
            <p className="final-cta-description">
              Join electrical contractors and suppliers already using EaseBilling for efficient billing and inventory management.
            </p>
            
            <div className="final-cta-actions">
              <button className="primary-cta-button large" onClick={() => navigate('/login')}>
                Get Started with Electrical Billing
                <FaRocket className="button-icon" />
              </button>
            </div>

            <div className="final-cta-features">
              <div className="final-feature">
                <FaCheckCircle className="check-icon" />
                <span>GST compliant invoicing</span>
              </div>
              <div className="final-feature">
                <FaCheckCircle className="check-icon" />
                <span>Electrical inventory tracking</span>
              </div>
              <div className="final-feature">
                <FaCheckCircle className="check-icon" />
                <span>Professional electrical invoices</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              ⚡ EaseBilling
            </div>
            <p className="footer-description">
              Complete billing and inventory management solution for electrical contractors, 
              suppliers, and service providers. Streamline your electrical business operations.
            </p>
          </div>

          <div className="footer-section">
            <h4>Product</h4>
            <ul>
              <li><a href="#features">Features</a></li>
              <li><a href="#pricing">Pricing</a></li>
              <li><a href="#support">Support</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Company</h4>
            <ul>
              <li><a href="#about">About Us</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Legal</h4>
            <ul>
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#terms">Terms of Service</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Contact</h4>
            <div className="contact-info">
              <div className="contact-item">
                <FaEnvelope className="contact-icon" />
                <span>support@easebilling.com</span>
              </div>
              <div className="contact-item">
                <FaPhone className="contact-icon" />
                <span>1800-ELECTRIC (1800-353-2842)</span>
              </div>
              <div className="contact-item">
                <FaMapMarkerAlt className="contact-icon" />
                <span>Mumbai, India</span>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p>&copy; 2025 EaseBilling. All rights reserved.</p>
            <div className="footer-links">
              <a href="#privacy">Privacy Policy</a>
              <a href="#terms">Terms of Service</a>
              <a href="#cookies">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
