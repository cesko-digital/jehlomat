import React from "react";
import { Link } from "react-router-dom";


export default function Navigation() {
  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/">Domů</Link>
          </li>
          <li>
            <Link to="/registrace/dekujeme">Děkujeme</Link>
          </li>
          <li>
            <Link to="/organizace">Organizace</Link>
          </li>
          <li>
            <Link to="/registrace/dekujeme">Děkujeme</Link>
          </li>
          <li>
            <Link to="/nalezy">Nalezy</Link>
          </li>
          <li>
            <Link to="/novy-nalez">Novy nalez</Link>
          </li>
          <li>
            <Link to="/profil">Profil</Link>
          </li>
          <li>
            <Link to="/registrace">Registrace</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
