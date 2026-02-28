import { ComponentType, lazy, ReactElement, Suspense } from 'react';

import { LoadingSpinner } from '@/shared/components/ui/loading-spinner';

export function withLazyLoad<M, Props extends object>(
  factory: () => Promise<M>,
  selector: (mod: M) => ComponentType<Props>,
): ComponentType<Props> {
  const LazyComponent = lazy(() => factory().then((mod) => ({ default: selector(mod) })));

  return function WithLazyLoad(props: Props): ReactElement {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
}
