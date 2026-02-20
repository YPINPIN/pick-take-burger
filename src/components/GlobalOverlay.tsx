type GlobalOverlayProps = {
  isOverlay: boolean;
  message: string;
};

function GlobalOverlay({ isOverlay, message }: GlobalOverlayProps) {
  return (
    isOverlay && (
      <div className="global-overlay">
        <div className="text-center text-accent">
          <div className="spinner-border mb-3" style={{ width: '5rem', height: '5rem', borderWidth: '10px' }} role="status" />
          <div className="fs-4 fw-bold">{message || '處理中...'}</div>
        </div>
      </div>
    )
  );
}

export default GlobalOverlay;
