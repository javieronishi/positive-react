import type { HistoryItem } from "../types/phrase";

interface PhraseHistoryProps {
  items: HistoryItem[];
  onClear: () => void;
}

export function PhraseHistory({ items, onClear }: PhraseHistoryProps) {
  return (
    <section className="history-section" aria-label="Historial de frases">
      <div className="history-header">
        <div className="history-title-group">
          <h2>Historial reciente</h2>
          <span className="history-count-badge">{items.length}</span>
        </div>

        {items.length > 0 && (
          <button
            type="button"
            className="clear-btn"
            onClick={onClear}
            title="Borrar historial"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="icon-trash"
            >
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
            Limpiar
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="history-empty">
          <p>Aún no has descubierto ninguna frase en esta sesión.</p>
        </div>
      ) : (
        <ul className="history-list">
          {items.map((item, index) => (
            <li key={item.key} className="history-item">
              <div className="history-item-top">
                <span className="history-item-index">#{items.length - index}</span>
                <span className="history-item-time">{item.timestamp}</span>
              </div>
              <p className="history-item-text">“{item.phrase.text}”</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

