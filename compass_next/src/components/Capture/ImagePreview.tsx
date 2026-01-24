"use client";

import PrimaryButton from "@/components/Button/PrimaryButton";
import styles from "./ImagePreview.module.css";

interface ImagePreviewProps {
  imageUrl: string;
  onRetake: () => void;
  onConfirm: () => void;
  isProcessing?: boolean;
}

export default function ImagePreview({
  imageUrl,
  onRetake,
  onConfirm,
  isProcessing = false,
}: ImagePreviewProps) {
  return (
    <div className={styles.container}>
      <div className={styles.imageContainer}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imageUrl} alt="Captured photo" className={styles.image} />
        {isProcessing && (
          <div className={styles.overlay}>
            <div className={styles.processingIndicator}>
              <span className={styles.spinner} aria-hidden="true" />
              <p className={styles.processingText}>Processing image...</p>
            </div>
          </div>
        )}
      </div>

      <div className={styles.controls}>
        <PrimaryButton
          onClick={onRetake}
          variant="secondary"
          size="large"
          disabled={isProcessing}
          className={styles.button}
        >
          Retake
        </PrimaryButton>
        <PrimaryButton
          onClick={onConfirm}
          variant="primary"
          size="large"
          disabled={isProcessing}
          isLoading={isProcessing}
          className={styles.button}
        >
          Confirm
        </PrimaryButton>
      </div>
    </div>
  );
}

