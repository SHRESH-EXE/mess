import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import {
  Camera,
  QrCode,
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

  // Process decoded QR text
  const handleDecodedCode = useCallback((decodedText: string) => {
    stopScanner();
    setScannedResult(decodedText);

    if (onScanSuccess) {
      onScanSuccess(decodedText);
    }
  }, [stopScanner, onScanSuccess]);

  // Start HTML5-QRCode Scanner
  const startScanner = useCallback(async (facing: 'environment' | 'user' = cameraFacing) => {
    setCameraError(null);
    setIsLoadingCamera(true);
    setScannedResult(null);

    try {
      if (!html5QrCodeRef.current) {
        html5QrCodeRef.current = new Html5Qrcode(scannerElementId, {
          formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
          verbose: false
        });
      }

      if (html5QrCodeRef.current.isScanning) {
        await html5QrCodeRef.current.stop();
      }

      const qrBoxSize = Math.min(250, Math.floor(window.innerWidth * 0.7));

      await html5QrCodeRef.current.start(
        { facingMode: facing },
        {
          fps: 15,
          qrbox: { width: qrBoxSize, height: qrBoxSize },
          aspectRatio: 1.0
        },
        (decodedText) => {
          handleDecodedCode(decodedText);
        },
        () => {
          // scanning frames
        }
      );

      setIsScannerRunning(true);

      // Check flashlight/torch capability
      try {
        const capabilities = html5QrCodeRef.current.getRunningTrackCapabilities();
        if (capabilities && 'torch' in capabilities) {
          setTorchAvailable(true);
        }
      } catch {
        setTorchAvailable(false);
      }
    } catch (err) {
      console.warn('Camera launch error:', err);
      setIsScannerRunning(false);
      setCameraError('Unable to start live video stream. You can use the text box below or upload a QR image.');
    } finally {
      setIsLoadingCamera(false);
    }
  }, [cameraFacing, handleDecodedCode, scannerElementId]);

  // Handle Manual Submit
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCodeInput.trim()) return;
    handleDecodedCode(manualCodeInput.trim());
    setManualCodeInput('');
  };

  // Switch between front and rear camera
  const handleSwitchFacing = async () => {
    const nextFacing = cameraFacing === 'environment' ? 'user' : 'environment';
    setCameraFacing(nextFacing);
    if (isScannerRunning) {
      await stopScanner();
      startScanner(nextFacing);
    }
  };

  // Flashlight toggle
  const handleToggleTorch = async () => {
    if (!html5QrCodeRef.current || !torchAvailable) return;
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
        className="w-full max-w-md mx-auto glassmorphism-card text-[#2e170d] rounded-3xl border border-white/80 p-6 shadow-2xl space-y-5 animate-in fade-in duration-150"
      >
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#ff7a30] to-[#ff9248] text-white flex items-center justify-center mx-auto shadow-md shadow-orange-500/20">
            <QrCode className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-[#2e170d]">
            {title}
          </h3>
          <p className="text-xs text-[#9a3412] font-semibold">
            Scan via mobile camera or enter the QR code / Roll number below.
          </p>
        </div>

        {/* Text Box Input for instant code entry */}
        <form onSubmit={handleManualSubmit} className="space-y-2">
          <label className="text-[11px] font-bold text-[#2e170d] block">
            Enter QR Code / Roll Number:
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={manualCodeInput}
              onChange={(e) => setManualCodeInput(e.target.value)}
              placeholder="e.g. 22CS0142 or QR Token..."
              className="flex-1 glassmorphism-input text-xs px-3.5 py-2.5 rounded-xl text-[#2e170d] placeholder-[#c2410c]/50 focus:outline-none font-mono"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-gradient-to-r from-[#ff7a30] to-[#ff9248] hover:from-[#ea671e] hover:to-[#ff8130] text-white font-bold text-xs rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1 shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Verify</span>
            </button>
          </div>
        </form>

        <div className="pt-2 border-t border-orange-200/60 flex flex-col sm:flex-row gap-2">
          {allowDesktopOverride && (
            <button
              onClick={() => {
                setDesktopBypass(true);
                setTimeout(() => startScanner(), 100);
              }}
              className="flex-1 py-2.5 px-3 bg-white/60 hover:bg-white text-[#2e170d] text-xs font-bold rounded-xl border border-orange-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Camera className="w-3.5 h-3.5 text-[#ff7a30]" />
              <span>Open Webcam</span>
            </button>
          )}

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 py-2.5 px-3 bg-white/60 hover:bg-white text-[#2e170d] text-xs font-bold rounded-xl border border-orange-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Upload className="w-3.5 h-3.5 text-[#ff7a30]" />
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
            className="w-full py-2 bg-white/45 hover:bg-white text-[#9a3412] hover:text-[#2e170d] text-xs font-bold rounded-xl transition-colors cursor-pointer border border-orange-200/60"
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
      className="w-full max-w-md mx-auto glassmorphism-card text-[#2e170d] rounded-3xl border border-white/80 shadow-2xl overflow-hidden flex flex-col animate-in fade-in duration-150"
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
      <div className="px-5 py-3.5 bg-white/45 border-b border-orange-200/60 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-br from-[#ff7a30] to-[#ff9248] text-white shadow-xs">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#2e170d] flex items-center gap-1.5">
              <span>{title}</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-mono font-bold uppercase">
                {isScannerRunning ? 'Live' : 'Ready'}
              </span>
            </h3>
            <p className="text-[11px] text-[#9a3412] font-semibold">{description}</p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={() => {
              stopScanner();
              onClose();
            }}
            className="p-1.5 rounded-xl text-[#9a3412] hover:text-[#2e170d] hover:bg-white/60 transition-colors cursor-pointer"
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
            className="bg-white/60 rounded-2xl p-4 sm:p-5 border border-emerald-300 shadow-md space-y-4 animate-in zoom-in-95 duration-150"
          >
            <div className="flex items-center space-x-3 text-emerald-700">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center border border-emerald-300 shrink-0">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                  QR Code Verified
                </span>
                <div className="text-[11px] text-[#9a3412] font-medium">Decoded successfully</div>
              </div>
            </div>

            {/* Decoded Content Display Box */}
            <div className="bg-white/70 p-3.5 rounded-xl border border-orange-200 font-mono text-xs text-[#2e170d] font-bold break-all select-all max-h-36 overflow-y-auto">
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
                      : 'bg-white/70 hover:bg-white text-[#2e170d] border border-orange-200'
                  }`}
                >
                  {hasCopied ? (
                    <>
                      <Check className="w-4 h-4 text-white" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-[#6c2e11]" />
                      <span>Copy Text</span>
                    </>
                  )}
                </button>

                {isUrl(scannedResult) ? (
                  <a
                    href={scannedResult}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl text-xs font-bold bg-gradient-to-r from-[#ff7a30] to-[#ff9248] hover:from-[#ea671e] hover:to-[#ff8130] text-white transition-all shadow-md cursor-pointer"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Open Link</span>
                  </a>
                ) : (
                  <button
                    onClick={() => startScanner()}
                    className="flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl text-xs font-bold bg-gradient-to-r from-[#ff7a30] to-[#ff9248] hover:from-[#ea671e] hover:to-[#ff8130] text-white transition-all shadow-md cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Scan Again</span>
                  </button>
                )}
              </div>

              {isUrl(scannedResult) && (
                <button
                  onClick={() => startScanner()}
                  className="w-full flex items-center justify-center space-x-1.5 py-2 bg-white/60 hover:bg-white text-[#6c2e11] text-xs font-bold rounded-xl border border-orange-200 transition-colors cursor-pointer"
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
            <div className="relative w-full aspect-square max-h-72 bg-orange-950/20 rounded-2xl overflow-hidden border-2 border-orange-300 shadow-xl flex items-center justify-center">
              
              <div
                id={scannerElementId}
                className="w-full h-full object-cover [&_video]:w-full [&_video]:h-full [&_video]:object-cover"
              />

              {isLoadingCamera && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex flex-col items-center justify-center space-y-3 z-30">
                  <RefreshCw className="w-8 h-8 text-[#ff7a30] animate-spin" />
                  <div className="text-xs font-bold text-[#2e170d]">
                    Opening camera...
                  </div>
                </div>
              )}

              {isScannerRunning && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-20">
                  <div className="absolute inset-0 bg-orange-950/10" />

                  {/* Target QR Reticle Box */}
                  <div className="relative w-48 h-48 sm:w-56 sm:h-56">
                    <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-[#ff7a30] rounded-tl-lg shadow-xs" />
                    <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-[#ff7a30] rounded-tr-lg shadow-xs" />
                    <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-[#ff7a30] rounded-bl-lg shadow-xs" />
                    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-[#ff7a30] rounded-br-lg shadow-xs" />

                    <div className="absolute inset-x-1.5 h-0.5 bg-gradient-to-r from-transparent via-[#ff7a30] to-transparent shadow-[0_0_15px_#ff7a30] animate-bounce duration-1000" />
                  </div>

                  <div className="absolute top-3 inset-x-0 flex justify-center">
                    <div className="px-3 py-1 rounded-full bg-white/85 backdrop-blur-xs border border-orange-200 text-[10px] font-mono text-[#ea580c] font-bold flex items-center gap-1.5 shadow-md">
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
                    className="p-2.5 rounded-xl bg-white/85 hover:bg-white text-[#2e170d] backdrop-blur-md border border-orange-200 transition-all cursor-pointer shadow-lg"
                    title="Switch Camera (Front / Back)"
                  >
                    <SwitchCamera className="w-4 h-4" />
                  </button>

                  {torchAvailable && (
                    <button
                      onClick={handleToggleTorch}
                      className={`p-2.5 rounded-xl backdrop-blur-md border transition-all cursor-pointer shadow-lg ${
                        torchOn
                          ? 'bg-[#ff7a30] text-white border-orange-400 shadow-orange-500/30'
                          : 'bg-white/85 text-[#2e170d] border-orange-200 hover:bg-white'
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
              <div className="p-3 rounded-xl bg-rose-100/90 border border-rose-300 text-rose-900 text-xs space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-rose-700">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>Camera Notice</span>
                </div>
                <p className="text-[11px] opacity-90">{cameraError}</p>
              </div>
            )}

            {/* Text Box Input for instant typing/pasting */}
            <div className="bg-white/45 p-3.5 rounded-2xl border border-white/80 space-y-2 shadow-xs">
              <label className="text-[11px] font-bold text-[#2e170d] flex items-center justify-between">
                <span>Or Enter Code in Text Box:</span>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-[10px] text-[#ea580c] font-bold hover:underline flex items-center gap-1 cursor-pointer"
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
                  className="flex-1 glassmorphism-input text-xs px-3 py-2 rounded-xl text-[#2e170d] placeholder-[#c2410c]/50 focus:outline-none font-mono"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-[#ff7a30] to-[#ff9248] hover:from-[#ea671e] hover:to-[#ff8130] text-white font-bold text-xs rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1 shrink-0"
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
                  <span className="text-[#9a3412] font-mono text-[11px] font-bold flex items-center gap-1">
                    <Camera className="w-3.5 h-3.5 text-[#ff7a30]" />
                    <span>{cameraFacing === 'environment' ? 'Rear Camera' : 'Front Camera'}</span>
                  </span>
                  <button
                    onClick={stopScanner}
                    className="px-3 py-1 rounded-xl bg-white/70 hover:bg-white text-[#2e170d] font-bold text-xs border border-orange-200 transition-colors cursor-pointer"
                  >
                    Pause Camera
                  </button>
                </>
              ) : (
                <button
                  onClick={() => startScanner()}
                  disabled={isLoadingCamera}
                  className="w-full py-2.5 px-3 bg-gradient-to-r from-[#ff7a30] to-[#ff9248] hover:from-[#ea671e] hover:to-[#ff8130] disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
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
      <div className="px-5 py-3 bg-white/40 border-t border-orange-200/60 flex items-center justify-between text-[11px] text-[#9a3412] font-medium">
        <div className="flex items-center space-x-1.5 font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Real-time QR Token Verification</span>
        </div>
        {onClose && (
          <button
            onClick={() => {
              stopScanner();
              onClose();
            }}
            className="hover:text-[#2e170d] font-bold transition-colors cursor-pointer"
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
};
