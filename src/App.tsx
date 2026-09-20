import { useEffect, useState, useCallback } from "react";
import "./App.css";
import { Loading } from "./components/Loading";
import type { Phrase, HistoryItem } from "./types/phrase";
import { PhraseCard } from "./components/PhraseCard";
import { getPhrase } from "./services/phrase.service";
import { PhraseHistory } from "./components/PhraseHistory";

function formatTimestamp(): string {
  return new Intl.DateTimeFormat("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date());
}

function App() {
  const [phrase, setPhrase] = useState<Phrase | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [count, setCount] = useState<number>(0);

  const fetchPhrase = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const newPhrase = await getPhrase();
      setPhrase(newPhrase);
      setCount((prev) => prev + 1);

      const newItem: HistoryItem = {
        key: `${newPhrase.id}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        phrase: newPhrase,
        timestamp: formatTimestamp(),
      };

      setHistory((prev) => [newItem, ...prev]);
    } catch (err) {
      console.error(err);
      setError("No se pudo conectar con la API de frases. Por favor, intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Carga inicial
  useEffect(() => {
    let ignore = false;

    const loadInitial = async () => {
      try {
        const newPhrase = await getPhrase();
        if (!ignore) {
          setPhrase(newPhrase);
          setCount(1);
          setHistory([
            {
              key: `${newPhrase.id}-${Date.now()}`,
              phrase: newPhrase,
              timestamp: formatTimestamp(),
            },
          ]);
        }
      } catch (err) {
        if (!ignore) {
          console.error(err);
          setError("No se pudo conectar con la API de frases. Intenta de nuevo.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadInitial();

    return () => {
      ignore = true;
    };
  }, []);

  // Atajo de teclado: Barra espaciadora para nueva frase
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.code === "Space" &&
        document.activeElement?.tagName !== "BUTTON" &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        event.preventDefault();
        if (!loading) {
          fetchPhrase();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [loading, fetchPhrase]);

  return (
    <div className="app-layout">
      <div className="ambient-background" />

      <main className="app-container">
        <header className="header">
          <div className="pill-badge">
            <span className="pill-dot" />
            <span>Inspira tu día</span>
          </div>
          <h1 className="title">Frases Positivas</h1>
          <p className="subtitle">
            Reflexiones y dosis instantáneas de motivación para transformar tu perspectiva.
          </p>

          <div className="metrics-chip">
            <svg
              className="icon-flame"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
            </svg>
            <span>Frases exploradas:</span>
            <strong>{count}</strong>
          </div>
        </header>

        <section className="quote-display-area">
          {loading && <Loading />}

          {!loading && error && (
            <div className="error-card" role="alert">
              <div className="error-icon-wrapper">
                <svg
                  className="icon-alert"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <p className="error-message">{error}</p>
              <button
                type="button"
                className="retry-btn"
                onClick={() => fetchPhrase()}
              >
                Reintentar
              </button>
            </div>
          )}

          {!loading && !error && phrase && <PhraseCard phrase={phrase} />}
        </section>

        <div className="action-panel">
          <button
            type="button"
            className="action-btn-primary"
            onClick={fetchPhrase}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="btn-spinner" />
                <span>Buscando...</span>
              </>
            ) : (
              <>
                <svg
                  className="btn-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="23 4 23 10 17 10" />
                  <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                </svg>
                <span>Nueva frase</span>
              </>
            )}
          </button>
          <span className="keyboard-hint">
            Presiona <kbd>Espacio</kbd> para generar otra
          </span>
        </div>

        <PhraseHistory items={history} onClear={() => setHistory([])} />

        <footer className="footer">
          <p>Potenciado por positive-api.online • Creado con React & Vite</p>
        </footer>
      </main>
    </div>
  );
}

export default App;

