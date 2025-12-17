'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react';
import { createPortal } from 'react-dom';
import '../../styles/toaster.css';

/* =========================
   Context
========================= */
const ToasterContext = createContext(null);

/* =========================
   외부에서 사용하는 API
========================= */
export const toaster = {
  create: () => {
    throw new Error('ToasterProvider로 앱을 감싸주세요.');
  },
};

/* =========================
   Provider + UI
========================= */
export function ToasterProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const create = useCallback((toast) => {
    const id = Date.now();

    setToasts((prev) => [...prev, { id, ...toast }]);

    // loading 제외 자동 닫힘
    if (toast.type !== 'loading') {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3000);
    }
  }, []);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // toaster.create 연결
  useEffect(() => {
    toaster.create = create;
  }, [create]);

  return (
    <ToasterContext.Provider value={{ toasts, remove }}>
      {children}

      {/* Toast UI */}
      {createPortal(
        <div className="toaster-container">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`toast toast-${toast.type}`}
            >
              <div className="toast-content">
                {toast.title && (
                  <div className="toast-title">{toast.title}</div>
                )}
                {toast.description && (
                  <div className="toast-desc">
                    {toast.description}
                  </div>
                )}
              </div>

              {toast.closable !== false && (
                <button
                  className="toast-close"
                  onClick={() => remove(toast.id)}
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>,
        document.body
      )}
    </ToasterContext.Provider>
  );
}

/* =========================
   Hook (선택)
========================= */
export function useToaster() {
  const ctx = useContext(ToasterContext);
  if (!ctx) {
    throw new Error('useToaster must be used within ToasterProvider');
  }
  return ctx;
}
