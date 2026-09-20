import { useState } from "react";
import type { Phrase } from "../types/phrase";

interface PhraseCardProps {
  phrase: Phrase;
}

export function PhraseCard({ phrase }: PhraseCardProps) {
  const [copied, setCopied] = useState(false);
  const supportsNativeShare =
    typeof navigator !== "undefined" && typeof navigator.share === "function";


  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(`"${phrase.text}"`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = `"${phrase.text}"`;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  }

  function handleShareWhatsApp() {
    const text = encodeURIComponent(`"${phrase.text}"\n\n✨ Compartido desde Frases Positivas`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank", "noopener,noreferrer");
  }

  function handleShareX() {
    const text = encodeURIComponent(`"${phrase.text}"`);
    const hashtags = encodeURIComponent("FrasesPositivas,Inspiracion");
    window.open(
      `https://x.com/intent/tweet?text=${text}&hashtags=${hashtags}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  function handleShareTelegram() {
    const text = encodeURIComponent(`"${phrase.text}" — Frases Positivas`);
    window.open(`https://t.me/share/url?text=${text}&url=${encodeURIComponent(window.location.href)}`, "_blank", "noopener,noreferrer");
  }

  async function handleNativeShare() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Frase Positiva",
          text: `"${phrase.text}"`,
          url: window.location.href,
        });
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.error("Error al compartir:", err);
        }
      }
    }
  }

  return (
    <article className="phrase-card">
      <div className="quote-wrapper">
        <span className="quote-mark open-quote">“</span>
        <blockquote className="phrase-text">{phrase.text}</blockquote>
        <span className="quote-mark close-quote">”</span>
      </div>

      <div className="card-footer">
        <span className="phrase-meta">Frase #{phrase.id}</span>

        <div className="share-actions" aria-label="Acciones y compartir">
          <button
            type="button"
            onClick={handleCopy}
            className={`copy-btn ${copied ? "copied" : ""}`}
            title="Copiar frase al portapapeles"
            aria-label="Copiar frase al portapapeles"
          >
            {copied ? (
              <>
                <svg
                  className="icon-check"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>¡Copiado!</span>
              </>
            ) : (
              <>
                <svg
                  className="icon-copy"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                <span>Copiar</span>
              </>
            )}
          </button>

          <span className="share-divider" aria-hidden="true" />

          <button
            type="button"
            onClick={handleShareWhatsApp}
            className="social-btn whatsapp-btn"
            title="Compartir en WhatsApp"
            aria-label="Compartir en WhatsApp"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="social-icon">
              <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm5.8 14.18c-.24.67-1.39 1.29-1.92 1.37-.49.08-1.12.11-3.26-.77-2.57-1.06-4.23-3.67-4.36-3.84-.13-.17-1.04-1.39-1.04-2.65s.66-1.88.89-2.14c.24-.25.52-.32.7-.32.17 0 .35.01.5.01.16.01.38-.06.59.45.22.52.75 1.83.82 1.96.07.13.11.29.02.47-.09.17-.14.28-.27.44-.13.16-.28.35-.4.47-.13.13-.27.28-.12.54.15.26.69 1.13 1.47 1.83 1.01.9 1.86 1.18 2.12 1.31.27.13.42.11.58-.07.16-.17.68-.79.86-1.06.18-.26.36-.22.61-.13.25.09 1.58.74 1.85.88.27.13.45.2.52.31.07.12.07.7-.17 1.37z" />
            </svg>
          </button>

          <button
            type="button"
            onClick={handleShareX}
            className="social-btn x-btn"
            title="Compartir en X"
            aria-label="Compartir en X"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="social-icon">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </button>

          <button
            type="button"
            onClick={handleShareTelegram}
            className="social-btn telegram-btn"
            title="Compartir en Telegram"
            aria-label="Compartir en Telegram"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="social-icon">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .35z" />
            </svg>
          </button>

          {supportsNativeShare && (
            <button
              type="button"
              onClick={handleNativeShare}
              className="social-btn native-share-btn"
              title="Más opciones para compartir"
              aria-label="Más opciones para compartir"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="social-icon"
              >
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </article>
  );
}



