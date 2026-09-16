import { useState, useEffect } from 'react';
import { deviceAdapter, DeviceSpecs } from '../utils/deviceAdapter';

export function useDeviceSpecs(): {
  specs: DeviceSpecs;
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
    isPhone: specs.screenType === 'phone',
    isTablet: specs.screenType === 'tablet',
    isDesktop: specs.screenType === 'desktop',
    isLowSpec: specs.effectiveTier === 'low'
  };
}
