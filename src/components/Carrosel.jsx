import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

function Carrosel() {
  const LIMITE_SWIPE = 48;
  const slides = [
    {
      slug: "amendoim",
      image: "/amendoim.jpeg",
      tag: "Paçoca & pé-de-moleque",
      title: "Amendoim do Arraiá",
      subtitle: "A base da paçoca e do pé-de-moleque caseiro",
      icon: "🥜",
    },
    {
      slug: "graos",
      image: "/graos.jpeg",
      tag: "Canjica & milho",
      title: "Grãos da Festa Junina",
      subtitle: "Canjica branca, amarela e milho pra pipoca",
      icon: "🌽",
    },
    {
      slug: "farinhas",
      image: "/farinhas.jpeg",
      tag: "Bolo de milho & cuscuz",
      title: "Farinhas Tradicionais",
      subtitle: "Fubá, farinha de milho e mandioca pra suas receitas",
      icon: "🌾",
    },
    {
      slug: "doces",
      image: "/doces.jpeg",
      tag: "Quentão sem álcool & doces",
      title: "Doces de São João",
      subtitle: "Doce de leite, goiabada e mais delícias do arraiá",
      icon: "🍬",
    },
    {
      slug: "especiarias",
      image: "/especiarias.jpeg",
      tag: "Canela, cravo & gengibre",
      title: "Temperos do Quentão",
      subtitle: "Especiarias para um quentão de verdade",
      icon: "🌶️",
    },
    {
      slug: "sementes",
      image: "/sementes.jpeg",
      tag: "Pipoca premium",
      title: "Sementes & Pipoca",
      subtitle: "Milho de pipoca selecionado para a fogueira",
      icon: "🍿",
    },
    {
      slug: "panificacao",
      image: "/panificacoes.jpeg",
      tag: "Bolo de fubá & broa",
      title: "Panificação Junina",
      subtitle: "Tudo para os bolos e broas da festa",
      icon: "🍞",
    },
    {
      slug: "bolachas",
      image: "/bolachas.jpeg",
      tag: "Direto de Minas",
      title: "Bolachas Mineiras",
      subtitle: "Biscoitos artesanais para acompanhar o café da fogueira",
      icon: "🍪",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [bloquearClique, setBloquearClique] = useState(false);
  const touchStartX = useRef(0);
  const touchDeltaX = useRef(0);
  const swipeEmAndamento = useRef(false);
  const cliqueTimerRef = useRef(null);

  function nextSlide() {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }

  function prevSlide() {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }

  function onTouchStart(event) {
    touchStartX.current = event.touches[0].clientX;
    touchDeltaX.current = 0;
    swipeEmAndamento.current = false;
  }

  function onTouchMove(event) {
    touchDeltaX.current = event.touches[0].clientX - touchStartX.current;
    if (Math.abs(touchDeltaX.current) > 10) {
      swipeEmAndamento.current = true;
    }
  }

  function onTouchEnd() {
    if (Math.abs(touchDeltaX.current) >= LIMITE_SWIPE) {
      if (touchDeltaX.current < 0) {
        nextSlide();
      } else {
        prevSlide();
      }

      setBloquearClique(true);
      if (cliqueTimerRef.current) {
        clearTimeout(cliqueTimerRef.current);
      }
      cliqueTimerRef.current = setTimeout(() => {
        setBloquearClique(false);
      }, 250);
    }

    touchDeltaX.current = 0;
    swipeEmAndamento.current = false;
  }

  function onClickCapture(event) {
    if (bloquearClique || swipeEmAndamento.current) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 3500);

    return () => clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    return () => {
      if (cliqueTimerRef.current) {
        clearTimeout(cliqueTimerRef.current);
      }
    };
  }, []);

  return (
    <section
      className="carrossel carrossel-junino"
      aria-label="Vitrine Festa Junina"
    >
      <div className="carrossel-bandeirinhas" aria-hidden="true">
        {Array.from({ length: 22 }).map((_, indice) => (
          <span
            key={indice}
            className={`carrossel-bandeirinha cor-${indice % 4}`}
          />
        ))}
      </div>

      <div
        className="carrossel-track"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchEnd}
        onClickCapture={onClickCapture}
      >
        {slides.map((slide) => (
          <article className="carrossel-slide" key={slide.slug}>
            <Link to={`/${slide.slug}`} className="carrossel-slide-link">
              <img
                src={slide.image}
                alt={slide.title}
                className="carrossel-img"
              />
              <div className="carrossel-overlay">
                <span className="carrossel-tag">
                  <span className="carrossel-tag-icone" aria-hidden="true">
                    {slide.icon}
                  </span>
                  {slide.tag}
                </span>
                <h2>{slide.title}</h2>
                <p>{slide.subtitle}</p>
                <span className="carrossel-cta">
                  Ver produtos
                  <span aria-hidden="true"> →</span>
                </span>
              </div>
            </Link>
          </article>
        ))}
      </div>

      <div className="carrossel-indicadores" role="tablist">
        {slides.map((slide, indice) => (
          <button
            key={slide.slug}
            type="button"
            role="tab"
            aria-label={`Ir para ${slide.title}`}
            aria-selected={indice === currentIndex}
            className={`carrossel-indicador${
              indice === currentIndex ? " ativo" : ""
            }`}
            onClick={() => setCurrentIndex(indice)}
          />
        ))}
      </div>

      <button
        className="carrossel-btn prev"
        onClick={prevSlide}
        aria-label="Slide anterior"
      >
        ‹
      </button>
      <button
        className="carrossel-btn next"
        onClick={nextSlide}
        aria-label="Próximo slide"
      >
        ›
      </button>
    </section>
  );
}

export default Carrosel;
