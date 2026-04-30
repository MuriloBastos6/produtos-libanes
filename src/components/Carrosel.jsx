import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

function Carrosel() {
  const LIMITE_SWIPE = 48;
  const slides = [
    {
      slug: "amendoim",
      image: "/amendoim.jpeg",
      title: "Amendoins & Castanhas",
      subtitle: "Clique para ver todos os produtos",
    },
    {
      slug: "arroz",
      image: "/arroz.jpeg",
      title: "Arroz",
      subtitle: "Clique para ver todos os produtos",
    },
    {
      slug: "sucrilhos",
      image: "/sucrilhos.jpeg",
      title: "Cereais",
      subtitle: "Clique para ver todos os produtos",
    },
    {
      slug: "cha",
      image: "/cha.jpeg",
      title: "Chás",
      subtitle: "Clique para ver todos os produtos",
    },
    {
      slug: "farinhas",
      image: "/farinhas.jpeg",
      title: "Farinaceos",
      subtitle: "Clique para ver todos os produtos",
    },
    {
      slug: "graos",
      image: "/graos.jpeg",
      title: "Grãos",
      subtitle: "Clique para ver todos os produtos",
    },
    {
      slug: "panificacao",
      image: "/panificacoes.jpeg",
      title: "Panificação",
      subtitle: "Clique para ver todos os produtos",
    },
    {
      slug: "especiarias",
      image: "/especiarias.jpeg",
      title: "Especiarias",
      subtitle: "Clique para ver todos os produtos",
    },
    {
      slug: "frutas",
      image: "/frutas.jpeg",
      title: "Frutas",
      subtitle: "Clique para ver todos os produtos",
    },
    {
      slug: "sementes",
      image: "/sementes.jpeg",
      title: "Sementes",
      subtitle: "Clique para ver todos os produtos",
    },
    {
      slug: "produtosnaturais",
      image: "/produtosnaturais.jpeg",
      title: "Produtos naturais",
      subtitle: "Clique para ver todos os produtos",
    },
    {
      slug: "refris",
      image: "/refris.jpeg",
      title: "Refrigerantes & Sucos",
      subtitle: "Clique para ver todos os produtos",
    },
    {
      slug: "oleo",
      image: "/oleo.jpeg",
      title: "Óleos vegetais",
      subtitle: "Clique para ver todos os produtos",
    },
    {
      slug: "goma",
      image: "/Goma.png",
      title: "Gomas pronta",
      subtitle: "Clique para ver todos os produtos",
    },
    {
      slug: "salgadinhos",
      image: "/salgadinho.jpeg",
      title: "Salgadinhos & snacks",
      subtitle: "Clique para ver todos os produtos",
    },
    {
      slug: "doces",
      image: "/doces.jpeg",
      title: "Doces",
      subtitle: "Clique para ver todos os produtos",
    },
    {
      slug: "potes",
      image: "/pote.jpeg",
      title: "Potes",
      subtitle: "Clique para ver todos os produtos",
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
    <section className="carrossel" aria-label="Carrossel de ofertas">
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
                <h2>{slide.title}</h2>
                <p>{slide.subtitle}</p>
              </div>
            </Link>
          </article>
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
