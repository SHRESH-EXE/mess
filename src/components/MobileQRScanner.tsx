import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import {
  Camera,
  QrCode,
  Barcode,
  Smartphone,
  Tablet,
  CheckCircle2,
  Copy,
  ExternalLink,
  RotateCcw,
  X,
  AlertTriangle,
  Zap,
  Flashlight,
  ShieldCheck,
  Check,
  Laptop,
  SwitchCamera,
  Upload,
  RefreshCw,
  Sparkles,
  Info
} from 'lucide-react';

/**
 * Universal Mobile/Tablet Detection:
 * - Detects iOS, iPadOS (MacIntel touch), Android, Windows Mobile
 * - Checks maxTouchPoints > 0
 * - Checks viewport width
 */
export function checkIsMobileOrTablet(): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;

  const isSmallScreen = window.innerWidth < 1024;
  const hasTouch =
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    ((navigator as unknown as { msMaxTouchPoints?: number }).msMaxTouchPoints ?? 0) > 0;

  const userAgent = navigator.userAgent || (navigator as unknown as { vendor?: string }).vendor || '';
  
  // Mobile / Tablet regex check
  const isMobileUserAgent =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|Tablet|Silk|Kindle/i.test(userAgent);
  const isIPadOS = /Macintosh/i.test(userAgent) && hasTouch;

  return isMobileUserAgent || isIPadOS || hasTouch || isSmallScreen;
}

export type ScanModeType = 'all' | 'qr' | 'barcode';

export interface MobileQRScannerProps {
  onScanSuccess?: (decodedText: string, format?: string) => void;
  onClose?: () => void;
  title?: string;
  description?: string;
  allowDesktopOverride?: boolean;
  autoStart?: boolean;
  initialMode?: ScanModeType;
}

