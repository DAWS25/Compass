import { useEffect, useRef, useState, useCallback } from "react";

interface UseCameraReturn {
  stream: MediaStream | null;
  isActive: boolean;
  error: string | null;
  startCamera: () => Promise<void>;
  stopCamera: () => void;
  switchCamera: () => Promise<void>;
  videoRef: React.RefObject<HTMLVideoElement>;
}

const FacingMode = {
  USER: "user",
  ENVIRONMENT: "environment",
} as const;

export function useCamera(): UseCameraReturn {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<string>(FacingMode.ENVIRONMENT);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setStream(null);
    setIsActive(false);
  }, []);

  const startCamera = useCallback(async () => {
    try {
      setError(null);
      
      // Stop existing stream first
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = mediaStream;
      setStream(mediaStream);
      setIsActive(true);

      // Don't call play() here - let the useEffect handle it to avoid race conditions
    } catch (err) {
      const error = err as Error;
      let errorMessage = "Failed to access camera";

      if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
        errorMessage = "Camera permission denied. Please allow camera access in your browser settings.";
      } else if (error.name === "NotFoundError" || error.name === "DevicesNotFoundError") {
        errorMessage = "No camera found. Please connect a camera device.";
      } else if (error.name === "NotReadableError" || error.name === "TrackStartError") {
        errorMessage = "Camera is already in use by another application.";
      } else if (error.name === "OverconstrainedError") {
        errorMessage = "Camera constraints not supported. Trying default settings...";
        try {
          const fallbackStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false,
          });
          streamRef.current = fallbackStream;
          setStream(fallbackStream);
          setIsActive(true);
          // Don't call play() here - let the useEffect handle it
          return;
        } catch (fallbackError) {
          errorMessage = "Camera access failed. Please check your camera settings.";
        }
      }

      setError(errorMessage);
      setIsActive(false);
    }
  }, [facingMode]);

  const switchCamera = useCallback(async () => {
    const newFacingMode =
      facingMode === FacingMode.USER ? FacingMode.ENVIRONMENT : FacingMode.USER;
    setFacingMode(newFacingMode);
    if (isActive) {
      await startCamera();
    }
  }, [facingMode, isActive, startCamera]);

  // Update video element when stream changes
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    if (!stream) {
      // Cleanup when stream is removed
      if (video.srcObject) {
        video.pause();
        video.srcObject = null;
      }
      return;
    }
    
    // Only update if srcObject is different
    if (video.srcObject === stream) {
      // Already set, just ensure it's playing
      if (video.paused && video.readyState >= 2) {
        video.play().catch((err) => {
          // Ignore AbortError - expected when interrupted
          if (err.name !== "AbortError" && err.name !== "NotAllowedError") {
            console.error("Error playing video:", err);
          }
        });
      }
      return;
    }
    
    // Pause and clear current stream to avoid conflicts
    if (video.srcObject) {
      video.pause();
      video.srcObject = null;
    }
    
    // Set new stream
    video.srcObject = stream;
    
    // Function to safely play the video (only once)
    const playVideo = () => {
      if (video && video.srcObject === stream && video.paused) {
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            // Ignore AbortError - it's expected when srcObject changes mid-play
            if (err.name !== "AbortError" && err.name !== "NotAllowedError") {
              console.error("Error playing video stream:", err);
            }
          });
        }
      }
    };
    
    // Handle metadata load event - this is the safest time to play
    const handleLoadedMetadata = () => {
      playVideo();
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
    
    // Remove any existing listener first to avoid duplicates
    video.removeEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    
    // If metadata is already loaded, play immediately (but with small delay to ensure srcObject is set)
    if (video.readyState >= 1) {
      // Use requestAnimationFrame to ensure srcObject is fully processed
      requestAnimationFrame(() => {
        playVideo();
      });
    }
    
    // Cleanup function - always remove listener
    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, [stream]); // Depend on stream state to trigger when it changes

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, []);

  return {
    stream,
    isActive,
    error,
    startCamera,
    stopCamera,
    switchCamera,
    videoRef,
  };
}

