import { useCallback, useEffect, useRef, useState } from 'react';

function useToast() {
  const [toast, setToast] = useState({ message: '', tone: 'success' });
  const timerRef = useRef(null);

  const showToast = useCallback((message, tone = 'success') => {
    setToast({ message, tone });

    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
    }

    timerRef.current = window.setTimeout(() => {
      setToast({ message: '', tone: 'success' });
    }, 3000);
  }, []);

  useEffect(
    () => () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    },
    [],
  );

  return { toast, showToast, setToast };
}

export default useToast;