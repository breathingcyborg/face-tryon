"use client";

import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { FaceProp } from "./FaceProp";
import { FaceResult } from "face-tryon-core";
import { forwardRef } from "react";
import { Object3D } from "three";

type GLTFFacePropProps = {
  face: FaceResult;
  modelPath: string;
} & Omit<React.ComponentProps<typeof FaceProp>, 'model'>;

export const GLTFFaceProp = forwardRef<Object3D, GLTFFacePropProps>(
  ({ face, modelPath, ...props }, ref) => {
    const model = useLoader(GLTFLoader, modelPath);

    const scene = Array.isArray(model) ? model[0].scene : model.scene;

    return <FaceProp face={face} model={scene} ref={ref} props={props} />;
  },
);
