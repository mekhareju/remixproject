import React from 'react';
import { Link } from '@remix-run/react';
import '../styles/Navbar.css';

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">My Gift Shop</div>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/login">Login</Link></li>
      </ul>
      <button className="mobile-menu-icon">☰</button>
    </nav>
  );
};

export default Navbar;


