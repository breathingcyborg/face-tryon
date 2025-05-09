"use client";

import { forwardRef, JSX, useMemo } from "react";
import { useFaceTransformMatrix } from "../hooks/useFaceTransformMatrix";
import {
  FaceResult,
  createExtendedFaceMeshGeometry,
  createFaceMeshGeometry,
} from "face-tryon-core";
import { Mesh } from "three";

/**
 * @property {FaceResult} face
 * @property {boolean | undefined} extended - Would extend forehead if true
 * @default false
 * @property {number | undefined} centerScaleFactor - Scaling factor for center of forehead
 * @property {number | undefined} sidesScaleFactor - Scaling factor for center of forehead
 * @property {React.ReactNode} [children] - Custom material for the mesh.
 */
type FaceOccluderProps = {
  face: FaceResult;
  extended?: boolean;
  centerScaleFactor?: number;
  sidesScaleFactor?: number;
} & JSX.IntrinsicElements["mesh"];

export const FaceOccluder = forwardRef<Mesh, FaceOccluderProps>(
  ({ face, extended, centerScaleFactor, sidesScaleFactor, ...props }, ref) => {
    const { faceMesh } = face;

    const matrix = useFaceTransformMatrix(face);
    const adjustedMatrix = matrix?.clone();
    if (adjustedMatrix) {
      adjustedMatrix.elements[14] -= 0.1;
    }

    const geometry = useMemo(() => {
      if (!faceMesh) {
        return null;
      }
      if (!extended) {
        return createFaceMeshGeometry(faceMesh);
      }
      return createExtendedFaceMeshGeometry(
        faceMesh,
        centerScaleFactor,
        sidesScaleFactor,
      );
    }, [faceMesh, extended, centerScaleFactor, sidesScaleFactor]);

    if (!matrix || !geometry) {
      return null;
    }

    return (
      <mesh
        ref={ref}
        renderOrder={1}
        matrix={adjustedMatrix}
        matrixAutoUpdate={false}
        geometry={geometry}
        {...props}
      >
        <meshStandardMaterial colorWrite={false} />
      </mesh>
    );
  },
);
