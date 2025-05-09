"use client";

import { useThree } from "@react-three/fiber";
import React from "react";
import { CAMERA_VERTICAL_FOV_DEGRESS, getCoverFitScale } from "face-tryon-core";

export function CoverFit({
  width,
  height,
  cameraVerticalFov = CAMERA_VERTICAL_FOV_DEGRESS,
  children,
}: {
  width: number;
  height: number;
  cameraVerticalFov?: number;
  children: React.ReactNode;
}) {
  const size = useThree((state) => state.size);
  const scale = getCoverFitScale({
    viewport: { ...size },
    frame: { width, height },
    cameraVerticalFov: cameraVerticalFov,
  });

  return <group scale={scale}>{children}</group>;
}
