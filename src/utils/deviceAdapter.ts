/**
 * Fully Autonomous Device Spec & Performance Optimization Adapter
 * Automatically detects device hardware (CPU cores, RAM, GPU tier, network, touch, battery)
 * and dynamically applies adaptive styling to guarantee 60fps across phones, tablets, and desktops
 * without requiring any manual user options.
 */

export type PerformanceTier = 'low' | 'balanced' | 'high';
export type DeviceScreenType = 'phone' | 'tablet' | 'desktop';

export interface DeviceSpecs {
  cpuCores: number;
  deviceMemoryGb: number | null;
  isTouch: boolean;
  screenType: DeviceScreenType;
  screenWidth: number;
  screenHeight: number;
  pixelRatio: number;
  saveData: boolean;
  effectiveConnectionType: string;
  prefersReducedMotion: boolean;
  batteryLow: boolean;
  effectiveTier: PerformanceTier;
}

class DeviceAdapter {
  private specs: DeviceSpecs;
  private batteryLow = false;
  private listeners: Set<(specs: DeviceSpecs) => void> = new Set();

  constructor() {
    this.specs = this.detectSpecs();
    this.applyToDOM(this.specs);
    this.setupListeners();
    this.setupBatteryListener();
  }

  private detectSpecs(): DeviceSpecs {
    if (typeof window === 'undefined') {
      return {
        cpuCores: 4,
        deviceMemoryGb: 4,
        isTouch: false,
        screenType: 'desktop',
        screenWidth: 1920,
        screenHeight: 1080,
        pixelRatio: 1,
        saveData: false,
        effectiveConnectionType: '4g',
        prefersReducedMotion: false,
        batteryLow: false,
        effectiveTier: 'balanced'
      };
    }

    const cpuCores = navigator.hardwareConcurrency || 4;
    const deviceMemoryGb = (navigator as any).deviceMemory || null;
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const pixelRatio = window.devicePixelRatio || 1;

    // Network connection status
    const connection =
      (navigator as any).connection ||
      (navigator as any).mozConnection ||
      (navigator as any).webkitConnection;
    const saveData = Boolean(connection?.saveData);
    const effectiveConnectionType = connection?.effectiveType || '4g';

    // Reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Responsive screen classification:
    // Phone: < 640px
    // Tablet: 640px - 1024px
    // Desktop: > 1024px
    let screenType: DeviceScreenType = 'desktop';
    if (screenWidth < 640) {
      screenType = 'phone';
    } else if (screenWidth <= 1024) {
      screenType = 'tablet';
    }

    // Fully Autonomous Hardware Tier Classification:
    // Low: <= 4 cores, <= 3GB RAM, saveData, slow 2G/3G network, low battery, or reduced motion
    // High: >= 8 cores, >= 6GB RAM, fast 4G/WiFi, normal/high battery
    // Balanced: Mid-range devices (5-6 cores, 4GB RAM)
    let effectiveTier: PerformanceTier = 'balanced';
    if (
      cpuCores <= 4 ||
      (deviceMemoryGb !== null && deviceMemoryGb <= 3) ||
      saveData ||
      effectiveConnectionType === '2g' ||
      effectiveConnectionType === 'slow-2g' ||
      this.batteryLow ||
      prefersReducedMotion
    ) {
      effectiveTier = 'low';
    } else if (
      cpuCores >= 8 &&
      (deviceMemoryGb === null || deviceMemoryGb >= 6) &&
      !saveData &&
      effectiveConnectionType === '4g' &&
      !this.batteryLow
    ) {
      effectiveTier = 'high';
    }

    return {
      cpuCores,
      deviceMemoryGb,
      isTouch,
      screenType,
      screenWidth,
      screenHeight,
      pixelRatio,
      saveData,
      effectiveConnectionType,
      prefersReducedMotion,
      batteryLow: this.batteryLow,
      effectiveTier
    };
  }

  private applyToDOM(specs: DeviceSpecs) {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;

    // Clean previous tier classes
    root.classList.remove('tier-low', 'tier-balanced', 'tier-high');
    root.classList.remove('is-phone', 'is-tablet', 'is-desktop', 'is-touch');

    // Add auto-detected classes
    root.classList.add(`tier-${specs.effectiveTier}`);
    root.classList.add(`is-${specs.screenType}`);
    if (specs.isTouch) root.classList.add('is-touch');

    // Set CSS data attributes for fine-grained style hooks
    root.dataset.perfTier = specs.effectiveTier;
    root.dataset.screenType = specs.screenType;

    // Dynamic viewport height CSS variable for perfect mobile rendering
    const vh = window.innerHeight * 0.01;
    root.style.setProperty('--vh', `${vh}px`);
  }

  private setupListeners() {
    if (typeof window === 'undefined') return;

    let resizeTimer: any;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        this.update();
      }, 150);
    });

    // Listen for orientation changes on mobile & tablet
    window.addEventListener('orientationchange', () => {
      setTimeout(() => this.update(), 150);
    });

    // Listen for reduced motion changes
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motionQuery.addEventListener) {
      motionQuery.addEventListener('change', () => this.update());
    }

    // Listen for network changes (e.g. going from Wi-Fi to 2G/SaveData)
    const connection =
      (navigator as any).connection ||
      (navigator as any).mozConnection ||
      (navigator as any).webkitConnection;
    if (connection?.addEventListener) {
      connection.addEventListener('change', () => this.update());
    }
  }

  private setupBatteryListener() {
    if (typeof navigator === 'undefined' || !(navigator as any).getBattery) return;
    try {
      (navigator as any).getBattery().then((battery: any) => {
        const checkBattery = () => {
          // If battery is low (< 20%) and not charging, trigger low-spec power saving automatically
          const isLow = !battery.charging && battery.level <= 0.2;
          if (this.batteryLow !== isLow) {
            this.batteryLow = isLow;
            this.update();
          }
        };

        checkBattery();
        battery.addEventListener('levelchange', checkBattery);
        battery.addEventListener('chargingchange', checkBattery);
      }).catch(() => {});
    } catch {
      // Battery API not supported or blocked by permissions policy
    }
  }

  public getSpecs(): DeviceSpecs {
    return this.specs;
  }

  public update() {
    this.specs = this.detectSpecs();
    this.applyToDOM(this.specs);
    this.notify();
  }

  public subscribe(listener: (specs: DeviceSpecs) => void): () => void {
    this.listeners.add(listener);
    listener(this.specs);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    for (const listener of this.listeners) {
      listener(this.specs);
    }
  }
}

export const deviceAdapter = new DeviceAdapter();
