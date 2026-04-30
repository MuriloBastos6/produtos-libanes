const WHATSAPP_NUMBER = "551133132333";
const WHATSAPP_MESSAGE = "Ola! Vim pelo site e gostaria de mais informacoes.";

function WhatsAppButton() {
  const link = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

  return (
    <a
      className="whatsapp-float"
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      title="Falar no WhatsApp"
    >
      <svg
        viewBox="0 0 32 32"
        role="img"
        aria-hidden="true"
        className="whatsapp-icon"
      >
        <path
          fill="currentColor"
          d="M19.11 17.2c-.27-.14-1.6-.79-1.85-.88-.25-.09-.43-.14-.62.14-.18.27-.7.88-.86 1.06-.16.18-.32.2-.59.07-.27-.14-1.14-.42-2.17-1.34-.81-.72-1.36-1.61-1.52-1.88-.16-.27-.02-.41.12-.55.13-.13.27-.34.41-.5.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.14-.62-1.49-.85-2.04-.23-.55-.46-.47-.62-.48h-.53c-.18 0-.48.07-.73.34-.25.27-.96.94-.96 2.3 0 1.36.98 2.67 1.12 2.85.14.18 1.93 2.95 4.69 4.14.66.28 1.17.45 1.57.58.66.21 1.27.18 1.75.11.53-.08 1.6-.65 1.82-1.27.23-.62.23-1.15.16-1.27-.07-.11-.25-.18-.52-.32z"
        />
        <path
          fill="currentColor"
          d="M16.02 3.2c-7.04 0-12.74 5.69-12.74 12.71 0 2.24.59 4.43 1.7 6.35L3.2 28.8l6.72-1.76a12.8 12.8 0 0 0 6.1 1.55h.01c7.03 0 12.73-5.69 12.73-12.71 0-3.4-1.32-6.6-3.72-9-2.4-2.4-5.59-3.68-9.02-3.68zm0 23.22h-.01a10.55 10.55 0 0 1-5.37-1.47l-.39-.23-3.99 1.05 1.06-3.89-.25-.4a10.48 10.48 0 0 1-1.61-5.62c0-5.8 4.73-10.53 10.56-10.53 2.81 0 5.46 1.09 7.45 3.06a10.43 10.43 0 0 1 3.09 7.45c0 5.81-4.74 10.54-10.54 10.54z"
        />
      </svg>
    </a>
  );
}

export default WhatsAppButton;
