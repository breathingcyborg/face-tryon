"use client";

import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Occluder } from "./Occluder";
import { FaceResult } from "face-tryon-core";
import { forwardRef } from "react";
import { Object3D } from "three";

export type GLTFOccluderProps = {
  face: FaceResult;
  modelPath: string;
} & React.ComponentProps<typeof Occluder>;

export const GLTFOccluder = forwardRef<Object3D, GLTFOccluderProps>(
  ({ face, modelPath, ...props }, ref) => {
    const model = useLoader(GLTFLoader, modelPath);

    const scene = Array.isArray(model) ? model[0].scene : model.scene;

    return <Occluder face={face} model={scene} ref={ref} props={props} />;
  },
);
