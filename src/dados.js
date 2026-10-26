// Os produtos e as imagens ficam no repositório bourached-dados, compartilhado
// pelos sites. A URL vem do .env (VITE_PRODUTOS_URL).
export const PRODUTOS_URL =
  import.meta.env.VITE_PRODUTOS_URL || "https://bourached-dados.vercel.app/produtos.json";

export async function buscarProdutos() {
  const response = await fetch(PRODUTOS_URL, { cache: "no-cache" });
  if (!response.ok) {
    throw new Error("Falha ao carregar produtos");
  }
  return response.json();
}

// As imagens no JSON são caminhos como "/images/graos/arroz.jpg"; elas ficam
// no mesmo servidor do produtos.json.
export function urlImagemProduto(caminho = "") {
  const limpo = String(caminho || "").trim();
  if (!limpo || limpo === "/arroz.jpeg") return limpo;
  try {
    return new URL(limpo, PRODUTOS_URL).href;
  } catch {
    return limpo;
  }
}
