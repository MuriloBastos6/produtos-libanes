import React from "react";
import { Link, useNavigate } from "react-router-dom";
import BuscaProdutos from "./BuscaProdutos";

const categoriasOpcoes = [
  { titulo: "Amendois & castanhas", slug: "amendoim" },
  { titulo: "Arroz", slug: "arroz" },
  { titulo: "Sucrilhos", slug: "sucrilhos" },
  { titulo: "Chás", slug: "cha" },
  { titulo: "Farinhas", slug: "farinhas" },
  { titulo: "Grãos", slug: "graos" },
  { titulo: "Panificação", slug: "panificacao" },
  { titulo: "Especiarias", slug: "especiarias" },
  { titulo: "Frutas", slug: "frutas" },
  { titulo: "Sementes", slug: "sementes" },
  { titulo: "Produtos naturais", slug: "produtosnaturais" },
  { titulo: "Refrigerantes & sucos", slug: "refris" },
  { titulo: "Óleo vegetal", slug: "oleo" },
  { titulo: "Goma pronta", slug: "goma" },
  { titulo: "Salgadinho & snacks", slug: "salgadinhos" },
  { titulo: "Doces", slug: "doces" },
  { titulo: "Potes", slug: "potes" },
];

function Navbar() {
  const navigate = useNavigate();

  const handleSelectCategoria = (e) => {
    const slug = e.target.value;
    if (slug) {
      navigate(`/${slug}`);
      e.target.value = "";
    }
  };

  return (
    <nav className="nav-bar">
      <div className="div-logo">
        <Link to="/">
          <img src="libanes-logo-gimp.png" alt="Logo da libanês" />
        </Link>
      </div>
      <div className="nav-titulo">
        <h2>Nossos Produtos</h2>
        <p>Confira nossa lista de produtos, e clique para ver mais informações.</p>
      </div>
      <div className="input-div">
        <BuscaProdutos />
      </div>
      <div className="categorias-select-div">
        <select
          className="categorias-select"
          onChange={handleSelectCategoria}
          defaultValue=""
          aria-label="Selecionar categoria"
        >
          <option value="" disabled>
            Selecione uma categoria
          </option>
          {categoriasOpcoes.map((cat) => (
            <option key={cat.slug} value={cat.slug}>
              {cat.titulo}
            </option>
          ))}
        </select>
      </div>
    </nav>
  );
}

export default Navbar;
