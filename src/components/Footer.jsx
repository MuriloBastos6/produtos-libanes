function Footer() {
  const whatsappLink = "https://wa.me/551133132333";
  const instagramLink = "https://www.instagram.com/libanes_cerealista/";
  const anoAtual = new Date().getFullYear();

  return (
    <footer
      className="site-footer"
      aria-label="Rodape com informacoes de contato"
    >
      <div className="site-footer-inner">
        <section
          className="footer-col footer-brand"
          aria-label="Marca Cerealista Libanes"
        >
          <img
            src="libanes-logo-gimp.png"
            alt="Logo da Cerealista Libanes"
            className="footer-logo"
          />
          <a
            href={instagramLink}
            target="_blank"
            rel="noopener noreferrer"
            className="footer-social-link"
            aria-label="Instagram Cerealista Libanes"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M7.75 2h8.5A5.76 5.76 0 0 1 22 7.75v8.5A5.76 5.76 0 0 1 16.25 22h-8.5A5.76 5.76 0 0 1 2 16.25v-8.5A5.76 5.76 0 0 1 7.75 2zm0 1.8A3.96 3.96 0 0 0 3.8 7.75v8.5a3.96 3.96 0 0 0 3.95 3.95h8.5a3.96 3.96 0 0 0 3.95-3.95v-8.5a3.96 3.96 0 0 0-3.95-3.95h-8.5zM12 7.6A4.4 4.4 0 1 1 7.6 12 4.41 4.41 0 0 1 12 7.6zm0 1.8A2.6 2.6 0 1 0 14.6 12 2.6 2.6 0 0 0 12 9.4zm4.7-2.26a1.06 1.06 0 1 1-1.06 1.06 1.06 1.06 0 0 1 1.06-1.06z" />
            </svg>
            <span>@libanes_cerealista</span>
          </a>
        </section>

        <section className="footer-col" aria-label="Fale conosco">
          <h3>Fale conosco</h3>
          <p>
            WhatsApp:{" "}
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
              (11) 3313-2333
            </a>
          </p>
          <p>
            Instagram:{" "}
            <a href={instagramLink} target="_blank" rel="noopener noreferrer">
              Cerealista Libanês
            </a>
            </p>    
            <p>
             Email:{" "}
            <a
              href="mailto:touficalimentos144@gmail.com"
                target="_blank"                rel="noopener noreferrer"
            >
              touficalimentos144@gmail.com
            </a>
          </p>
        </section>

        <section className="footer-col" aria-label="Atendimento">
          <h3>Atendimento</h3>
          <p>Rua Benjamim de Oliveira, no 144 - Brás,</p>
          <p>Seg a Sex: 04:30 as 16:00</p>
          <p>Sab: 05:00 as 12:00</p>
        </section>

        <section className="footer-col" aria-label="Pagamentos">
          <h3>Pague com</h3>
          <div
            className="footer-badges"
            role="list"
            aria-label="Formas de pagamento"
          >
            <span role="listitem">Pix</span>
            <span role="listitem">Cartão</span>
            <span role="listitem">Dinheiro</span>
          </div>
        </section>
      </div>

      <div className="site-footer-bottom" aria-label="Creditos e direitos">
        <p>
          &copy; {anoAtual} Cerealista Libanês | CNPJ: 45.557.863/0001-00 |
          Todos os direitos reservados
        </p>
      </div>
    </footer>
  );
}

export default Footer;
