"use client";

import { useState, FormEvent } from "react";
import PrimaryButton from "@/components/Button/PrimaryButton";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import { useGeolocation } from "@/hooks/useGeolocation";
import styles from "./PlaceConfirmationForm.module.css";

interface PlaceConfirmationFormProps {
  initialPlaceName: string;
  initialCategory: string;
  onSave: (data: {
    placeName: string;
    placeDescription: string;
    category: string;
    location: { lat: number; lng: number; accuracy?: number };
  }) => Promise<void>;
  onBack: () => void;
  isLoading?: boolean;
}

export default function PlaceConfirmationForm({
  initialPlaceName,
  initialCategory,
  onSave,
  onBack,
  isLoading = false,
}: PlaceConfirmationFormProps) {
  const [placeName, setPlaceName] = useState(initialPlaceName);
  const [placeDescription, setPlaceDescription] = useState("");
  const [errors, setErrors] = useState<{
    placeName?: string;
    location?: string;
  }>({});

  const { location, error: locationError, isLoading: locationLoading, getLocation } =
    useGeolocation();

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!placeName.trim() || placeName.trim().length < 2) {
      newErrors.placeName = "Place name must be at least 2 characters";
    }

    if (!location) {
      newErrors.location = "Location is required. Please enable location access.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGetLocation = async () => {
    await getLocation();
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm() || !location) {
      return;
    }

    await onSave({
      placeName: placeName.trim(),
      placeDescription: placeDescription.trim(),
      category: initialCategory,
      location: {
        lat: location.lat,
        lng: location.lng,
        accuracy: location.accuracy,
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.container} noValidate>
      <div className={styles.header}>
        <h2 className={styles.title}>Confirm Place Details</h2>
        <p className={styles.subtitle}>Review and confirm the place information</p>
      </div>

      <div className={styles.formFields}>
        <div className={styles.field}>
          <label htmlFor="placeName" className={styles.label}>
            Place Name <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            id="placeName"
            value={placeName}
            onChange={(e) => {
              setPlaceName(e.target.value);
              if (errors.placeName) {
                setErrors((prev) => ({ ...prev, placeName: undefined }));
              }
            }}
            className={`${styles.input} ${errors.placeName ? styles.inputError : ""}`}
            placeholder="Enter place name"
            required
            aria-required="true"
            aria-invalid={!!errors.placeName}
            aria-describedby={errors.placeName ? "placeName-error" : undefined}
            disabled={isLoading}
          />
          {errors.placeName && (
            <p id="placeName-error" className={styles.errorMessage} role="alert">
              {errors.placeName}
            </p>
          )}
        </div>

        <div className={styles.field}>
          <label htmlFor="category" className={styles.label}>
            Category
          </label>
          <input
            type="text"
            id="category"
            value={initialCategory}
            className={styles.input}
            disabled
            aria-label="Category"
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="placeDescription" className={styles.label}>
            Description (Optional)
          </label>
          <textarea
            id="placeDescription"
            value={placeDescription}
            onChange={(e) => setPlaceDescription(e.target.value)}
            className={styles.textarea}
            placeholder="Add any notes or description about this place..."
            rows={4}
            disabled={isLoading}
            aria-label="Place description"
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>
            Location <span className={styles.required}>*</span>
          </label>
          {location ? (
            <div className={styles.locationInfo}>
              <span className={styles.locationText}>
                Lat: {location.lat.toFixed(6)}, Lng: {location.lng.toFixed(6)}
              </span>
              {location.accuracy && (
                <span className={styles.accuracy}>
                  Accuracy: {Math.round(location.accuracy)}m
                </span>
              )}
              <button
                type="button"
                onClick={handleGetLocation}
                className={styles.updateLocationButton}
                disabled={locationLoading || isLoading}
              >
                {locationLoading ? "Updating..." : "Update Location"}
              </button>
            </div>
          ) : (
            <div className={styles.locationActions}>
              <PrimaryButton
                type="button"
                onClick={handleGetLocation}
                variant="secondary"
                size="medium"
                isLoading={locationLoading}
                disabled={isLoading || locationLoading}
                className={styles.locationButton}
              >
                {locationLoading ? "Getting Location..." : "Get My Location"}
              </PrimaryButton>
              {locationError && (
                <p className={styles.errorMessage} role="alert">
                  {locationError}
                </p>
              )}
              {errors.location && (
                <p className={styles.errorMessage} role="alert">
                  {errors.location}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      <div className={styles.actions}>
        <PrimaryButton
          type="button"
          onClick={onBack}
          variant="secondary"
          size="large"
          disabled={isLoading}
          className={styles.button}
        >
          Back
        </PrimaryButton>
        <PrimaryButton
          type="submit"
          variant="primary"
          size="large"
          isLoading={isLoading}
          disabled={isLoading || !location}
          className={styles.button}
        >
          Save Place
        </PrimaryButton>
      </div>
    </form>
  );
}

