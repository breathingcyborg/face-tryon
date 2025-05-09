"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  FrameProvider,
  FaceDetector,
  FaceDetectorOptions,
  FaceResult,
} from "face-tryon-core";
import { useRaf } from "./useRaf";

export function useFaces(
  provider: FrameProvider | null,
  options?: FaceDetectorOptions,
) {
  const detectorRef = useRef<FaceDetector | null>(null);
  const [results, setResults] = useState<FaceResult[]>([]);

  // init face detection model
  useEffect(() => {
    const init = async () => {
      if (!provider) {
        return;
      }

      const detector = new FaceDetector(provider);
      await detector.initialize(options);
      detectorRef.current = detector;
    };
    init();
  }, [provider, options]);

  const detectFaces = useCallback(() => {
    if (!provider || !detectorRef.current) {
      return;
    }
    const faces = detectorRef.current.detectFaces();
    setResults(faces);
  }, [provider]);

  // detect faces loop
  useRaf(detectFaces);

  return results;
}
