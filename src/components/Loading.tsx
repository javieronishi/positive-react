export function Loading() {
  return (
    <div className="loading" role="status" aria-live="polite">
      <div className="spinner-wrapper">
        <span className="spinner" />
        <span className="spinner-glow" />
      </div>
      <p className="loading-text">Buscando inspiración...</p>
    </div>
  );
}