export const MobileQRScanner: React.FC<MobileQRScannerProps> = ({
  onScanSuccess,
  onClose,
  title = 'Live QR & Barcode Scanner',
  description = 'Scan student passes, meal tokens, ID barcodes, or web links',
  allowDesktopOverride = true,
  autoStart = true,
  initialMode = 'all'
}) => {
  // Device Detection State
  const [isMobileOrTablet, setIsMobileOrTablet] = useState<boolean>(() => checkIsMobileOrTablet());
  const [desktopBypass, setDesktopBypass] = useState<boolean>(false);

  // Scanner Configuration States
  const [scanMode, setScanMode] = useState<ScanModeType>(initialMode);
  const [isScannerRunning, setIsScannerRunning] = useState<boolean>(false);
  const [isLoadingCamera, setIsLoadingCamera] = useState<boolean>(false);
  const [cameraFacing, setCameraFacing] = useState<'environment' | 'user'>('environment');
  const [availableCameras, setAvailableCameras] = useState<Array<{ id: string; label: string }>>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string | null>(null);

  // Error & Status States
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [permissionDenied, setPermissionDenied] = useState<boolean>(false);
  const [torchAvailable, setTorchAvailable] = useState<boolean>(false);
  const [torchOn, setTorchOn] = useState<boolean>(false);

  // Results State
  const [scannedResult, setScannedResult] = useState<string | null>(null);
  const [scannedFormat, setScannedFormat] = useState<string | null>(null);
  const [hasCopied, setHasCopied] = useState<boolean>(false);

  // Unique Scanner Element ID to prevent DOM conflicts
  const scannerElementId = useRef(`reader-${Math.random().toString(36).substring(2, 9)}`).current;
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const isStoppingRef = useRef<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Listen to window resizing / orientation change for responsive device check
  useEffect(() => {
    const handleResize = () => {
      setIsMobileOrTablet(checkIsMobileOrTablet());
    };
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  // Determine formats to scan based on mode
  const getSupportedFormats = useCallback((mode: ScanModeType): Html5QrcodeSupportedFormats[] => {
    if (mode === 'qr') {
      return [Html5QrcodeSupportedFormats.QR_CODE];
    }
    if (mode === 'barcode') {
      return [
        Html5QrcodeSupportedFormats.CODE_128,
        Html5QrcodeSupportedFormats.CODE_39,
        Html5QrcodeSupportedFormats.CODE_93,
        Html5QrcodeSupportedFormats.EAN_13,
        Html5QrcodeSupportedFormats.EAN_8,
        Html5QrcodeSupportedFormats.UPC_A,
        Html5QrcodeSupportedFormats.UPC_E,
        Html5QrcodeSupportedFormats.ITF,
        Html5QrcodeSupportedFormats.CODABAR
      ];
    }
    // 'all': QR + 1D Barcodes + 2D Data Matrix
    return [
      Html5QrcodeSupportedFormats.QR_CODE,
      Html5QrcodeSupportedFormats.CODE_128,
      Html5QrcodeSupportedFormats.CODE_39,
      Html5QrcodeSupportedFormats.CODE_93,
      Html5QrcodeSupportedFormats.EAN_13,
      Html5QrcodeSupportedFormats.EAN_8,
      Html5QrcodeSupportedFormats.UPC_A,
      Html5QrcodeSupportedFormats.UPC_E,
      Html5QrcodeSupportedFormats.ITF,
      Html5QrcodeSupportedFormats.DATA_MATRIX,
      Html5QrcodeSupportedFormats.CODABAR,
      Html5QrcodeSupportedFormats.AZTEC,
      Html5QrcodeSupportedFormats.PDF_417
    ];
  }, []);

  // Stop camera stream cleanly
  const stopScanner = useCallback(async () => {
    if (isStoppingRef.current) return;
    isStoppingRef.current = true;

    try {
      if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
        await html5QrCodeRef.current.stop();
      }
    } catch (err) {
      console.warn('Notice while stopping scanner:', err);
    } finally {
      setIsScannerRunning(false);
      setIsLoadingCamera(false);
      setTorchOn(false);
      setTorchAvailable(false);
      isStoppingRef.current = false;
    }
  }, []);

  // Handle successful code decode
  const handleDecodedCode = useCallback((decodedText: string, decodedResult: unknown) => {
    const text = decodedText.trim();
    if (!text) return;

    // Haptic feedback
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate([40, 60, 40]);
      } catch {
        // ignore
      }
    }

    const formatName = (decodedResult as { result?: { format?: { formatName?: string } } })?.result?.format?.formatName || 'QR/Barcode';

    setScannedResult(text);
    setScannedFormat(formatName);
    stopScanner();

    if (onScanSuccess) {
      onScanSuccess(text, formatName);
    }
  }, [stopScanner, onScanSuccess]);

  // Start Camera Stream
  const startScanner = useCallback(
    async (targetCameraFacing: 'environment' | 'user' = cameraFacing, targetCameraId?: string) => {
      await stopScanner();

      setCameraError(null);
      setPermissionDenied(false);
      setScannedResult(null);
      setHasCopied(false);
      setIsLoadingCamera(true);

      // Verify browser support for camera
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError(
          'Camera API is not supported in this browser. Please ensure you are viewing over HTTPS and open in Safari/Chrome.'
        );
        setIsLoadingCamera(false);
        return;
      }

      try {
        // Query available camera devices if not fetched yet
        try {
          const devices = await Html5Qrcode.getCameras();
          if (devices && devices.length > 0) {
            setAvailableCameras(devices.map((d) => ({ id: d.id, label: d.label || `Camera ${d.id}` })));
          }
        } catch {
          // non-critical if enumerateDevices fails before permission
        }

        // Initialize or reuse Html5Qrcode instance
        if (!html5QrCodeRef.current) {
          html5QrCodeRef.current = new Html5Qrcode(scannerElementId, {
            formatsToSupport: getSupportedFormats(scanMode),
            verbose: false
          });
        }

        const formats = getSupportedFormats(scanMode);

        // Aspect ratio and qrbox sizing
        const qrboxSize = scanMode === 'barcode' 
          ? { width: 280, height: 140 } 
          : { width: 240, height: 240 };

        const config = {
          fps: 15,
          qrbox: qrboxSize,
          aspectRatio: 1.3333,
          formatsToSupport: formats,
          showTorchButtonIfSupported: true
        };

        // Select camera source: specific ID or facingMode
        const cameraConfig = targetCameraId
          ? { deviceId: { exact: targetCameraId } }
          : { facingMode: targetCameraFacing };

        await html5QrCodeRef.current.start(
          cameraConfig,
          config,
          (decodedText, result) => {
            handleDecodedCode(decodedText, result);
          },
          () => {
            // Frame scanned, no QR detected in this frame - normal operation
          }
        );

        setIsScannerRunning(true);
        setIsLoadingCamera(false);

        // Check if torch/flashlight is supported
        try {
          const capabilities = html5QrCodeRef.current.getRunningTrackCameraCapabilities();
          if (capabilities && (capabilities as { torchFeature?: () => { isSupported: () => boolean } }).torchFeature?.().isSupported()) {
            setTorchAvailable(true);
          }
        } catch {
          // ignore
        }
      } catch (err: unknown) {
        console.warn('Camera start error:', err);
        const error = err as { name?: string; message?: string };
        const msg = typeof err === 'string' ? err : error.message || '';

        if (
          error.name === 'NotAllowedError' ||
          error.name === 'PermissionDeniedError' ||
          msg.includes('Permission') ||
          msg.includes('NotAllowedError')
        ) {
          setPermissionDenied(true);
          setCameraError(
            'Camera permission was denied. Tap the lock icon in your browser address bar to allow Camera access.'
          );
        } else if (error.name === 'NotFoundError' || msg.includes('DevicesNotFoundError')) {
          setCameraError('No camera found on this device. You can still scan by uploading an image or photo.');
        } else if (error.name === 'NotReadableError' || msg.includes('TrackStartError')) {
          setCameraError('Camera is currently in use by another app. Please close other camera tabs/apps and retry.');
        } else {
          setCameraError(msg || 'Unable to access camera. Please check your camera permissions.');
        }

        setIsScannerRunning(false);
        setIsLoadingCamera(false);
      }
    },
    [cameraFacing, scanMode, getSupportedFormats, handleDecodedCode, scannerElementId, stopScanner]
  );

  // Toggle Camera Facing (Front ⇋ Back)
  const handleSwitchFacing = async () => {
    const nextFacing = cameraFacing === 'environment' ? 'user' : 'environment';
    setCameraFacing(nextFacing);
    setSelectedCameraId(null);
    await startScanner(nextFacing);
  };

  // Toggle Torch/Flashlight
  const handleToggleTorch = async () => {
    if (!html5QrCodeRef.current || !html5QrCodeRef.current.isScanning) return;
    try {
      const nextTorch = !torchOn;
      await html5QrCodeRef.current.applyVideoConstraints({
        advanced: [{ torch: nextTorch }]
      });
      setTorchOn(nextTorch);
    } catch (err) {
      console.warn('Torch toggle not supported on this track:', err);
    }
  };

  // Change scan mode (QR vs Barcode vs All)
  const handleChangeScanMode = async (newMode: ScanModeType) => {
    setScanMode(newMode);
    // Destroy instance to recreate with new format constraints
    await stopScanner();
    if (html5QrCodeRef.current) {
      try {
        html5QrCodeRef.current.clear();
      } catch {
        // ignore
      }
      html5QrCodeRef.current = null;
    }
    setTimeout(() => {
      startScanner(cameraFacing, selectedCameraId || undefined);
    }, 150);
  };

  // Fallback: Scan QR/Barcode from an uploaded image or camera snapshot
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCameraError(null);
    setIsLoadingCamera(true);

    try {
      if (!html5QrCodeRef.current) {
        html5QrCodeRef.current = new Html5Qrcode(scannerElementId, {
          formatsToSupport: getSupportedFormats(scanMode),
          verbose: false
        });
      }

      const decodedResult = await html5QrCodeRef.current.scanFile(file, true);
      if (decodedResult) {
        handleDecodedCode(decodedResult, { result: { format: { formatName: 'Image Scan' } } });
      }
    } catch (err) {
      console.warn('Image scan failed:', err);
      setCameraError('No QR code or Barcode detected in the image. Please ensure the code is well-lit and clear.');
    } finally {
      setIsLoadingCamera(false);
      e.target.value = '';
    }
  };

  // Auto-start camera when rendered on mobile/tablet or when bypass is active
  useEffect(() => {
    const effectiveIsMobile = isMobileOrTablet || desktopBypass;
    if (autoStart && effectiveIsMobile && !scannedResult) {
      const timer = setTimeout(() => {
        startScanner();
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [autoStart, isMobileOrTablet, desktopBypass, scannedResult, startScanner]);

  // Page Visibility API - Pause camera on tab blur, resume on focus
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (isScannerRunning) {
          stopScanner();
        }
      } else {
        if (!scannedResult && (isMobileOrTablet || desktopBypass)) {
          startScanner();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isScannerRunning, scannedResult, isMobileOrTablet, desktopBypass, startScanner, stopScanner]);

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      if (html5QrCodeRef.current) {
        try {
          if (html5QrCodeRef.current.isScanning) {
            html5QrCodeRef.current.stop().then(() => {
              html5QrCodeRef.current?.clear();
            });
          } else {
            html5QrCodeRef.current.clear();
          }
        } catch {
          // ignore cleanup errors
        }
      }
    };
  }, []);

  // Utility to check URL
  const isUrl = (str: string) => {
    try {
      return /^https?:\/\//i.test(str);
    } catch {
      return false;
    }
  };

  // Clipboard copy
  const handleCopyText = async () => {
    if (!scannedResult) return;
    try {
      await navigator.clipboard.writeText(scannedResult);
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 2500);
    } catch (err) {
      console.warn('Clipboard copy failed:', err);
    }
  };

  const effectiveIsMobile = isMobileOrTablet || desktopBypass;

  // -------------------------------------------------------------
  // VIEW A: DESKTOP / LAPTOP RESTRICTION & WEBCAM SIMULATION VIEW
  // -------------------------------------------------------------
  if (!effectiveIsMobile) {
    return (
      <div
        id="desktop-device-notice"
        className="w-full max-w-md mx-auto bg-slate-900 text-slate-100 rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-2xl text-center space-y-5 animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto shadow-inner">
          <Smartphone className="w-8 h-8 animate-pulse" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[11px] font-medium border border-slate-700">
            <Laptop className="w-3.5 h-3.5 text-slate-400" />
            <span>Desktop Detected</span>
          </div>
          <h3 className="text-lg font-bold text-white font-serif">
            Optimized for Mobile &amp; Tablet
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
            This QR &amp; Barcode scanner uses your device&apos;s back camera to instantly scan passes, tokens, and barcodes.
          </p>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 text-left space-y-2 text-xs text-slate-300">
          <div className="flex items-center space-x-2 text-amber-400 font-semibold">
            <Tablet className="w-4 h-4" />
            <span>Quick Options:</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px]">
            <li>Open this URL on your iPhone, iPad, or Android phone to scan live.</li>
            <li>Or test with your computer&apos;s webcam / upload an image below.</li>
          </ul>
        </div>

        {/* Desktop Testing Override & File Upload */}
        <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
          {allowDesktopOverride && (
            <button
              onClick={() => {
                setDesktopBypass(true);
                setTimeout(() => startScanner(), 100);
              }}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Use Computer Webcam</span>
            </button>
          )}

          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload QR / Barcode Image</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="w-full py-2 bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Close Notice
          </button>
        )}
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW B: LIVE MOBILE / TABLET QR & BARCODE SCANNER
  // -------------------------------------------------------------
  return (
    <div
      id="mobile-qr-scanner-card"
      className="w-full max-w-md mx-auto bg-slate-900 text-slate-100 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col animate-in fade-in duration-200"
    >
      {/* Hidden File Input for Image Upload / Snapshot fallback */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Header */}
      <div className="px-5 py-3.5 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30">
            {scanMode === 'barcode' ? <Barcode className="w-5 h-5" /> : <QrCode className="w-5 h-5" />}
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>{title}</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono uppercase">
                {isScannerRunning ? 'Live' : 'Ready'}
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">{description}</p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={() => {
              stopScanner();
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Mode Selector Tabs: Dual (All) vs QR Code vs 1D Barcode */}
      <div className="px-4 py-2 bg-slate-950/60 border-b border-slate-800/80 flex items-center justify-between gap-1.5">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider hidden xs:inline">
          Format:
        </span>
        <div className="grid grid-cols-3 gap-1.5 flex-1 max-w-xs text-xs font-semibold">
          <button
            onClick={() => handleChangeScanMode('all')}
            className={`py-1 px-2 rounded-lg text-center transition-all cursor-pointer ${
              scanMode === 'all'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                : 'bg-slate-800/70 text-slate-400 hover:text-slate-200'
            }`}
          >
            All Codes
          </button>
          <button
            onClick={() => handleChangeScanMode('qr')}
            className={`py-1 px-2 rounded-lg text-center transition-all cursor-pointer ${
              scanMode === 'qr'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                : 'bg-slate-800/70 text-slate-400 hover:text-slate-200'
            }`}
          >
            QR Only
          </button>
          <button
            onClick={() => handleChangeScanMode('barcode')}
            className={`py-1 px-2 rounded-lg text-center transition-all cursor-pointer ${
              scanMode === 'barcode'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                : 'bg-slate-800/70 text-slate-400 hover:text-slate-200'
            }`}
          >
            1D Barcode
          </button>
        </div>
      </div>

      {/* Main Scanner Container */}
      <div className="p-4 sm:p-5 space-y-4">
        {/* 1. SCANNED RESULT VIEW */}
        {scannedResult ? (
          <div
            id="scan-result-card"
            className="bg-slate-950 rounded-2xl p-4 sm:p-5 border border-emerald-500/40 shadow-xl space-y-4 animate-in zoom-in-95 duration-200"
          >
            <div className="flex items-center space-x-3 text-emerald-400">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center ring-1 ring-emerald-500/40 shrink-0">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                  {scannedFormat || 'Code Detected'}
                </span>
                <div className="text-[11px] text-slate-400">Decoded successfully in real-time</div>
              </div>
            </div>

            {/* Decoded Content Display Box */}
            <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 font-mono text-xs text-slate-200 break-all select-all max-h-36 overflow-y-auto">
              {scannedResult}
            </div>

            {/* Action Buttons: Copy, Open Link, Scan Again */}
            <div className="space-y-2 pt-1">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleCopyText}
                  className={`flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    hasCopied
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                  }`}
                >
                  {hasCopied ? (
                    <>
                      <Check className="w-4 h-4 text-white" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-slate-300" />
                      <span>Copy Text</span>
                    </>
                  )}
                </button>

                {isUrl(scannedResult) ? (
                  <a
                    href={scannedResult}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors shadow-md cursor-pointer"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Open Link</span>
                  </a>
                ) : (
                  <button
                    onClick={() => startScanner()}
                    className="flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors shadow-md cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Scan Again</span>
                  </button>
                )}
              </div>

              {isUrl(scannedResult) && (
                <button
                  onClick={() => startScanner()}
                  className="w-full flex items-center justify-center space-x-1.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-xl transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Scan Another Code</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          /* 2. CAMERA VIEWFINDER AND CONTROLS */
          <div className="space-y-3">
            {/* Viewfinder Frame Container */}
            <div className="relative w-full aspect-4/3 sm:aspect-16/11 bg-black rounded-2xl overflow-hidden border-2 border-slate-700 shadow-2xl flex items-center justify-center">
              
              {/* Target div for Html5Qrcode Camera Feed */}
              <div
                id={scannerElementId}
                className="w-full h-full object-cover [&_video]:w-full [&_video]:h-full [&_video]:object-cover"
              />

              {/* Loading State Spinner Overlay */}
              {isLoadingCamera && (
                <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center space-y-3 z-30">
                  <RefreshCw className="w-8 h-8 text-amber-400 animate-spin" />
                  <div className="text-xs font-medium text-slate-300">
                    Initializing camera stream...
                  </div>
                </div>
              )}

              {/* Animated Reticle Overlay (when scanning) */}
              {isScannerRunning && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-20">
                  {/* Outer shadow mask */}
                  <div className="absolute inset-0 bg-slate-950/25" />

                  {/* Target Scan Reticle Box */}
                  <div
                    className={`relative ${
                      scanMode === 'barcode'
                        ? 'w-64 h-32 sm:w-72 sm:h-36'
                        : 'w-48 h-48 sm:w-56 sm:h-56'
                    }`}
                  >
                    {/* 4 Corner Markers */}
                    <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-emerald-400 rounded-tl-lg shadow-xs" />
                    <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-emerald-400 rounded-tr-lg shadow-xs" />
                    <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-emerald-400 rounded-bl-lg shadow-xs" />
                    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-emerald-400 rounded-br-lg shadow-xs" />

                    {/* Animated Scanning Line */}
                    <div className="absolute inset-x-1.5 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#34d399] animate-bounce duration-1000" />
                  </div>

                  {/* Top Live Status Indicator */}
                  <div className="absolute top-3 inset-x-0 flex justify-center">
                    <div className="px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-xs border border-slate-700 text-[10px] font-mono text-emerald-400 flex items-center gap-1.5 shadow-lg">
                      <Zap className="w-3 h-3 animate-spin" />
                      <span>
                        {scanMode === 'barcode' ? 'Align Barcode inside frame' : 'Align QR / Barcode inside frame'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Floating Camera Controls (Switch Camera, Torch) */}
              {isScannerRunning && (
                <div className="absolute bottom-3 right-3 flex items-center space-x-2 z-30">
                  <button
                    onClick={handleSwitchFacing}
                    className="p-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-800 text-slate-200 backdrop-blur-md border border-slate-700 transition-all cursor-pointer shadow-lg"
                    title="Switch Camera (Front / Back)"
                  >
                    <SwitchCamera className="w-4 h-4" />
                  </button>

                  {torchAvailable && (
                    <button
                      onClick={handleToggleTorch}
                      className={`p-2.5 rounded-xl backdrop-blur-md border transition-all cursor-pointer shadow-lg ${
                        torchOn
                          ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-amber-400/30'
                          : 'bg-slate-950/80 text-slate-300 border-slate-700 hover:bg-slate-800'
                      }`}
                      title="Toggle Flashlight"
                    >
                      <Flashlight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Error / Permission Guidance Banner */}
            {cameraError && (
              <div className="p-3.5 rounded-2xl bg-rose-950/80 border border-rose-800 text-rose-200 text-xs space-y-1.5">
                <div className="font-bold flex items-center gap-1.5 text-rose-300">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>Camera Access Issue</span>
                </div>
                <p className="text-[11px] opacity-90 leading-relaxed">{cameraError}</p>
                {permissionDenied && (
                  <p className="text-[10px] text-rose-300/90 pt-0.5">
                    💡 <strong>Browser Tip</strong>: On iPhone (Safari) or Android (Chrome), tap the <strong>aA</strong> or <strong>🔒 Lock</strong> icon next to the website address &gt; enable <strong>Camera</strong> &gt; refresh the page.
                  </p>
                )}
              </div>
            )}

            {/* Scanner Controls Bar */}
            <div className="flex items-center justify-between gap-2 pt-1 text-xs">
              {isScannerRunning ? (
                <>
                  <span className="text-slate-400 font-mono text-[11px] flex items-center gap-1">
                    <Camera className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{cameraFacing === 'environment' ? 'Rear Camera' : 'Front Camera'}</span>
                  </span>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Upload className="w-3 h-3" />
                      <span>Upload Code</span>
                    </button>
                    <button
                      onClick={stopScanner}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors cursor-pointer"
                    >
                      Pause
                    </button>
                  </div>
                </>
              ) : (
                <div className="w-full space-y-2">
                  <button
                    onClick={() => startScanner()}
                    disabled={isLoadingCamera}
                    className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-900/30 transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-98"
                  >
                    <Camera className="w-4 h-4" />
                    <span>{cameraError ? 'Retry Camera Scanner' : 'Open Camera Scanner'}</span>
                  </button>

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Or Select / Snap Photo from Gallery</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center space-x-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Supports QR, Code 128, EAN, UPC &amp; Pass Barcodes</span>
        </div>
        {onClose && (
          <button
            onClick={() => {
              stopScanner();
              onClose();
            }}
            className="hover:text-slate-200 transition-colors font-medium cursor-pointer"
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
};
