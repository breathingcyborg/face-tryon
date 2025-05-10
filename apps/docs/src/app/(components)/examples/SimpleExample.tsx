"use client";

import { Environment, Loader } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { CAMERA_POSITION, CAMERA_VERTICAL_FOV_DEGRESS } from "face-tryon-core";
import {
  useCameraFrameProvider,
  useFrameDimensions,
  useFaces,
  VideoBackground,
  CoverFit,
  FaceOccluder,
  GLTFFaceProp,
  GLTFOccluder,
  SafeAreaIndicator,
} from "face-tryon-react";
import { Suspense } from "react";

export function SimpleExample() {
  const { provider, video, setVideo } = useCameraFrameProvider();
  const { width, height } = useFrameDimensions(provider);
  const faces = useFaces(provider);

  return (
    <div style={{ position: "relative" }}>
      <video
        ref={setVideo}
        autoPlay
        playsInline
        muted
        style={{ visibility: "hidden", width: 1, height: 1 }}
      />
      <div style={{ width: "100%", height: 500 }}>
        <Canvas
          style={{ transform: "scaleX(-1)" }}
          camera={{
            fov: CAMERA_VERTICAL_FOV_DEGRESS,
            position: CAMERA_POSITION,
            near: 0.01,
            far: 1000,
          }}
        >
          <Environment preset="studio" />
          <CoverFit width={width} height={height}>
            <VideoBackground
              frameDimensions={{ width, height }}
              image={video}
            />
            {faces.map((face, i) => (
              <Suspense key={i} fallback={null}>
                <FaceOccluder face={face} />
                <GLTFFaceProp face={face} modelPath="/glasses.glb" />
                <GLTFOccluder face={face} modelPath="/ear_occluder.glb" />
              </Suspense>
            ))}
          </CoverFit>
        </Canvas>
        <Loader containerStyles={{ backgroundColor: "rgba(0,0,0,0.2)" }} />
        <SafeAreaIndicator />
      </div>
    </div>
  );
}
