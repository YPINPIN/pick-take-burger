import { ColorRing } from 'react-loader-spinner';

import type { GlobalOverlayState } from '@/types/globalOverlay';

type GlobalOverlayProps = {
  overlayState: GlobalOverlayState;
};

function GlobalOverlay({ overlayState: { isOverlay, message } }: GlobalOverlayProps) {
  return (
    isOverlay && (
      <div className="global-overlay">
        <div className="text-center">
          <ColorRing visible={true} height="8rem" width="8rem" ariaLabel="color-ring-loading" wrapperStyle={{}} wrapperClass="color-ring-wrapper" colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']} />
          {message && <div className="fs-4 fw-bold text-white">{message}</div>}
        </div>
      </div>
    )
  );
}

export default GlobalOverlay;
