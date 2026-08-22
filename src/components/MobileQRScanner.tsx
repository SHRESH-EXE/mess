import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import {
  Camera,
  QrCode,
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
  Send
} from 'lucide-react';

/**
 * Universal Mobile/Tablet Detection
 */
export function checkIsMobileOrTablet(): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;

  const isSmallScreen = window.innerWidth < 1024;
  const hasTouch =
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    ((navigator as unknown as { msMaxTouchPoints?: number }).msMaxTouchPoints ?? 0) > 0;

  const userAgent = navigator.userAgent || (navigator as unknown as { vendor?: string }).vendor || '';
  
  const isMobileUserAgent =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|Tablet|Silk|Kindle/i.test(userAgent);
  const isIPadOS = /Macintosh/i.test(userAgent) && hasTouch;

  return isMobileUserAgent || isIPadOS || hasTouch || isSmallScreen;
}

export interface MobileQRScannerProps {
  onScanSuccess?: (decodedText: string) => void;
  onClose?: () => void;
  title?: string;
  description?: string;
  allowDesktopOverride?: boolean;
  autoStart?: boolean;
}

export const MobileQRScanner: React.FC<MobileQRScannerProps> = ({
  onScanSuccess,
  onClose,
  title = 'QR Code Scanner',
  description = 'Point camera at QR code or enter code below',
  allowDesktopOverride = true,
  autoStart = true
}) => {
  // Device Detection State
  const [isMobileOrTablet, setIsMobileOrTablet] = useState<boolean>(() => checkIsMobileOrTablet());
  const [desktopBypass, setDesktopBypass] = useState<boolean>(false);

  // Scanner States
  const [isScannerRunning, setIsScannerRunning] = useState<boolean>(false);
  const [isLoadingCamera, setIsLoadingCamera] = useState<boolean>(false);
  const [cameraFacing, setCameraFacing] = useState<'environment' | 'user'>('environment');

  // Manual Text Box Input State
  const [manualCodeInput, setManualCodeInput] = useState<string>('');

  // Error & Status States
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [permissionDenied, setPermissionDenied] = useState<boolean>(false);
  const [torchAvailable, setTorchAvailable] = useState<boolean>(false);
  const [torchOn, setTorchOn] = useState<boolean>(false);

  // Results State
  const [scannedResult, setScannedResult] = useState<string | null>(null);
  const [hasCopied, setHasCopied] = useState<boolean>(false);

  // Unique Scanner Element ID
  const scannerElementId = useRef(`qr-reader-${Math.random().toString(36).substring(2, 9)}`).current;
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const isStoppingRef = useRef<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Resize & orientation listener
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

  // Handle successful QR decode
  const handleDecodedCode = useCallback((decodedText: string) => {
    const text = decodedText.trim();
    if (!text) return;

    // Haptic feedback if supported
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate([40, 60, 40]);
      } catch {
        // ignore
      }
    }

    setScannedResult(text);
    stopScanner();

    if (onScanSuccess) {
      onScanSuccess(text);
    }
  }, [stopScanner, onScanSuccess]);

  // Handle Manual Text Submission
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCodeInput.trim()) return;
    const text = manualCodeInput.trim();
    setScannedResult(text);
    setManualCodeInput('');
    stopScanner();
    if (onScanSuccess) {
      onScanSuccess(text);
    }
  };

  // Start Camera Stream
  const startScanner = useCallback(
    async (targetCameraFacing: 'environment' | 'user' = cameraFacing) => {
      await stopScanner();

      setCameraError(null);
      setPermissionDenied(false);
      setScannedResult(null);
      setHasCopied(false);
      setIsLoadingCamera(true);

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError('Camera API is not supported in this browser. Please use the text box below to enter your code.');
        setIsLoadingCamera(false);
        return;
      }

      try {
        if (!html5QrCodeRef.current) {
          html5QrCodeRef.current = new Html5Qrcode(scannerElementId, {
            formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
            verbose: false
          });
        }

        const config = {
          fps: 15,
          qrbox: { width: 240, height: 240 },
          aspectRatio: 1.0,
          showTorchButtonIfSupported: true
        };

        await html5QrCodeRef.current.start(
          { facingMode: targetCameraFacing },
          config,
          (decodedText) => {
            handleDecodedCode(decodedText);
          },
          () => {
            // Frame scanned
          }
        );

        setIsScannerRunning(true);
        setIsLoadingCamera(false);

        // Check torch support
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
          setCameraError('Camera permission was denied. Tap the lock icon in your address bar to allow Camera, or use the text box below.');
        } else if (error.name === 'NotFoundError' || msg.includes('DevicesNotFoundError')) {
          setCameraError('No camera detected on this device. You can enter the code in the text box below.');
        } else {
          setCameraError(msg || 'Unable to start camera.');
        }

        setIsScannerRunning(false);
        setIsLoadingCamera(false);
      }
    },
    [cameraFacing, handleDecodedCode, scannerElementId, stopScanner]
  );

  // Switch between front and back camera
  const handleSwitchFacing = async () => {
    const nextFacing = cameraFacing === 'environment' ? 'user' : 'environment';
    setCameraFacing(nextFacing);
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
      console.warn('Torch toggle not supported:', err);
    }
  };

  // Upload image fallback
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCameraError(null);
    setIsLoadingCamera(true);

    try {
      if (!html5QrCodeRef.current) {
        html5QrCodeRef.current = new Html5Qrcode(scannerElementId, {
          formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
          verbose: false
        });
      }

      const decodedResult = await html5QrCodeRef.current.scanFile(file, true);
      if (decodedResult) {
        handleDecodedCode(decodedResult);
      }
    } catch (err) {
      console.warn('Image scan failed:', err);
      setCameraError('No QR code detected in the selected image.');
    } finally {
      setIsLoadingCamera(false);
      e.target.value = '';
    }
  };

  // Auto-start camera when opened on mobile/tablet or with bypass
  useEffect(() => {
    const effectiveIsMobile = isMobileOrTablet || desktopBypass;
    if (autoStart && effectiveIsMobile && !scannedResult) {
      const timer = setTimeout(() => {
        startScanner();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [autoStart, isMobileOrTablet, desktopBypass, scannedResult, startScanner]);

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
          // ignore
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
  // VIEW A: DESKTOP NOTICE WITH DIRECT TEXT BOX & WEBCAM OVERRIDE
  // -------------------------------------------------------------
  if (!effectiveIsMobile) {
    return (
      <div
        id="desktop-device-notice"
        className="w-full max-w-md mx-auto bg-slate-900 text-slate-100 rounded-3xl border border-slate-800 p-6 shadow-2xl space-y-5 animate-in fade-in duration-150"
      >
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
            <QrCode className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-white font-serif">
            {title}
          </h3>
          <p className="text-xs text-slate-400">
            Scan via mobile camera or enter the QR code / Roll number below.
          </p>
        </div>

        {/* Text Box Input for instant code entry */}
        <form onSubmit={handleManualSubmit} className="space-y-2">
          <label className="text-[11px] font-semibold text-slate-300 block">
            Enter QR Code / Roll Number:
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={manualCodeInput}
              onChange={(e) => setManualCodeInput(e.target.value)}
              placeholder="e.g. 22CS0142 or QR Token..."
              className="flex-1 bg-slate-950 border border-slate-800 text-xs px-3.5 py-2.5 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-amber-500 font-mono"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-1 shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Verify</span>
            </button>
          </div>
        </form>

        <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row gap-2">
          {allowDesktopOverride && (
            <button
              onClick={() => {
                setDesktopBypass(true);
                setTimeout(() => startScanner(), 100);
              }}
              className="flex-1 py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5 text-emerald-400" />
              <span>Open Webcam</span>
            </button>
          )}

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-amber-400" />
            <span>Upload Image</span>
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
            Close
          </button>
        )}
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW B: LIVE QR CAMERA SCANNER + TEXT BOX INPUT
  // -------------------------------------------------------------
  return (
    <div
      id="mobile-qr-scanner-card"
      className="w-full max-w-md mx-auto bg-slate-900 text-slate-100 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col animate-in fade-in duration-150"
    >
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
            <QrCode className="w-5 h-5" />
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

      {/* Main Scanner Container */}
      <div className="p-4 sm:p-5 space-y-4">
        {/* 1. SCANNED RESULT VIEW */}
        {scannedResult ? (
          <div
            id="scan-result-card"
            className="bg-slate-950 rounded-2xl p-4 sm:p-5 border border-emerald-500/40 shadow-xl space-y-4 animate-in zoom-in-95 duration-150"
          >
            <div className="flex items-center space-x-3 text-emerald-400">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center ring-1 ring-emerald-500/40 shrink-0">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                  QR Code Verified
                </span>
                <div className="text-[11px] text-slate-400">Decoded successfully</div>
              </div>
            </div>

            {/* Decoded Content Display Box */}
            <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 font-mono text-xs text-slate-200 break-all select-all max-h-36 overflow-y-auto">
              {scannedResult}
            </div>

            {/* Actions: Copy, Open Link, Scan Again */}
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
          /* 2. CAMERA VIEWFINDER AND TEXT BOX INPUT */
          <div className="space-y-4">
            {/* Viewfinder Frame */}
            <div className="relative w-full aspect-square max-h-72 bg-black rounded-2xl overflow-hidden border-2 border-slate-700 shadow-2xl flex items-center justify-center">
              
              <div
                id={scannerElementId}
                className="w-full h-full object-cover [&_video]:w-full [&_video]:h-full [&_video]:object-cover"
              />

              {isLoadingCamera && (
                <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center space-y-3 z-30">
                  <RefreshCw className="w-8 h-8 text-amber-400 animate-spin" />
                  <div className="text-xs font-medium text-slate-300">
                    Opening camera...
                  </div>
                </div>
              )}

              {isScannerRunning && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-20">
                  <div className="absolute inset-0 bg-slate-950/20" />

                  {/* Target QR Reticle Box */}
                  <div className="relative w-48 h-48 sm:w-56 sm:h-56">
                    <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-emerald-400 rounded-tl-lg shadow-xs" />
                    <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-emerald-400 rounded-tr-lg shadow-xs" />
                    <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-emerald-400 rounded-bl-lg shadow-xs" />
                    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-emerald-400 rounded-br-lg shadow-xs" />

                    <div className="absolute inset-x-1.5 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#34d399] animate-bounce duration-1000" />
                  </div>

                  <div className="absolute top-3 inset-x-0 flex justify-center">
                    <div className="px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-xs border border-slate-700 text-[10px] font-mono text-emerald-400 flex items-center gap-1.5 shadow-lg">
                      <Zap className="w-3 h-3 animate-spin" />
                      <span>Align QR inside frame</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Floating Camera Controls */}
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

            {/* Error Message if camera failed */}
            {cameraError && (
              <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-200 text-xs space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-rose-300">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>Camera Notice</span>
                </div>
                <p className="text-[11px] opacity-90">{cameraError}</p>
              </div>
            )}

            {/* Text Box Input for instant typing/pasting */}
            <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800 space-y-2">
              <label className="text-[11px] font-semibold text-slate-300 flex items-center justify-between">
                <span>Or Enter Code in Text Box:</span>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-[10px] text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Upload className="w-3 h-3" />
                  <span>Upload QR Image</span>
                </button>
              </label>
              
              <form onSubmit={handleManualSubmit} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={manualCodeInput}
                  onChange={(e) => setManualCodeInput(e.target.value)}
                  placeholder="Type QR Token or Roll No..."
                  className="flex-1 bg-slate-900 border border-slate-800 text-xs px-3 py-2 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-amber-500 font-mono"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-1 shrink-0"
                >
                  <Send className="w-3 h-3" />
                  <span>Verify</span>
                </button>
              </form>
            </div>

            {/* Camera Control action buttons */}
            <div className="flex items-center justify-between text-xs pt-0.5">
              {isScannerRunning ? (
                <>
                  <span className="text-slate-400 font-mono text-[11px] flex items-center gap-1">
                    <Camera className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{cameraFacing === 'environment' ? 'Rear Camera' : 'Front Camera'}</span>
                  </span>
                  <button
                    onClick={stopScanner}
                    className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors cursor-pointer"
                  >
                    Pause Camera
                  </button>
                </>
              ) : (
                <button
                  onClick={() => startScanner()}
                  disabled={isLoadingCamera}
                  className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Start Camera</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center space-x-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Real-time QR Token Verification</span>
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
