"use client";

import { Canvas, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  useGLTF,
  Loader,
  Center,
} from "@react-three/drei";
import { Suspense, useMemo } from "react";

function ScaledModel({ modelPath }: { modelPath: string }) {
  const viewport = useThree((state) => state.viewport);
  const { scene } = useGLTF(modelPath);
  const cloned = useMemo(() => scene.clone(true), [scene]);

  return (
    <Center
      onCentered={({ container, width, height }) => {
        const scale =
          height > width ? viewport.height / height : viewport.width / width;
        container.scale.setScalar(scale * 0.5);
      }}
    >
      <primitive object={cloned} />
    </Center>
  );
}

export function ModelViewer({ modelPath }: { modelPath: string }) {
  return (
    <div
      className="nextra-border"
      style={{
        width: "100%",
        height: 500,
        borderRadius: 20,
        position: "relative",
        overflow: "clip",
        borderStyle: "solid",
        borderWidth: 1,
        margin: "1em 0",
      }}
    >
      <Canvas camera={{ fov: 63 }}>
        <Suspense fallback={null}>
          <Environment preset="studio" />
          <ScaledModel modelPath={modelPath} />
          <OrbitControls makeDefault />
        </Suspense>
      </Canvas>
      <Loader />
    </div>
  );
}
