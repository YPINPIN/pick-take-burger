import { useRef, useState } from 'react';

function useCopy() {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number | null>(null);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);

      setCopied(true);

      // 清掉舊的 timeout（避免重複執行）
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error('copy failed', error);
    }
  };

  return { copied, handleCopy };
}

export default useCopy;
