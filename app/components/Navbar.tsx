import '../styles/Navbar.css';

import { Link } from '@remix-run/react';
import React from 'react';

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">My Gift Shop</div>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/login">Login</Link></li>
      </ul>
      <button className="mobile-menu-icon">Test</button>
    </nav>
  );
};

export default Navbar;


