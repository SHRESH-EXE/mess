import React, { useState, useEffect, useRef, useCallback } from 'react';
import jsQR from 'jsqr';
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
  RefreshCw
} from 'lucide-react';

/**
 * Detect if the device is likely a mobile or tablet:
 * - Mobile User Agent (iPhone, Android, etc.)
 * - iPadOS (which reports as MacIntel with touch support)
 * - Touch screens
 * - Viewport width < 1024px
 */
export function checkIsMobileOrTablet(): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;

  const isSmallScreen = window.innerWidth < 1024;
  const hasTouch =
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    ((navigator as unknown as { msMaxTouchPoints?: number }).msMaxTouchPoints ?? 0) > 0;

  const userAgent = navigator.userAgent || (navigator as unknown as { vendor?: string }).vendor || '';
  
  // iOS, iPadOS 13+, Android, Tablets
  const isMobileUserAgent =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|Tablet|Silk|Kindle/i.test(userAgent);
  const isIPadOS = /Macintosh/i.test(userAgent) && hasTouch;

  return isMobileUserAgent || isIPadOS || (hasTouch && isSmallScreen) || isSmallScreen;
}

export interface MobileQRScannerProps {
  onScanSuccess?: (decodedText: string) => void;
  onClose?: () => void;
  title?: string;
  description?: string;
  allowDesktopOverride?: boolean;
}

