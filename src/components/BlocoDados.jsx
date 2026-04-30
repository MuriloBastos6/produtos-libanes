function BlocoDados() {
  return (
    <div className="bloco-de-dados">
      <div className="dados-com-img">
        <img src="libanes-logo-350.png" alt="Logo-libanês" />
        <h2>
          <a href="amendoim">Variedade de produtos</a>
        </h2>
        <p>mais de 1000 produtos disponíveis</p>
      </div>
      <div className="dados-com-img">
        <img src="libanes-logo-350.png" alt="Logo-libanês" />
        <h2>
          <a
            href="https://www.instagram.com/libanes_cerealista/"
            target="_blank"
            rel="noopener noreferrer"
            className="instagram-link"
            aria-label="Instagram Cerealista Libanes"
          >
            <svg
              className="instagram-icon"
              viewBox="0 0 24 24"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M7.75 2h8.5A5.76 5.76 0 0 1 22 7.75v8.5A5.76 5.76 0 0 1 16.25 22h-8.5A5.76 5.76 0 0 1 2 16.25v-8.5A5.76 5.76 0 0 1 7.75 2zm0 1.8A3.96 3.96 0 0 0 3.8 7.75v8.5a3.96 3.96 0 0 0 3.95 3.95h8.5a3.96 3.96 0 0 0 3.95-3.95v-8.5a3.96 3.96 0 0 0-3.95-3.95h-8.5zM12 7.6A4.4 4.4 0 1 1 7.6 12 4.41 4.41 0 0 1 12 7.6zm0 1.8A2.6 2.6 0 1 0 14.6 12 2.6 2.6 0 0 0 12 9.4zm4.7-2.26a1.06 1.06 0 1 1-1.06 1.06 1.06 1.06 0 0 1 1.06-1.06z" />
            </svg>
            <span className="instagram-text">Cerealista Libanês</span>
          </a>
        </h2>
        <p>Siga-nos no Instagram!</p>
      </div>
    </div>
  );
}

export default BlocoDados;
