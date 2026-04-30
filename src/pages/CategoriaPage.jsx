import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import "./produtoPage.css";
import ProdutosGrid from "../components/ProdutosGrid";

const ordemCategorias = [
  "amendoim",
  "arroz",
  "sucrilhos",
  "cha",
  "farinhas",
  "graos",
  "panificacao",
  "especiarias",
  "frutas",
  "sementes",
  "produtosnaturais",
  "refris",
  "oleo",
  "goma",
  "salgadinhos",
  "doces",
  "potes",
];

const categoriasValidas = new Set([
  "amendoim",
  "arroz",
  "sucrilhos",
  "cha",
  "farinhas",
  "graos",
  "panificacao",
  "especiarias",
  "frutas",
  "sementes",
  "produtosnaturais",
  "refris",
  "oleo",
  "goma",
  "salgadinhos",
  "doces",
  "potes",
]);

const titulos = {
  amendoim: "Amendoim",
  arroz: "Arroz",
  sucrilhos: "Sucrilhos",
  cha: "Cha",
  farinhas: "Farinhas",
  graos: "Graos",
  panificacao: "Panificacao",
  especiarias: "Especiarias",
  frutas: "Frutas",
  sementes: "Sementes",
  produtosnaturais: "Produtos Naturais",
  refris: "Refris",
  oleo: "Oleo",
  goma: "Goma",
  salgadinhos: "Salgadinhos",
  doces: "Doces",
  potes: "Potes",
};

const capasPorSlug = {
  amendoim: "/amendoim.jpeg",
  arroz: "/arroz.jpeg",
  sucrilhos: "/sucrilhos.jpeg",
  cha: "/cha.jpeg",
  farinhas: "/farinhas.jpeg",
  graos: "/graos.jpeg",
  panificacao: "/panificacoes.jpeg",
  especiarias: "/especiarias.jpeg",
  frutas: "/frutas.jpeg",
  sementes: "/sementes.jpeg",
  produtosnaturais: "/produtosnaturais.jpeg",
  refris: "/refris.jpeg",
  oleo: "/oleo.jpeg",
  goma: "/Goma.png",
  salgadinhos: "/salgadinho.jpeg",
  doces: "/doces.jpeg",
  potes: "/pote.jpeg",
};

function CategoriaPage() {
  const { slug } = useParams();
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const categoriaValida = categoriasValidas.has(slug);

  useEffect(() => {
    document.body.classList.add("produtos-page-body");
    return () => {
      document.body.classList.remove("produtos-page-body");
    };
  }, []);

  useEffect(() => {
    if (!categoriaValida) return;

    let cancelado = false;
    setCarregando(true);
    setErro("");

    fetch("/produtos.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Falha ao buscar produtos");
        }
        return response.json();
      })
      .then((data) => {
        if (!cancelado) {
          const produtosCategoria = Array.isArray(data?.[slug])
            ? data[slug]
            : [];
          const itensPromocao =
            (Array.isArray(data?.promoçoes) && data.promoçoes) ||
            (Array.isArray(data?.promoções) && data.promoções) ||
            (Array.isArray(data?.promocoes) && data.promocoes) ||
            (Array.isArray(data?.promocao) && data.promocao) ||
            [];

          const idsPromocao = new Set(
            itensPromocao
              .map((item) => String(item?.id || "").trim())
              .filter(Boolean),
          );

          const produtosComSelo = produtosCategoria.map((produto) => ({
            ...produto,
            isPromocao: idsPromocao.has(String(produto?.id || "").trim()),
          }));

          setProdutos(produtosComSelo);
        }
      })
      .catch(() => {
        if (!cancelado) {
          setProdutos([]);
          setErro("Nao foi possivel carregar os produtos.");
        }
      })
      .finally(() => {
        if (!cancelado) {
          setCarregando(false);
        }
      });

    return () => {
      cancelado = true;
    };
  }, [slug, categoriaValida]);

  const titulo = useMemo(() => titulos[slug] || "Categoria", [slug]);
  const capaCategoria = useMemo(
    () => capasPorSlug[slug] || "/banner.png",
    [slug],
  );

  const indiceAtual = useMemo(() => ordemCategorias.indexOf(slug), [slug]);
  const categoriaAnterior =
    indiceAtual >= 0
      ? ordemCategorias[
          (indiceAtual - 1 + ordemCategorias.length) % ordemCategorias.length
        ]
      : ordemCategorias[0];
  const proximaCategoria =
    indiceAtual >= 0
      ? ordemCategorias[(indiceAtual + 1) % ordemCategorias.length]
      : ordemCategorias[0];

  function focarBarraPesquisa() {
    const input = document.querySelector(".input-div input");
    if (input) {
      input.scrollIntoView({ behavior: "smooth", block: "center" });
      input.focus();
    }
  }

  if (!categoriaValida) {
    return <Navigate to="/" replace />;
  }

  return (
    <section className="produtosPage">
      <div
        className="navegacao-categorias"
        aria-label="Navegacao de categorias"
      >
        <Link
          className="nav-categoria-btn"
          to={`/${categoriaAnterior}`}
          aria-label={`Categoria anterior: ${titulos[categoriaAnterior]}`}
          title={`Categoria anterior: ${titulos[categoriaAnterior]}`}
        >
          &lt;
        </Link>
        <button
          type="button"
          className="nav-categoria-btn"
          onClick={focarBarraPesquisa}
          aria-label="Ir para barra de pesquisa"
          title="Ir para barra de pesquisa"
        >
          🔍
        </button>
        <Link
          className="nav-categoria-btn"
          to={`/${proximaCategoria}`}
          aria-label={`Proxima categoria: ${titulos[proximaCategoria]}`}
          title={`Proxima categoria: ${titulos[proximaCategoria]}`}
        >
          &gt;
        </Link>
      </div>

      <div
        className="titulo-container"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(0, 0, 0, 0.12) 20%, rgba(0, 0, 0, 0.56) 100%), url(${capaCategoria})`,
        }}
      >
        <h1>{titulo}</h1>
      </div>
      <div className="conteudo-container">
        {carregando && <p>Carregando produtos...</p>}
        {!carregando && erro && <p>{erro}</p>}
        {!carregando && !erro && (
          <ProdutosGrid produtos={produtos} exibirSeloPromocao />
        )}
      </div>
    </section>
  );
}

export default CategoriaPage;
