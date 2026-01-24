export interface RekognitionLabel {
  Name: string;
  Confidence: number;
  Categories?: Array<{
    Name: string;
  }>;
}

export interface CategorizationResult {
  labels: RekognitionLabel[];
  suggestedPlaceName: string;
  suggestedCategory: string;
}

export interface PlaceData {
  imageUrl: string;
  placeName: string;
  placeDescription: string;
  category: string;
  location: {
    lat: number;
    lng: number;
    accuracy?: number;
  };
  createdAt: string;
}

export type CaptureStep = "camera" | "preview" | "results" | "success";

