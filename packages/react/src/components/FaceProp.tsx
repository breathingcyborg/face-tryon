"use client";

import { forwardRef, JSX, useEffect } from "react";
import { useFaceTransformMatrix } from "../hooks/useFaceTransformMatrix";
import { FaceResult } from "face-tryon-core";
import { isMesh } from "face-tryon-core";
import { Object3D, Object3DEventMap } from "three";

type FacePropProps = {
  face: FaceResult;
  model: Object3D;
} & JSX.IntrinsicElements["primitive"];

export const FaceProp = forwardRef<Object3D, FacePropProps>(
  ({ face, model, ...props }, ref) => {
    const matrix = useFaceTransformMatrix(face);

    useEffect(() => {
      if (!model) return;
      model.traverse?.((child: Object3D<Object3DEventMap>) => {
        if (isMesh(child)) {
          const materials = Array.isArray(child.material)
            ? child.material
            : [child.material];
          materials.forEach((material) => {
            material.depthTest = true;
            material.depthWrite = true;
          });
        }
      });
    }, [model]);

    if (!matrix) return null;

    return (
      <primitive
        renderOrder={2}
        ref={ref}
        matrix={matrix}
        matrixAutoUpdate={false}
        object={model}
        {...props}
      />
    );
  },
);
