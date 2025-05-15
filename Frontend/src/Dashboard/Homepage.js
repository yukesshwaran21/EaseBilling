// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { FaFileInvoiceDollar, FaBoxes, FaUsersCog, FaChartLine } from 'react-icons/fa';
// import './Homepage.css';

// const Homepage = () => {
//   const navigate = useNavigate();

 
// const features = [
//   {
//     icon: <FaFileInvoiceDollar size={40} color="#ef4444" />,
//     title: 'Invoice Generation',
//     description: 'Generate and manage invoices for electricity services or usage, including payment tracking.',
//   },
//   {
//     icon: <FaBoxes size={40} color="#14b8a6" />,
//     title: 'Inventory Management',
//     description: 'Track and manage electrical equipment, meters, and parts efficiently.',
//   },
//   {
//     icon: <FaUsersCog size={40} color="#ef4444" />,
//     title: 'Worker Management',
//     description: 'Assign tasks, monitor performance, and manage your labor team effectively.',
//   },
//   {
//     icon: <FaChartLine size={40} color="#14b8a6" />,
//     title: 'Sales Overview',
//     description: 'Analyze total sales, revenue trends, and invoice data with visual charts and reports.',
//   },
// ];



//   return (
//     <div className="homepage-container">
//       {/* Navbar */}
//       <nav className="navbar">
//         <div className="logo">⚡ Electro Bill</div>
//         <button className="signup-button" onClick={() => navigate('/login')}>
//           LOGIN 
//         </button>
//       </nav>

//       <div className="container mx-auto px-4">
//         {/* Hero Section */}
//         <div className="hero-section">
//           <h1 className="hero-title">
//             Take Control of Your <span className="highlight">Electricity</span> Bills
//           </h1>
//           <p className="hero-subtitle">
//            <b> Smart. Efficient. User-Friendly. Manage your electricity effortlessly from anywhere.</b>
//           </p>
//         </div>

//         {/* Features Section */}
//         <div className="features-grid">
//           {features.map((feature, index) => (
//             <div key={index} className="feature-card">
//               <div className="flex flex-col items-center text-center">
//                 {feature.icon}
//                 <h3 className="feature-title">{feature.title}</h3>
//                 <p className="feature-description">{feature.description}</p>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Call to Action Section */}
//         <div className="cta-section">
//           <h2 className="cta-title">Join Electro Bill Today</h2>
//           <p className="cta-description">
//             Experience a smarter way to monitor and pay for electricity.
//           </p>
//           <button className="secondary-button" onClick={() => navigate('/login')}>
//             Get Started
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Homepage;





































import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Bolt, FileText, Package, Users, BarChart3 } from 'lucide-react';
import "./Homepage.css";

const Homepage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <FileText size={40} className="feature-icon invoice" />,
      title: "Invoice Generation",
      description: "Generate and manage invoices for electricity services or usage, including payment tracking.",
    },
    {
      icon: <Package size={40} className="feature-icon inventory" />,
      title: "Inventory Management",
      description: "Track and manage electrical equipment, meters, and parts efficiently.",
    },
    {
      icon: <Users size={40} className="feature-icon workers" />,
      title: "Worker Management",
      description: "Assign tasks, monitor performance, and manage your labor team effectively.",
    },
    {
      icon: <BarChart3 size={40} className="feature-icon sales" />,
      title: "Sales Overview",
      description: "Analyze total sales, revenue trends, and invoice data with visual charts and reports.",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  return (
    <div className="homepage">
      {/* Navbar */}
      <nav className="navbar">
        <div className="container">
          <div className="logo">
            <Bolt className="logo-icon" />
            <span>Electro Bill</span>
          </div>
          <motion.button
            className="login-button"
            onClick={() => navigate("/login")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            LOGIN
          </motion.button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <motion.div
            className="hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="hero-title">
              Take Control of Your <span className="highlight">Electricity</span> Bills
            </h1>
            <p className="hero-subtitle">
              <b>Smart. Efficient. User-Friendly. Manage your electricity effortlessly from anywhere.</b>
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Our Features
          </motion.h2>

          <motion.div className="features-grid" variants={containerVariants} initial="hidden" animate="visible">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="feature-card"
                variants={itemVariants}
                whileHover={{
                  y: -10,
                  boxShadow: "0 10px 25px rgba(0, 0, 0, 0.08)",
                }}
              >
                <div className="feature-icon-wrapper">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section">
        <div className="container">
          <motion.div
            className="cta-content"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <h2 className="cta-title">Join Electro Bill Today</h2>
            <p className="cta-description">Experience a smarter way to monitor and pay for electricity.</p>
            <motion.button
              className="cta-button"
              onClick={() => navigate("/login")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-logo">
              <Bolt className="logo-icon" />
              <span>Electro Bill</span>
            </div>
            <p className="footer-copyright">&copy; {new Date().getFullYear()} Electro Bill. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
