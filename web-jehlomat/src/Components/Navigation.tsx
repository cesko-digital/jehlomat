import React from "react";
import {
  Link
} from "react-router-dom";

export default function Navigation() {
  return (
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
          </ul>
          
        </nav>
      </div>
  );
}