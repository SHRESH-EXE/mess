/**
 * Device Spec Detection & Performance Optimization Adapter
 * Automatically detects device hardware (CPU cores, RAM, GPU tier, network, touch, battery)
 * and applies adaptive styling to guarantee 60fps on low-spec phones, tablets, and high-end desktops.
 */

export type PerformanceTier = 'low' | 'balanced' | 'high';
export type PerformanceMode = 'auto' | 'battery_saver' | 'ultra';
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
  detectedTier: PerformanceTier;
  activeMode: PerformanceMode;
  effectiveTier: PerformanceTier;
}

const STORAGE_KEY = 'lpu_dining_perf_mode';

class DeviceAdapter {
  private specs: DeviceSpecs;
  private listeners: Set<(specs: DeviceSpecs) => void> = new Set();

  constructor() {
    this.specs = this.detectSpecs();
    this.applyToDOM(this.specs.effectiveTier, this.specs.screenType, this.specs.isTouch);
    this.setupListeners();
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
        detectedTier: 'balanced',
        activeMode: 'auto',
        effectiveTier: 'balanced'
      };
    }

    const cpuCores = navigator.hardwareConcurrency || 4;
    const deviceMemoryGb = (navigator as any).deviceMemory || null;
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const pixelRatio = window.devicePixelRatio || 1;

    // Network connection checks
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    const saveData = Boolean(connection?.saveData);
    const effectiveConnectionType = connection?.effectiveType || '4g';

    // Reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Responsive screen classification:
    // Phone: < 640px
    // Tablet: 640px - 1024px (or mobile device with tablet width)
    // Desktop: > 1024px
    let screenType: DeviceScreenType = 'desktop';
    if (screenWidth < 640) {
      screenType = 'phone';
    } else if (screenWidth <= 1024) {
      screenType = 'tablet';
    }

    // Hardware Tier Classification:
    // Low: <= 4 cores, <= 3GB RAM, saveData, slow network, or reduced motion
    // High: >= 8 cores, >= 6GB RAM, high pixel ratio, desktop/high-end phone
    // Balanced: Mid-range devices (5-6 cores, 4GB RAM)
    let detectedTier: PerformanceTier = 'balanced';
    if (
      cpuCores <= 4 ||
      (deviceMemoryGb !== null && deviceMemoryGb <= 3) ||
      saveData ||
      effectiveConnectionType === '2g' ||
      effectiveConnectionType === 'slow-2g' ||
      prefersReducedMotion
    ) {
      detectedTier = 'low';
    } else if (
      cpuCores >= 8 &&
      (deviceMemoryGb === null || deviceMemoryGb >= 6) &&
      !saveData &&
      effectiveConnectionType === '4g'
    ) {
      detectedTier = 'high';
    }

    // User Saved Mode Override
    const savedMode = (localStorage.getItem(STORAGE_KEY) as PerformanceMode) || 'auto';
    let effectiveTier = detectedTier;
    if (savedMode === 'battery_saver') {
      effectiveTier = 'low';
    } else if (savedMode === 'ultra') {
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
      detectedTier,
      activeMode: savedMode,
      effectiveTier
    };
  }

  private applyToDOM(tier: PerformanceTier, screen: DeviceScreenType, isTouch: boolean) {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;

    // Clean previous tier classes
    root.classList.remove('tier-low', 'tier-balanced', 'tier-high');
    root.classList.remove('is-phone', 'is-tablet', 'is-desktop', 'is-touch');

    // Add current classes
    root.classList.add(`tier-${tier}`);
    root.classList.add(`is-${screen}`);
    if (isTouch) root.classList.add('is-touch');

    // Set CSS data attribute for fine-grained style hooks
    root.dataset.perfTier = tier;
    root.dataset.screenType = screen;
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

    // Listen for orientation change
    window.addEventListener('orientationchange', () => {
      setTimeout(() => this.update(), 150);
    });

    // Listen for reduced motion changes
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motionQuery.addEventListener) {
      motionQuery.addEventListener('change', () => this.update());
    }
  }

  public getSpecs(): DeviceSpecs {
    return this.specs;
  }

  public setMode(mode: PerformanceMode) {
    localStorage.setItem(STORAGE_KEY, mode);
    this.update();
  }

  public update() {
    this.specs = this.detectSpecs();
    this.applyToDOM(this.specs.effectiveTier, this.specs.screenType, this.specs.isTouch);
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
