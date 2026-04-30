import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function BuscaProdutos() {
  const navigate = useNavigate();
  const location = useLocation();
  const [termo, setTermo] = useState("");

  useEffect(() => {
    if (location.pathname !== "/busca") return;

    const params = new URLSearchParams(location.search);
    const termoUrl = params.get("q") || "";
    setTermo(termoUrl);
  }, [location.pathname, location.search]);

  function abrirResultados(texto) {
    const textoBusca = texto.trim();
    if (!textoBusca) {
      if (location.pathname === "/busca") {
        navigate("/busca", { replace: true });
      }
      return;
    }

    navigate(`/busca?q=${encodeURIComponent(textoBusca)}`, { replace: true });
  }

  function onSubmit(event) {
    event.preventDefault();
    abrirResultados(termo);
  }

  useEffect(() => {
    const debounce = setTimeout(() => {
      abrirResultados(termo);
    }, 350);

    return () => clearTimeout(debounce);
  }, [termo]);

  return (
    <form className="busca-produtos" onSubmit={onSubmit}>
      <input
        type="search"
        placeholder="Buscar produtos..."
        value={termo}
        onChange={(event) => setTermo(event.target.value)}
      />

      <button type="submit" className="btn-pesquisar">
        Pesquisar
      </button>
    </form>
  );
}

export default BuscaProdutos;
