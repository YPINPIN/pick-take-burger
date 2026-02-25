import type { GlobalOverlayState } from '@/types/globalOverlay';

type GlobalOverlayProps = {
  overlayState: GlobalOverlayState;
};

function GlobalOverlay({ overlayState: { isOverlay, message } }: GlobalOverlayProps) {
  return (
    isOverlay && (
      <div className="global-overlay">
        <div className="text-center text-accent">
          <div className="spinner-border mb-3" style={{ width: '5rem', height: '5rem', borderWidth: '10px' }} role="status" />
          {message && <div className="fs-4 fw-bold">{message}</div>}
        </div>
      </div>
    )
  );
}

export default GlobalOverlay;
