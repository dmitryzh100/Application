import { useCallback, useEffect, useState } from 'react';

import { ArrowUp } from 'lucide-react';

import { Button } from './button';

const SCROLL_THRESHOLD = 300;

export const ScrollToTop = (): React.ReactElement | null => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = (): void => {
      setVisible(window.scrollY > SCROLL_THRESHOLD);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = useCallback((): void => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <Button
      variant="success"
      size="icon"
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 z-50 !h-12 !w-12 rounded-full shadow-lg"
      aria-label="Scroll to top"
    >
      <ArrowUp className="h-5 w-5" />
    </Button>
  );
};
