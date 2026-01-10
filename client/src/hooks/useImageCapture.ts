import { useState, useCallback, useRef } from "react";

interface UseImageCaptureReturn {
  capturedImage: Blob | null;
  imagePreviewUrl: string | null;
  captureImage: (videoElement: HTMLVideoElement) => Promise<void>;
  clearImage: () => void;
  isCapturing: boolean;
}

export function useImageCapture(): UseImageCaptureReturn {
  const [capturedImage, setCapturedImage] = useState<Blob | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const captureImage = useCallback(async (videoElement: HTMLVideoElement) => {
    try {
      setIsCapturing(true);

      const canvas = document.createElement("canvas");
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;

      const context = canvas.getContext("2d");
      if (!context) {
        throw new Error("Failed to get canvas context");
      }

      context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            setCapturedImage(blob);
            const url = URL.createObjectURL(blob);
            setImagePreviewUrl(url);
          }
          setIsCapturing(false);
        },
        "image/jpeg",
        0.9
      );
    } catch (error) {
      console.error("Error capturing image:", error);
      setIsCapturing(false);
      throw error;
    }
  }, []);

  const clearImage = useCallback(() => {
    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
    }
    setCapturedImage(null);
    setImagePreviewUrl(null);
  }, [imagePreviewUrl]);

  return {
    capturedImage,
    imagePreviewUrl,
    captureImage,
    clearImage,
    isCapturing,
  };
}

