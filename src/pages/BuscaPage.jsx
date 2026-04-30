import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import ProdutosGrid from "../components/ProdutosGrid";
import "./produtoPage.css";

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

function normalizarTexto(texto = "") {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function montarCodigos(produto) {
  const variacoes = Array.isArray(produto.variacoes) ? produto.variacoes : [];
  return variacoes
    .map((v) => v.codigo)
    .filter(Boolean)
    .join(" ");
}

function BuscaPage() {
  const [searchParams] = useSearchParams();
  const termo = searchParams.get("q") || "";
  const [todosProdutos, setTodosProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    document.body.classList.add("produtos-page-body");
    return () => {
      document.body.classList.remove("produtos-page-body");
    };
  }, []);

  useEffect(() => {
    let cancelado = false;

    async function carregarProdutos() {
      try {
        const response = await fetch("/produtos.json");
        if (!response.ok) {
          throw new Error("Falha ao carregar produtos");
        }

        const dadosPorCategoria = await response.json();
        if (!dadosPorCategoria || typeof dadosPorCategoria !== "object") {
          throw new Error("Formato de produtos invalido");
        }

        const respostas = Object.entries(dadosPorCategoria).flatMap(
          ([slug, itens]) => {
            if (!Array.isArray(itens)) return [];

            return itens.map((produto, index) => ({
              ...produto,
              id: `${slug}-${produto.id ?? index}`,
              slug,
              codigosBusca: montarCodigos(produto),
            }));
          },
        );

        if (!cancelado) {
          setTodosProdutos(respostas);
        }
      } catch {
        if (!cancelado) {
          setTodosProdutos([]);
        }
      } finally {
        if (!cancelado) {
          setCarregando(false);
        }
      }
    }

    carregarProdutos();

    return () => {
      cancelado = true;
    };
  }, []);

  const resultados = useMemo(() => {
    const termoNormalizado = normalizarTexto(termo);
    if (!termoNormalizado) return [];

    return todosProdutos.filter((produto) => {
      const baseBusca = `${produto.descricao || ""} ${produto.codigosBusca || ""}`;
      return normalizarTexto(baseBusca).includes(termoNormalizado);
    });
  }, [todosProdutos, termo]);

  const slugReferencia = useMemo(() => {
    const slugResultado = resultados.find((item) =>
      ordemCategorias.includes(item.slug),
    )?.slug;
    return slugResultado || ordemCategorias[0];
  }, [resultados]);

  const capaBusca = useMemo(
    () => capasPorSlug[slugReferencia] || "/arroz.jpeg",
    [slugReferencia],
  );

  const indiceAtual = useMemo(
    () => ordemCategorias.indexOf(slugReferencia),
    [slugReferencia],
  );
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
          backgroundImage: `linear-gradient(180deg, rgba(0, 0, 0, 0.12) 20%, rgba(0, 0, 0, 0.56) 100%), url(${capaBusca})`,
        }}
      >
        <h1>Resultado da busca</h1>
      </div>

      <div className="conteudo-container">
        {carregando && <p>Carregando produtos...</p>}

        {!carregando && !termo && (
          <p>Digite algo na barra de pesquisa para buscar produtos.</p>
        )}

        {!carregando && termo && resultados.length === 0 && (
          <p>Produto não encontrado.</p>
        )}

        {!carregando && resultados.length > 0 && (
          <ProdutosGrid produtos={resultados} />
        )}
      </div>
    </section>
  );
}

export default BuscaPage;
