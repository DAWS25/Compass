"use client";

import { CategorizationResult } from "@/types/capture";
import styles from "./CategoryResults.module.css";

interface CategoryResultsProps {
  results: CategorizationResult;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export default function CategoryResults({
  results,
  selectedCategory,
  onSelectCategory,
}: CategoryResultsProps) {
  const topLabels = results.labels.slice(0, 5);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Suggested Categories</h2>
        <p className={styles.subtitle}>Select the most appropriate category for this place</p>
      </div>

      <div className={styles.categories}>
        {topLabels.map((label) => {
          const isSelected = selectedCategory === label.Name;
          const categoryName = label.Categories?.[0]?.Name || "General";
          const confidence = Math.round(label.Confidence);

          return (
            <button
              key={label.Name}
              type="button"
              onClick={() => onSelectCategory(label.Name)}
              className={`${styles.categoryCard} ${isSelected ? styles.selected : ""}`}
              aria-pressed={isSelected}
              aria-label={`Select category: ${label.Name} (${confidence}% confidence)`}
            >
              <div className={styles.categoryHeader}>
                <span className={styles.categoryName}>{label.Name}</span>
                <span className={styles.confidence}>{confidence}%</span>
              </div>
              <div className={styles.categoryType}>{categoryName}</div>
              {isSelected && (
                <span className={styles.checkmark} aria-hidden="true">
                  ✓
                </span>
              )}
            </button>
          );
        })}
      </div>

      {results.suggestedPlaceName && (
        <div className={styles.suggestion}>
          <p className={styles.suggestionText}>
            Suggested name: <strong>{results.suggestedPlaceName}</strong>
          </p>
        </div>
      )}
    </div>
  );
}

