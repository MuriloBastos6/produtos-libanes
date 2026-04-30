import { useEffect, useState } from "react";
import ProdutosGrid from "./ProdutosGrid.jsx";

function normalizarCategoria(valor = "") {
  return String(valor)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function ehCategoriaPromocao(nomeCategoria = "") {
  const categoria = normalizarCategoria(nomeCategoria);
  return categoria === "promocao" || categoria === "promocoes";
}

function montarMapaImagemPorId(dados = {}) {
  const mapa = new Map();

  Object.entries(dados).forEach(([categoria, itens]) => {
    if (!Array.isArray(itens) || ehCategoriaPromocao(categoria)) return;

    itens.forEach((item) => {
      const id = String(item?.id || "").trim();
      const imagem = typeof item?.imagem === "string" ? item.imagem.trim() : "";
      if (id && imagem && imagem !== "/arroz.jpeg" && !mapa.has(id)) {
        mapa.set(id, imagem);
      }
    });
  });

  return mapa;
}

function sincronizarImagensPromocao(
  produtosPromocao = [],
  mapaImagemPorId = new Map(),
) {
  return produtosPromocao.map((produto) => {
    const id = String(produto?.id || "").trim();
    const imagemCorrespondente = mapaImagemPorId.get(id);

    if (!imagemCorrespondente) {
      return produto;
    }

    return {
      ...produto,
      imagem: imagemCorrespondente,
    };
  });
}

function ListaDeProdutos() {
  const [produtosPromocao, setProdutosPromocao] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const categoria = {
    titulo: "Promoções da semana!!",
    subtitulo: "Valida até durarem os estoques",
    capa: "/banner-azul.png",
  };

  useEffect(() => {
    let cancelado = false;

    async function carregarProdutos() {
      try {
        const response = await fetch("/produtos.json");
        if (!response.ok) {
          throw new Error("Falha ao carregar produtos");
        }

        const dados = await response.json();
        const promo =
          (Array.isArray(dados?.promoçoes) && dados.promoçoes) ||
          (Array.isArray(dados?.promoções) && dados.promoções) ||
          (Array.isArray(dados?.promocoes) && dados.promocoes) ||
          (Array.isArray(dados?.promocao) && dados.promocao) ||
          [];
        const mapaImagemPorId = montarMapaImagemPorId(dados);
        const promoComImagensSincronizadas = sincronizarImagensPromocao(
          promo,
          mapaImagemPorId,
        );

        if (!cancelado) {
          setProdutosPromocao(promoComImagensSincronizadas);
        }
      } catch {
        if (!cancelado) {
          setProdutosPromocao([]);
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

  return (
    <section className="secao-produtos-categoria">
      <div
        className="categoria-banner"
        style={{ backgroundImage: `url(${categoria.capa})` }}
      >
        <div className="categoria-overlay">
          <h2>{categoria.titulo}</h2>
          <p>{categoria.subtitulo}</p>
        </div>
      </div>

      <div className="data-promocao">
        <p>Valida até 01/05/2026</p>
      </div>

      {carregando ? (
        <p>Carregando produtos...</p>
      ) : (
        <ProdutosGrid produtos={produtosPromocao} />
      )}
    </section>
  );
}

export default ListaDeProdutos;
