import { useState, useEffect } from 'react';
import { deviceAdapter, DeviceSpecs, PerformanceMode } from '../utils/deviceAdapter';

export function useDeviceSpecs(): {
  specs: DeviceSpecs;
  setPerformanceMode: (mode: PerformanceMode) => void;
  isPhone: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLowSpec: boolean;
} {
  const [specs, setSpecs] = useState<DeviceSpecs>(() => deviceAdapter.getSpecs());

  useEffect(() => {
    const unsubscribe = deviceAdapter.subscribe((updated) => {
      setSpecs({ ...updated });
    });
    return unsubscribe;
  }, []);

  return {
    specs,
    setPerformanceMode: (mode: PerformanceMode) => deviceAdapter.setMode(mode),
    isPhone: specs.screenType === 'phone',
    isTablet: specs.screenType === 'tablet',
    isDesktop: specs.screenType === 'desktop',
    isLowSpec: specs.effectiveTier === 'low'
  };
}
