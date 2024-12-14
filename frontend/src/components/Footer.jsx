import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhone,
  faEnvelope,
  faMapMarkerAlt,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebook,
  faTwitter,
  faInstagram,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";

function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-800 via-gray-900 to-black text-gray-300 py-10 px-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center md:text-left">
        {/* Contact Us */}
        <div>
          <h3 className="text-lg font-bold text-white mb-4">Contact Us</h3>
          <ul className="space-y-2">
            <li>
              <FontAwesomeIcon icon={faPhone} className="text-green-400 mr-2" />
              +977 - 9800000000
            </li>
            <li>
              <FontAwesomeIcon
                icon={faEnvelope}
                className="text-blue-400 mr-2"
              />
              <a
                href="mailto:bidhansupport@gmail.com"
                className="hover:underline"
              >
                bidhansupport@gmail.com
              </a>
            </li>
            <li>
              <FontAwesomeIcon
                icon={faMapMarkerAlt}
                className="text-red-400 mr-2"
              />
              Bhanu Street, Kathmandu, Nepal
            </li>
            <li>
              <FontAwesomeIcon
                icon={faClock}
                className="text-yellow-400 mr-2"
              />
              Mon - Fri, 9am - 5pm
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-bold text-white mb-4">Follow Us</h3>
          <ul className="space-y-2">
            <li>
              <a
                href="#"
                className="flex items-center space-x-2 hover:text-white transition"
              >
                <FontAwesomeIcon icon={faFacebook} className="text-blue-500" />
                <span>Facebook</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center space-x-2 hover:text-white transition"
              >
                <FontAwesomeIcon icon={faTwitter} className="text-blue-400" />
                <span>Twitter</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center space-x-2 hover:text-white transition"
              >
                <FontAwesomeIcon icon={faInstagram} className="text-pink-400" />
                <span>Instagram</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center space-x-2 hover:text-white transition"
              >
                <FontAwesomeIcon icon={faLinkedin} className="text-blue-700" />
                <span>LinkedIn</span>
              </a>
            </li>
          </ul>
        </div>

        {/* Our Services */}
        <div>
          <h3 className="text-lg font-bold text-white mb-4">Our Services</h3>
          <ul className="space-y-2">
            <li className="hover:text-white transition">Web Development</li>
            <li className="hover:text-white transition">
              Mobile App Development
            </li>
            <li className="hover:text-white transition">Cloud Hosting</li>
            <li className="hover:text-white transition">SEO Optimization</li>
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-bold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:text-white transition">
                About Us
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition">
                Careers
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition">
                Terms & Conditions
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Divider */}
      <div className="mt-8 border-t border-gray-700 pt-4 text-center">
        <p className="text-sm">
          &copy; 2024 Public Shuttle Service. All rights reserved.
        </p>
        <div className="mt-2 flex justify-center space-x-4">
          <a
            href="#"
            className="text-gray-400 hover:text-white transition"
            aria-label="Facebook"
          >
            <FontAwesomeIcon icon={faFacebook} size="lg" />
          </a>
          <a
            href="#"
            className="text-gray-400 hover:text-white transition"
            aria-label="Twitter"
          >
            <FontAwesomeIcon icon={faTwitter} size="lg" />
          </a>
          <a
            href="#"
            className="text-gray-400 hover:text-white transition"
            aria-label="Instagram"
          >
            <FontAwesomeIcon icon={faInstagram} size="lg" />
          </a>
          <a
            href="#"
            className="text-gray-400 hover:text-white transition"
            aria-label="LinkedIn"
          >
            <FontAwesomeIcon icon={faLinkedin} size="lg" />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
