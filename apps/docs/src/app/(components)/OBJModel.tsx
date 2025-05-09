"use client";

import { useLoader } from "@react-three/fiber";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";

export function OBJModel({ modelPath }: { modelPath: string }) {
  const obj = useLoader(OBJLoader, modelPath);
  return <primitive object={obj} />;
}
