import React, { Suspense, lazy, ComponentType } from 'react';

interface LazyComponentProps {
  component: () => Promise<{ default: ComponentType<any> }>;
  fallback?: React.ReactNode;
  props?: Record<string, any>;
}

const LazyComponent: React.FC<LazyComponentProps> = ({
  component,
  fallback = <div className="w-full h-40 bg-gray-100 animate-pulse rounded-md"></div>,
  props = {},
}) => {
  const LazyLoadedComponent = lazy(component);
  
  return (
    <Suspense fallback={fallback}>
      <LazyLoadedComponent {...props} />
    </Suspense>
  );
};

export default LazyComponent;