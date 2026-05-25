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
    titulo: "Itens Essenciais para Festa Junina",
    subtitulo: "Tudo que o seu arraiá precisa em um só lugar",
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
    <section className="secao-produtos-categoria secao-festa-junina">
      <div className="festa-junina-banner">
        <div className="bandeirinhas" aria-hidden="true">
          {Array.from({ length: 18 }).map((_, indice) => (
            <span key={indice} className={`bandeirinha cor-${indice % 4}`} />
          ))}
        </div>

        <div className="festa-junina-overlay">
          <span className="festa-junina-selo">Arraiá do Libanês</span>
          <h2>{categoria.titulo}</h2>
          <p>{categoria.subtitulo}</p>
        </div>

        <div className="bandeirinhas bandeirinhas-baixo" aria-hidden="true">
          {Array.from({ length: 18 }).map((_, indice) => (
            <span key={indice} className={`bandeirinha cor-${indice % 4}`} />
          ))}
        </div>
      </div>

      <div className="festa-junina-faixa">
        <p>Confira nossa seleção especial para o São João!</p>
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
