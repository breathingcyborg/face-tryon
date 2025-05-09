"use client";

import { useEffect, useMemo, useState } from "react";
import { Texture, VideoTexture } from "three";
import {
  CAMERA_VERTICAL_FOV_DEGRESS,
  getVideoPlaneDistance,
} from "face-tryon-core";

export type VideoBackgroundProps = {
  image?: TexImageSource | null;
  frameDimensions: { width: number; height: number };
  cameraVerticalFov?: number;
};

export function VideoBackground({
  frameDimensions,
  image,
  cameraVerticalFov = CAMERA_VERTICAL_FOV_DEGRESS,
}: VideoBackgroundProps) {
  const [id, setId] = useState(0);

  const distance = getVideoPlaneDistance({
    cameraVerticalFov: cameraVerticalFov,
    frameHeight: frameDimensions.height,
  });

  const positionZ = -1 * distance;

  const texture = useMemo(() => {
    if (!image) {
      return null;
    }
    if (image instanceof HTMLVideoElement) {
      return new VideoTexture(image);
    }
    const texture = new Texture(image);
    texture.needsUpdate = true;
    return texture;
  }, [image, id]);

  useEffect(() => {
    if (!(image instanceof HTMLImageElement)) return;

    const handleLoad = () => {
      setId((id) => id + 1);
    };

    if (image.complete) {
      handleLoad();
      return;
    }

    image.addEventListener("load", handleLoad);
    return () => image.removeEventListener("load", handleLoad);
  }, [image]);

  if (!texture) {
    return null;
  }

  return (
    <mesh position={[0, 0, positionZ]} renderOrder={0}>
      <planeGeometry args={[frameDimensions.width, frameDimensions.height]} />
      <meshBasicMaterial
        map={texture}
        depthWrite={false}
        depthTest={true}
        // depthWrite={true}
      />
    </mesh>
  );
}