export const MobileQRScanner: React.FC<MobileQRScannerProps> = ({
  onScanSuccess,
  onClose,
  title = 'Mobile QR Code Scanner',
  description = 'Point back camera at QR code to scan',
  allowDesktopOverride = true
}) => {
  // Device Detection State
  const [isMobileOrTablet, setIsMobileOrTablet] = useState<boolean>(() => checkIsMobileOrTablet());
  const [desktopBypass, setDesktopBypass] = useState<boolean>(false);

  // Camera & Scanner States
  const [isScannerActive, setIsScannerActive] = useState<boolean>(false);
  const [cameraFacing, setCameraFacing] = useState<'environment' | 'user'>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraPermissionDenied, setCameraPermissionDenied] = useState<boolean>(false);
  const [torchAvailable, setTorchAvailable] = useState<boolean>(false);
  const [torchOn, setTorchOn] = useState<boolean>(false);
  const [isLoadingCamera, setIsLoadingCamera] = useState<boolean>(false);

  // Scan Result
  const [scannedResult, setScannedResult] = useState<string | null>(null);
  const [hasCopied, setHasCopied] = useState<boolean>(false);

  // DOM Refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const isScanningRef = useRef<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Orientation & resize listener
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

  // Stop camera tracks cleanly
  const stopCameraStream = useCallback(() => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
    isScanningRef.current = false;

    if (streamRef.current) {
      try {
        streamRef.current.getTracks().forEach((track) => {
          track.stop();
        });
      } catch (err) {
        console.warn('Error stopping camera tracks:', err);
      }
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setTorchOn(false);
    setTorchAvailable(false);
    setIsLoadingCamera(false);
    setIsScannerActive(false);
  }, []);

  // Continuous Frame Analysis Loop using bundled jsQR
  const tick = useCallback(() => {
    if (!isScanningRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video && canvas && video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (ctx && video.videoWidth > 0 && video.videoHeight > 0) {
        canvas.height = video.videoHeight;
        canvas.width = video.videoWidth;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        try {
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'dontInvert'
          });

          if (code && code.data && code.data.trim()) {
            // QR Code Successfully Found!
            isScanningRef.current = false;
            stopCameraStream();

            // Haptic feedback if supported
            if (typeof navigator !== 'undefined' && navigator.vibrate) {
              try {
                navigator.vibrate([40, 60, 40]);
              } catch {
                // ignore vibration errors
              }
            }

            const decoded = code.data.trim();
            setScannedResult(decoded);
            if (onScanSuccess) {
              onScanSuccess(decoded);
            }
            return;
          }
        } catch (err) {
          console.warn('jsQR decoding error:', err);
        }
      }
    }

    if (isScanningRef.current) {
      animationFrameId.current = requestAnimationFrame(tick);
    }
  }, [stopCameraStream, onScanSuccess]);

  // Start Camera Stream with layered progressive fallbacks
  const startCameraStream = useCallback(
    async (facing: 'environment' | 'user' = cameraFacing) => {
      stopCameraStream();
      setCameraError(null);
      setCameraPermissionDenied(false);
      setScannedResult(null);
      setHasCopied(false);
      setIsLoadingCamera(true);

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError('Camera API (getUserMedia) is not supported in this browser or is restricted by your device settings.');
        setIsLoadingCamera(false);
        return;
      }

      let stream: MediaStream | null = null;

      // Layered constraints strategy for iOS Safari, Android Chrome, Tablets:
      const constraintOptions: MediaStreamConstraints[] = [
        // 1. Exact facing mode preferred
        {
          video: {
            facingMode: { ideal: facing },
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: false
        },
        // 2. Simple facing mode
        {
          video: { facingMode: facing },
          audio: false
        },
        // 3. Any video stream available
        {
          video: true,
          audio: false
        }
      ];

      let lastError: Error | unknown = null;

      for (const constraints of constraintOptions) {
        try {
          stream = await navigator.mediaDevices.getUserMedia(constraints);
          if (stream) break;
        } catch (err) {
          lastError = err;
        }
      }

      if (!stream) {
        const error = (lastError || {}) as { name?: string; message?: string };
        console.warn('getUserMedia failed with all constraints:', error);

        if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
          setCameraPermissionDenied(true);
          setCameraError('Camera permission was denied. Please allow camera access in your browser settings (tap the lock icon in the address bar).');
        } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
          setCameraError('No camera hardware was detected on this device.');
        } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
          setCameraError('Camera is already in use by another app. Please close other camera apps and retry.');
        } else {
          setCameraError(error.message || 'Unable to access device camera.');
        }
        setIsLoadingCamera(false);
        return;
      }

      streamRef.current = stream;

      // Check if torch/flashlight is supported
      const track = stream.getVideoTracks()[0];
      if (track) {
        try {
          const capabilities = (track.getCapabilities?.() as { torch?: boolean }) || {};
          if (capabilities.torch) {
            setTorchAvailable(true);
          }
        } catch {
          // ignore
        }
      }

      if (videoRef.current) {
        const video = videoRef.current;
        video.srcObject = stream;
        video.setAttribute('playsinline', 'true');
        video.setAttribute('webkit-playsinline', 'true');
        video.muted = true;

        try {
          await video.play();
        } catch (playErr) {
          console.warn('Video auto-play delayed or blocked, waiting for metadata:', playErr);
          // Retry on loadedmetadata
          video.onloadedmetadata = async () => {
            try {
              await video.play();
            } catch (e) {
              console.warn('Failed video play on metadata:', e);
            }
          };
        }

        setIsScannerActive(true);
        setIsLoadingCamera(false);
        isScanningRef.current = true;
        animationFrameId.current = requestAnimationFrame(tick);
      } else {
        setIsLoadingCamera(false);
      }
    },
    [cameraFacing, stopCameraStream, tick]
  );

  // Switch between front and back camera
  const handleSwitchCamera = () => {
    const nextFacing = cameraFacing === 'environment' ? 'user' : 'environment';
    setCameraFacing(nextFacing);
    startCameraStream(nextFacing);
  };

  // Toggle Torch/Flashlight
  const toggleTorch = async () => {
    if (!streamRef.current) return;
    const track = streamRef.current.getVideoTracks()[0];
    if (!track) return;

    try {
      const newStatus = !torchOn;
      await (track as unknown as { applyConstraints: (c: unknown) => Promise<void> }).applyConstraints({
        advanced: [{ torch: newStatus }]
      });
      setTorchOn(newStatus);
    } catch (err) {
      console.warn('Torch toggle not supported:', err);
    }
  };

  // Fallback: Scan QR from an uploaded photo or camera snapshot
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          if (code && code.data) {
            const decoded = code.data.trim();
            setScannedResult(decoded);
            stopCameraStream();
            if (onScanSuccess) {
              onScanSuccess(decoded);
            }
          } else {
            setCameraError('No QR code detected in the uploaded image. Please ensure the QR is well-lit and in focus.');
          }
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
    // Reset file input so same file can be selected again
    e.target.value = '';
  };

  // Page Visibility API - Pause camera when tab is minimized, resume on focus
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (isScanningRef.current) {
          stopCameraStream();
        }
      } else {
        if (!scannedResult && isScannerActive) {
          startCameraStream();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isScannerActive, scannedResult, startCameraStream, stopCameraStream]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, [stopCameraStream]);

  // Check if decoded result is a URL
  const isUrl = (str: string) => {
    try {
      return /^https?:\/\//i.test(str);
    } catch {
      return false;
    }
  };

  // Copy result to clipboard
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
  // VIEW A: DESKTOP / LAPTOP RESTRICTION VIEW
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
            Please Open on Mobile or Tablet
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
            The live QR camera scanner is optimized for phones and tablets with back cameras.
          </p>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 text-left space-y-2 text-xs text-slate-300">
          <div className="flex items-center space-x-2 text-amber-400 font-semibold">
            <Tablet className="w-4 h-4" />
            <span>Quick Testing Options:</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px]">
            <li>Open this URL on your mobile phone or tablet to scan via camera.</li>
            <li>Or test camera / upload QR image right here on your computer.</li>
          </ul>
        </div>

        {/* Optional Desktop Testing Override & Image Upload */}
        <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
          {allowDesktopOverride && (
            <button
              onClick={() => {
                setDesktopBypass(true);
                startCameraStream();
              }}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Test Webcam / Camera Here</span>
            </button>
          )}

          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload QR Image</span>
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
  // VIEW B: MOBILE / TABLET LIVE SCANNER VIEW
  // -------------------------------------------------------------
  return (
    <div
      id="mobile-qr-scanner-card"
      className="w-full max-w-md mx-auto bg-slate-900 text-slate-100 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col animate-in fade-in duration-200"
    >
      {/* Hidden Offscreen Canvas for jsQR Image Processing */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Hidden File Input for Image Upload fallback */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Header */}
      <div className="px-5 py-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>{title}</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono uppercase">
                Live
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">{description}</p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={() => {
              stopCameraStream();
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Main Scanner Body */}
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
                  QR Code Detected
                </span>
                <div className="text-[11px] text-slate-400">Decoded successfully via jsQR</div>
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
                    onClick={() => startCameraStream()}
                    className="flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors shadow-md cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Scan Again</span>
                  </button>
                )}
              </div>

              {isUrl(scannedResult) && (
                <button
                  onClick={() => startCameraStream()}
                  className="w-full flex items-center justify-center space-x-1.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-xl transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Scan Another Code</span>
                </button>
              )}
            </div>
          </div>
        ) : isScannerActive ? (
          /* 2. ACTIVE LIVE CAMERA VIEWFINDER WITH SCAN OVERLAY */
          <div className="space-y-3">
            <div className="relative aspect-4/3 w-full bg-black rounded-2xl overflow-hidden border-2 border-slate-700 shadow-2xl flex items-center justify-center">
              {/* Video Element for Camera Stream */}
              <video
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover"
                playsInline
                autoPlay
                muted
              />

              {/* Viewfinder Darkened Edge Overlay */}
              <div className="absolute inset-0 bg-slate-950/30 pointer-events-none" />

              {/* Target Scan Reticle Box */}
              <div className="relative w-44 h-44 sm:w-56 sm:h-56 z-10 pointer-events-none">
                {/* 4 Corner Markers */}
                <div className="absolute top-0 left-0 w-7 h-7 border-t-4 border-l-4 border-emerald-400 rounded-tl-xl shadow-xs" />
                <div className="absolute top-0 right-0 w-7 h-7 border-t-4 border-r-4 border-emerald-400 rounded-tr-xl shadow-xs" />
                <div className="absolute bottom-0 left-0 w-7 h-7 border-b-4 border-l-4 border-emerald-400 rounded-bl-xl shadow-xs" />
                <div className="absolute bottom-0 right-0 w-7 h-7 border-b-4 border-r-4 border-emerald-400 rounded-br-xl shadow-xs" />

                {/* Animated Horizontal Laser Scan Beam */}
                <div className="absolute inset-x-2 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#34d399] animate-bounce duration-1000" />
              </div>

              {/* Top Live Status Indicator */}
              <div className="absolute top-3 inset-x-0 flex justify-center z-20 pointer-events-none">
                <div className="px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-xs border border-slate-700 text-[10px] font-mono text-emerald-400 flex items-center gap-1.5 shadow-lg">
                  <Zap className="w-3 h-3 animate-spin" />
                  <span>Align QR inside frame</span>
                </div>
              </div>

              {/* Floating Camera Actions: Switch Camera & Torch */}
              <div className="absolute bottom-3 right-3 flex items-center space-x-2 z-20">
                <button
                  onClick={handleSwitchCamera}
                  className="p-2.5 rounded-xl bg-slate-950/70 hover:bg-slate-800 text-slate-200 backdrop-blur-md border border-slate-700 transition-all cursor-pointer"
                  title="Switch Camera (Front/Back)"
                >
                  <SwitchCamera className="w-4 h-4" />
                </button>

                {torchAvailable && (
                  <button
                    onClick={toggleTorch}
                    className={`p-2.5 rounded-xl backdrop-blur-md border transition-all cursor-pointer ${
                      torchOn
                        ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-lg shadow-amber-400/30'
                        : 'bg-slate-950/70 text-slate-300 border-slate-700 hover:bg-slate-800'
                    }`}
                    title="Toggle Flashlight"
                  >
                    <Flashlight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Scanner Controls below viewfinder */}
            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-slate-400 font-mono text-[11px] flex items-center gap-1">
                <Camera className="w-3.5 h-3.5 text-emerald-400" />
                <span>{cameraFacing === 'environment' ? 'Rear Camera Active' : 'Front Camera Active'}</span>
              </span>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Upload className="w-3 h-3" />
                  <span>Upload Photo</span>
                </button>
                <button
                  onClick={stopCameraStream}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors cursor-pointer"
                >
                  Pause
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* 3. INITIAL "START SCAN" LAUNCHER */
          <div className="space-y-4 text-center py-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto shadow-inner">
              <Camera className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h4 className="text-sm font-bold text-slate-100">Ready to Scan QR Code</h4>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Tap below to open your phone or tablet camera and scan student passes, meal tokens, or web links.
              </p>
            </div>

            {/* Error / Permission Warning */}
            {cameraError && (
              <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-200 text-xs text-left space-y-1.5">
                <div className="font-bold flex items-center gap-1.5 text-rose-300">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>Camera Access Required</span>
                </div>
                <p className="text-[11px] opacity-90 leading-relaxed">{cameraError}</p>
                {cameraPermissionDenied && (
                  <p className="text-[10px] text-rose-300/80 pt-1">
                    💡 <strong>Tip</strong>: If camera permission is blocked, tap the lock icon 🔒 next to the website URL in Chrome or Safari and select <strong>&quot;Permissions &gt; Camera &gt; Allow&quot;</strong>, then refresh.
                  </p>
                )}
              </div>
            )}

            <div className="space-y-2 pt-1">
              <button
                id="start-camera-scan-btn"
                onClick={() => startCameraStream()}
                disabled={isLoadingCamera}
                className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-900/30 hover:shadow-emerald-900/50 transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-98"
              >
                {isLoadingCamera ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Opening Camera...</span>
                  </>
                ) : (
                  <>
                    <Camera className="w-4 h-4" />
                    <span>{cameraError ? 'Retry Camera Scanner' : 'Start Camera Scanner'}</span>
                  </>
                )}
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Or Select / Snap Photo from Gallery</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center space-x-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Local Device Privacy • Instant Decoding</span>
        </div>
        {onClose && (
          <button
            onClick={() => {
              stopCameraStream();
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
