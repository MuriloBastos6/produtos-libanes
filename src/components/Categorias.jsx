import React from "react";
import { Link } from "react-router-dom";

function Categorias({ onSelectCategory }) {
  const categoria = [
    {
      titulo: "Amendois & castanhas",
      capa: "/amendoim.jpeg",
      slug: "amendoim",
    },
    {
      titulo: "Arroz",
      capa: "/arroz.jpeg",
      slug: "arroz",
    },
    {
      titulo: "Sucrilhos",
      capa: "/sucrilhos.jpeg",
      slug: "sucrilhos",
    },
    {
      titulo: "Chás",
      capa: "/cha.jpeg",
      slug: "cha",
    },
    {
      titulo: "Farinhas",
      capa: "/farinhas.jpeg",
      slug: "farinhas",
    },
    {
      titulo: "Grãos",
      capa: "/graos.jpeg",
      slug: "graos",
    },
    {
      titulo: "Panificação",
      capa: "/panificacoes.jpeg",
      slug: "panificacao",
    },
    {
      titulo: "Especiarias",
      capa: "/especiarias.jpeg",
      slug: "especiarias",
    },
    {
      titulo: "Frutas",
      capa: "/frutas.jpeg",
      slug: "frutas",
    },
    {
      titulo: "Sementes",
      capa: "/sementes.jpeg",
      slug: "sementes",
    },
    {
      titulo: "Produtos naturais",
      capa: "/produtosnaturais.jpeg",
      slug: "produtosnaturais",
    },
    {
      titulo: "Refrigerantes & sucos",
      capa: "/refris.jpeg",
      slug: "refris",
    },
    {
      titulo: "Óleo vegetal",
      capa: "/oleo.jpeg",
      slug: "oleo",
    },
    {
      titulo: "Goma pronta",
      capa: "/Goma.png",
      slug: "goma",
    },
    {
      titulo: "Salgadinho & snacks",
      capa: "/salgadinho.jpeg",
      slug: "salgadinhos",
    },
    {
      titulo: "Doces",
      capa: "/doces.jpeg",
      slug: "doces",
    },
    {
      titulo: "Potes",
      capa: "/pote.jpeg",
      slug: "potes",
    },
  ];
  return (
    <div className="card-categorias">
      {categoria.map((cat) => (
        <Link
          to={`/${cat.slug}`}
          key={cat.slug}
          onClick={onSelectCategory}
          style={{ backgroundImage: `url(${cat.capa})` }}
        >
          {cat.titulo}
        </Link>
      ))}
    </div>
  );
}

export default Categorias;
