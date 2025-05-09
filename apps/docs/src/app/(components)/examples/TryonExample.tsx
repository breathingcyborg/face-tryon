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
import { Suspense, useState } from "react";

const faceProps = [
  {
    name: "Glasses",
    modelPath: "/new_3d/transformed/glasses.glb",
    occluderPath: "/new_3d/reference/ear_occluder.glb",
    imagePath: "/previews/glasses.png",
  },
  {
    name: "Cap",
    modelPath: "/new_3d/transformed/baseball_cap_ny.glb",
    occluderPath: "/new_3d/transformed/baseball_cap_ny_occluder.glb",
    imagePath: "/previews/cap.png",
  },
  {
    name: "Wizard Hat",
    modelPath: "/new_3d/transformed/wizard_hat.glb",
    occluderPath: "/new_3d/transformed/wizard_hat_occluder.glb",
    imagePath: "/previews/wizard_hat.png",
  },
];

export function TryonExample() {
  const { provider, video, setVideo } = useCameraFrameProvider();
  const { width, height } = useFrameDimensions(provider);
  const faces = useFaces(provider);
  const [index, setIndex] = useState(0);
  const prop = faceProps[index];

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
            far: 10000,
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
                <GLTFFaceProp face={face} modelPath={prop.modelPath} />
                <GLTFOccluder face={face} modelPath={prop.occluderPath} />
              </Suspense>
            ))}
          </CoverFit>
        </Canvas>
        <PropSelector index={index} setIndex={setIndex} />
        <Loader containerStyles={{ backgroundColor: "rgba(0,0,0,0.2)" }} />
        <SafeAreaIndicator
          containerStyle={{
            paddingBottom: 120,
          }}
        />
      </div>
    </div>
  );
}

function PropSelector({
  index,
  setIndex,
}: {
  index: number;
  setIndex: (index: number) => void;
}) {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        width: "100%",
        background: "rgba(0, 0, 0, 0.6)",
        padding: 16,
        display: "flex",
        justifyContent: "center",
        gap: 12,
        overflowX: "auto",
      }}
    >
      {faceProps.map((prop, i) => (
        <button
          key={i}
          onClick={() => setIndex(i)}
          style={{
            flexShrink: 0,
            borderRadius: "50%",
            border: index === i ? "3px solid #fff" : "2px solid transparent",
            padding: 2,
            background: "none",
            cursor: "pointer",
          }}
        >
          <img
            src={prop.imagePath}
            alt={prop.name}
            style={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        </button>
      ))}
    </div>
  );
}
