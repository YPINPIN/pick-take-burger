import { useAppSelector } from '@/store';
import { motion, AnimatePresence } from 'motion/react';

function ToastContainer() {
  const toastMessages = useAppSelector((state) => state.toast);

  return (
    <div className="toast-container position-fixed top-0 end-0 p-3">
      <AnimatePresence>
        {toastMessages.map((toast) => (
          <motion.div key={toast.id} layout initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 100 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }} className={`toast show align-items-center text-white bg-toast-${toast.type} border-0`} role="alert" aria-live="assertive" aria-atomic="true">
            <div className="d-flex align-items-center">
              {toast.type === 'success' && <i className="bi bi-check-circle-fill fs-4 lh-1 ms-3"></i>}
              {toast.type === 'error' && <i className="bi bi-exclamation-circle-fill fs-4 lh-1 ms-3"></i>}
              {toast.type === 'info' && <i className="bi bi-info-circle-fill fs-4 lh-1 ms-3"></i>}

              <div className="toast-body">{toast.message}</div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export default ToastContainer;
