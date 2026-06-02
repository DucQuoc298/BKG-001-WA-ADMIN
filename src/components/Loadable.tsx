import { Suspense } from 'react';
import React from 'react';
// project imports
import Loader from './Loader';

// ==============================|| LOADABLE - LAZY LOADING ||============================== //

export default function Loadable(LazyComponent: React.LazyExoticComponent<React.ComponentType<any>>) {
  const LoadableComponent = (props: any) => (
    <Suspense
      fallback={
        <Loader />
      }
    >
      <LazyComponent {...props} />
    </Suspense>
  );
LoadableComponent.displayName = `Loadable(${(LazyComponent as any)?.displayName || (LazyComponent as any)?.name || 'Component'})`;
return LoadableComponent;
}
