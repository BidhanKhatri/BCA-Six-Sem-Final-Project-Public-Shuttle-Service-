import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faInfoCircle,
  faEnvelope,
  faUser,
  faBars,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useParams, useLocation } from "react-router-dom";
import logoBlack from "../assets/images/ps-b-logo.png";

export default function Navbar() {
  const { id } = useParams();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const navLinks = [
    { path: "/", label: "Home", icon: faHome },
    { path: "/about", label: "About", icon: faInfoCircle },
    { path: "/contact", label: "Contact", icon: faEnvelope },
    { path: `/profile/${id}`, label: "Profile", icon: faUser },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 w-full z-50 bg-black text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16">
        <div className="flex justify-between items-center h-14">
          {/* Brand Logo */}
          <div className="flex-shrink-0">
            <Link to="/">
              <img src={logoBlack} alt="Logo" className="h-20 w-auto" />
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                className={`flex items-center space-x-2 text-lg font-medium transition ${
                  isActive(link.path)
                    ? "text-blue-400"
                    : "hover:text-blue-300 text-white"
                }`}
              >
                <FontAwesomeIcon icon={link.icon} />
                <span>{link.label}</span>
              </Link>
            ))}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-white hover:text-blue-400 transition focus:outline-none"
              aria-label="Toggle mobile menu"
            >
              <FontAwesomeIcon
                icon={isMobileMenuOpen ? faTimes : faBars}
                size="lg"
              />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-900 text-white shadow-lg">
          <ul className="space-y-2 py-4 px-6">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  to={link.path}
                  onClick={toggleMobileMenu}
                  className={`block text-lg font-medium transition ${
                    isActive(link.path)
                      ? "text-blue-400"
                      : "hover:text-blue-300 text-white"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}
