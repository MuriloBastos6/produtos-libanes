import React from "react";

function formatarPreco(valor) {
  return Number(valor || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function normalizarCategoria(valor = "") {
  return String(valor)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function ehCategoriaPromocao(categoria = "") {
  const categoriaNormalizada = normalizarCategoria(categoria);
  return ["promocao", "promocoes"].some((termo) =>
    categoriaNormalizada.includes(termo),
  );
}

function removerExtensao(arquivo = "") {
  const semQuery = String(arquivo).split("?")[0].split("#")[0];
  const ultimoPonto = semQuery.lastIndexOf(".");
  const ultimaBarra = semQuery.lastIndexOf("/");
  if (ultimoPonto > ultimaBarra) {
    return semQuery.slice(0, ultimoPonto);
  }
  return semQuery;
}

function montarCandidatosImagem(caminhoImagem = "") {
  const caminhoLimpo = String(caminhoImagem || "").trim();
  if (!caminhoLimpo) {
    return ["/arroz.jpeg"];
  }

  const base = removerExtensao(caminhoLimpo);
  const candidatos = [
    caminhoLimpo,
    `${base}.jpg`,
    `${base}.jpeg`,
    `${base}.png`,
    `${base}.webp`,
    "/arroz.jpeg",
  ];

  return [...new Set(candidatos)];
}

function ProdutosGrid({ produtos = [], exibirSeloPromocao = false }) {
  return (
    <div className="categoria-grid">
      {produtos.map((produto) => {
        const imagemProduto =
          typeof produto.imagem === "string" ? produto.imagem.trim() : "";
        const candidatosImagem = montarCandidatosImagem(imagemProduto);
        const mostrarSeloPromocao =
          exibirSeloPromocao &&
          (ehCategoriaPromocao(produto.categoria) ||
            produto.isPromocao === true);
        const variacoes = [...(produto.variacoes || [])].sort(
          (a, b) => Number(b.pesoValor || 0) - Number(a.pesoValor || 0),
        );

        const codigos = variacoes
          .map((v) => v.codigo)
          .filter(Boolean)
          .join(", ");

        return (
          <article className="card-produto" key={produto.id}>
            {mostrarSeloPromocao && (
              <span className="selo-promocao">Promoção</span>
            )}
            <img
              src={candidatosImagem[0]}
              alt={produto.descricao}
              className="imagem-produto"
              data-fallback-index="0"
              onError={(event) => {
                const img = event.currentTarget;
                const indiceAtual = Number(img.dataset.fallbackIndex || "0");
                const proximoIndice = indiceAtual + 1;

                if (proximoIndice < candidatosImagem.length) {
                  img.dataset.fallbackIndex = String(proximoIndice);
                  img.src = candidatosImagem[proximoIndice];
                  return;
                }

                img.onerror = null;
              }}
            />

            <h2 className="nome-produto">{produto.descricao}</h2>
            <p className="codigo-produto">Cód.: {codigos}</p>

            {variacoes.map((v, i) => (
              <div
                className="linha-variacao"
                key={`${produto.id}-${v.codigo || i}`}
              >
                <div className="precos">
                  <div className="preco-avista">
                    <strong>{formatarPreco(v.precoVenda)}</strong>
                    <span className="label-avista">A vista</span>
                  </div>

                  {v.precoDebitoCredito ? (
                    <div className="preco-cartao">
                      <strong>{formatarPreco(v.precoDebitoCredito)}</strong>
                      <span className="label-cartao">Cartão</span>
                    </div>
                  ) : null}
                </div>

                <div className="peso-bar">
                  <span className="peso-produto">
                    {v.pesoValor}
                    {v.pesoUnidade} - {v.unidade}
                  </span>
                </div>
              </div>
            ))}
          </article>
        );
      })}
    </div>
  );
}

export default ProdutosGrid;
