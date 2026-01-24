"use client";

import { useEffect, useRef } from "react";
import classNames from "classnames";
import PrimaryButton from "@/components/Button/PrimaryButton";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import { useCamera } from "@/hooks/useCamera";
import styles from "./CameraView.module.css";

interface CameraViewProps {
  onCapture: (videoElement: HTMLVideoElement) => Promise<void>;
  onCancel: () => void;
  onSwitchCamera: () => void;
  isCapturing: boolean;
}

export default function CameraView({
  onCapture,
  onCancel,
  onSwitchCamera,
  isCapturing,
}: CameraViewProps) {
  const { stream, isActive, error, startCamera, stopCamera, switchCamera, videoRef } = useCamera();
  const hasStartedRef = useRef(false);

  useEffect(() => {
    // Only start camera once when component mounts
    if (!hasStartedRef.current) {
      hasStartedRef.current = true;
      startCamera();
    }
    
    return () => {
      stopCamera();
      hasStartedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps - only run on mount/unmount

  const handleSwitchCamera = () => {
    switchCamera();
    onSwitchCamera();
  };

  const handleCapture = async () => {
    if (videoRef.current && isActive && stream) {
      await onCapture(videoRef.current);
    }
  };

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorContent}>
          <span className={styles.errorIcon} aria-hidden="true">
            📷
          </span>
          <h2 className={styles.errorTitle}>Camera Access Error</h2>
          <p className={styles.errorMessage}>{error}</p>
          <PrimaryButton onClick={startCamera} variant="primary" size="medium">
            Try Again
          </PrimaryButton>
          <PrimaryButton
            onClick={onCancel}
            variant="secondary"
            size="medium"
            className={styles.cancelButton}
          >
            Cancel
          </PrimaryButton>
        </div>
      </div>
    );
  }

  if (!isActive) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingSpinner size="large" message="Starting camera..." />
        <PrimaryButton
          onClick={onCancel}
          variant="secondary"
          size="medium"
          className={styles.cancelButton}
        >
          Cancel
        </PrimaryButton>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={styles.video}
        aria-label="Camera preview"
      />

      <button
        onClick={onCancel}
        className={styles.closeButton}
        aria-label="Close camera"
        type="button"
        tabIndex={0}
      >
        <span aria-hidden="true">✕</span>
      </button>

      <button
        onClick={handleSwitchCamera}
        className={styles.switchButton}
        aria-label="Switch camera"
        type="button"
        tabIndex={0}
        disabled={isCapturing}
      >
        <span aria-hidden="true">🔄</span>
      </button>

      <div className={styles.controls}>
        <div className={styles.captureButtonContainer}>
          <button
            onClick={handleCapture}
            className={classNames(styles.captureButton, {
              [styles.capturing]: isCapturing,
            })}
            aria-label="Capture photo"
            type="button"
            disabled={isCapturing || !isActive}
            tabIndex={0}
          >
            <span className={styles.captureButtonInner} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}

