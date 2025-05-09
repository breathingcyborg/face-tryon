"use client";

import { useGLTF } from "@react-three/drei";
import { useMemo } from "react";

export function GLTFModel({ modelPath }: { modelPath: string }) {
  const { scene } = useGLTF(modelPath);
  const clonedScene = useMemo(() => scene.clone(true), [scene]);
  return <primitive object={clonedScene} />;
}
