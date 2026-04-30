import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Categorias from "./Categorias";
import BuscaProdutos from "./BuscaProdutos";

function Navbar() {
  const [menuAberto, setMenuAberto] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setMenuAberto(!menuAberto);
  };

  const fecharMenu = () => {
    setMenuAberto(false);
  };

  useEffect(() => {
    setMenuAberto(false);
  }, [location.pathname]);

  return (
    <nav className="nav-bar">
      <div className="nav-titulo">
        <h1>Lista de Produtos</h1>
      </div>
      <div className="div-logo">
        <Link to="/" onClick={fecharMenu}>
          <img src="libanes-logo-gimp.png" alt="Logo da libanês" />
        </Link>
      </div>
      <button
        className="btn-menu-hamburger"
        onClick={toggleMenu}
        aria-label="Menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
      <div className="input-div">
        <BuscaProdutos />
      </div>

      {/* Menu Hamburger */}

      {/* Menu de Categorias */}
      <div className={`menu-categorias ${menuAberto ? "aberto" : ""}`}>
        <ul className="lista-categorias">
          <li className="item-categoria">
            <Categorias onSelectCategory={fecharMenu} />
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
