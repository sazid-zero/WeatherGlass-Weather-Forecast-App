import React from 'react';
import { LocationContext, useLocationStateManager } from '@/hooks/use-location-state';

interface LocationProviderProps {
  children: React.ReactNode;
}

export function LocationProvider({ children }: LocationProviderProps) {
  const locationManager = useLocationStateManager();
  
  return (
    <LocationContext.Provider value={locationManager}>
      {children}
    </LocationContext.Provider>
  );
}