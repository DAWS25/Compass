import { NextRequest, NextResponse } from "next/server";
import { CategorizationResult, RekognitionLabel } from "@/types/capture";

// Mock categorization function that simulates AWS Rekognition
function mockCategorizeImage(imageBlob: Blob): Promise<CategorizationResult> {
  return new Promise((resolve) => {
    // Simulate processing delay (1-2 seconds)
    setTimeout(() => {
      // Generate mock labels based on common place types
      const mockLabels: RekognitionLabel[] = [
        {
          Name: "Restaurant",
          Confidence: 95.5,
          Categories: [{ Name: "Food and Dining" }],
        },
        {
          Name: "Building",
          Confidence: 87.2,
          Categories: [{ Name: "Architecture" }],
        },
        {
          Name: "Indoor",
          Confidence: 82.1,
          Categories: [{ Name: "Environment" }],
        },
        {
          Name: "Food",
          Confidence: 78.9,
          Categories: [{ Name: "Food and Dining" }],
        },
        {
          Name: "Person",
          Confidence: 65.3,
          Categories: [{ Name: "People" }],
        },
      ];

      const suggestedPlaceName = mockLabels[0].Name;
      const suggestedCategory =
        mockLabels[0].Categories?.[0]?.Name || "General";

      resolve({
        labels: mockLabels,
        suggestedPlaceName,
        suggestedCategory,
      });
    }, 1500 + Math.random() * 500); // Random delay between 1.5-2 seconds
  });
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get("image") as File | null;

    if (!imageFile) {
      return NextResponse.json(
        { error: "No image file provided" },
        { status: 400 }
      );
    }

    // Validate image type
    const validImageTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validImageTypes.includes(imageFile.type)) {
      return NextResponse.json(
        { error: "Invalid image type. Please provide a JPEG, PNG, or WebP image." },
        { status: 400 }
      );
    }

    // Validate image size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (imageFile.size > maxSize) {
      return NextResponse.json(
        { error: "Image size too large. Maximum size is 10MB." },
        { status: 400 }
      );
    }

    // Convert File to Blob
    const imageBlob = new Blob([await imageFile.arrayBuffer()], {
      type: imageFile.type,
    });

    // Mock categorization
    const result = await mockCategorizeImage(imageBlob);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error categorizing image:", error);
    return NextResponse.json(
      { error: "Failed to categorize image. Please try again." },
      { status: 500 }
    );
  }
}

