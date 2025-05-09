"use client";

import { useMemo } from "react";
import { FaceResult, getThreeJSTransformationMatrix } from "face-tryon-core";

export function useFaceTransformMatrix(face: FaceResult) {
  const { transformationMatrix } = face;

  const matrix = useMemo(() => {
    if (!transformationMatrix) {
      return null;
    }
    return getThreeJSTransformationMatrix(transformationMatrix);
  }, [transformationMatrix]);

  return matrix;
}
