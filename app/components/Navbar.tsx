import React, { useState } from "react";
import { Link } from "@remix-run/react";
import styles from "~/styles/Navbar.css";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

const Navbar: React.FC = () => {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  return (
    <nav className="navbar">
      <h1 className="navbar-logo">GiftShop</h1>
      <ul className={isMobile ? "nav-links-mobile" : "nav-links"}>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <Link to="/login">Login</Link>
        </li>
        <li>
          <Link to="/signup">Sign Up</Link>
        </li>
      </ul>
      <button className="mobile-menu-icon" onClick={() => setIsMobile(!isMobile)}>
        {isMobile ? "✖" : "☰"}
      </button>
    </nav>
  );
};

export default Navbar;
