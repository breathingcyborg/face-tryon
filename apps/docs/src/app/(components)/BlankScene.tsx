"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Loader } from "@react-three/drei";
import { Suspense } from "react";

export function BlankScene({ children }: { children: React.ReactNode }) {
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
          {children}
          <OrbitControls makeDefault />
        </Suspense>
      </Canvas>
      <Loader />
    </div>
  );
}
