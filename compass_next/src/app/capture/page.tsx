"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import CameraView from "@/components/Capture/CameraView";
import ImagePreview from "@/components/Capture/ImagePreview";
import CategoryResults from "@/components/Capture/CategoryResults";
import PlaceConfirmationForm from "@/components/Capture/PlaceConfirmationForm";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import { useImageCapture } from "@/hooks/useImageCapture";
import { CaptureStep, CategorizationResult, PlaceData } from "@/types/capture";
import styles from "./capture.module.css";

export default function CapturePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<CaptureStep>("camera");
  const [categorizationResults, setCategorizationResults] =
    useState<CategorizationResult | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { capturedImage, imagePreviewUrl, captureImage, clearImage, isCapturing } =
    useImageCapture();

  const handleCapture = useCallback(
    async (videoElement: HTMLVideoElement) => {
      try {
        setError(null);
        await captureImage(videoElement);
        setCurrentStep("preview");
      } catch (err) {
        const error = err as Error;
        setError(error.message || "Failed to capture image");
      }
    },
    [captureImage]
  );

  const handleRetake = useCallback(() => {
    clearImage();
    setCategorizationResults(null);
    setSelectedCategory("");
    setCurrentStep("camera");
    setError(null);
  }, [clearImage]);

  const handleConfirmImage = useCallback(async () => {
    if (!capturedImage) {
      setError("No image captured");
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);

      // Create FormData to send image
      const formData = new FormData();
      formData.append("image", capturedImage, "capture.jpg");

      // Call API to categorize image
      const response = await fetch("/api/categorize-image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to categorize image");
      }

      const result: CategorizationResult = await response.json();
      setCategorizationResults(result);
      setSelectedCategory(result.suggestedPlaceName);
      setCurrentStep("results");
    } catch (err) {
      const error = err as Error;
      setError(error.message || "Failed to categorize image");
      console.error("Error categorizing image:", error);
    } finally {
      setIsProcessing(false);
    }
  }, [capturedImage]);

  const handleCategorySelect = useCallback((category: string) => {
    setSelectedCategory(category);
  }, []);

  const handleSavePlace = useCallback(
    async (data: {
      placeName: string;
      placeDescription: string;
      category: string;
      location: { lat: number; lng: number; accuracy?: number };
    }) => {
      try {
        setIsProcessing(true);
        setError(null);

        // Mock save - in production, this would call an API
        const placeData: PlaceData = {
          imageUrl: imagePreviewUrl || "",
          placeName: data.placeName,
          placeDescription: data.placeDescription,
          category: data.category,
          location: data.location,
          createdAt: new Date().toISOString(),
        };

        // For now, store in localStorage as a mock
        const existingPlaces = JSON.parse(
          localStorage.getItem("places") || "[]"
        ) as PlaceData[];
        existingPlaces.push(placeData);
        localStorage.setItem("places", JSON.stringify(existingPlaces));

        // Show success state
        setCurrentStep("success");

        // Navigate to place detail after a short delay
        setTimeout(() => {
          const placeId = existingPlaces.length - 1;
          router.push(`/place/${placeId}`);
        }, 2000);
      } catch (err) {
        const error = err as Error;
        setError(error.message || "Failed to save place");
        console.error("Error saving place:", error);
      } finally {
        setIsProcessing(false);
      }
    },
    [imagePreviewUrl, router]
  );


  const handleCancel = useCallback(() => {
    router.push("/");
  }, [router]);

  // Render based on current step
  if (currentStep === "camera") {
    return (
      <div className={styles.page}>
        <CameraView
          onCapture={handleCapture}
          onCancel={handleCancel}
          onSwitchCamera={() => {}}
          isCapturing={isCapturing}
        />
        {error && (
          <div className={styles.errorBanner} role="alert">
            {error}
          </div>
        )}
      </div>
    );
  }

  if (currentStep === "preview" && imagePreviewUrl) {
    return (
      <div className={styles.page}>
        <ImagePreview
          imageUrl={imagePreviewUrl}
          onRetake={handleRetake}
          onConfirm={handleConfirmImage}
          isProcessing={isProcessing}
        />
        {error && (
          <div className={styles.errorBanner} role="alert">
            {error}
          </div>
        )}
      </div>
    );
  }

  if (currentStep === "results" && categorizationResults) {
    const displayCategory = selectedCategory || categorizationResults.suggestedPlaceName;
    
    return (
      <div className={styles.page}>
        <div className={styles.resultsContainer}>
          <div className={styles.resultsHeader}>
            <button
              onClick={handleRetake}
              className={styles.backButton}
              type="button"
              aria-label="Back to preview"
            >
              ← Back
            </button>
            {imagePreviewUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imagePreviewUrl}
                alt="Captured place"
                className={styles.thumbnail}
              />
            )}
          </div>
          <div className={styles.resultsContent}>
            <CategoryResults
              results={categorizationResults}
              selectedCategory={selectedCategory}
              onSelectCategory={handleCategorySelect}
            />
            {displayCategory && (
              <PlaceConfirmationForm
                initialPlaceName={categorizationResults.suggestedPlaceName}
                initialCategory={displayCategory}
                onSave={handleSavePlace}
                onBack={() => setCurrentStep("preview")}
                isLoading={isProcessing}
              />
            )}
          </div>
        </div>
        {error && (
          <div className={styles.errorBanner} role="alert">
            {error}
          </div>
        )}
      </div>
    );
  }

  if (currentStep === "success") {
    return (
      <div className={styles.successContainer}>
        <div className={styles.successContent}>
          <span className={styles.successIcon} aria-hidden="true">
            ✓
          </span>
          <h2 className={styles.successTitle}>Place Saved!</h2>
          <p className={styles.successMessage}>Redirecting to place detail...</p>
          <LoadingSpinner size="medium" />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.loadingContainer}>
      <LoadingSpinner size="large" message="Loading..." />
    </div>
  );
}
