import { useCallback, useEffect, useRef } from 'react';

interface UseIntersectionObserverOptions {
  onIntersect: () => void;
  enabled: boolean;
  rootMargin?: string;
}

export function useIntersectionObserver(
  options: UseIntersectionObserverOptions,
): React.RefCallback<HTMLElement> {
  const { onIntersect, enabled, rootMargin = '100px' } = options;
  const observerRef = useRef<IntersectionObserver | null>(null);
  const onIntersectRef = useRef(onIntersect);

  onIntersectRef.current = onIntersect;

  useEffect(() => {
    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  const ref = useCallback(
    (node: HTMLElement | null) => {
      observerRef.current?.disconnect();

      if (!node || !enabled) {
        return;
      }

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            onIntersectRef.current();
          }
        },
        { rootMargin },
      );

      observerRef.current.observe(node);
    },
    [enabled, rootMargin],
  );

  return ref;
}
