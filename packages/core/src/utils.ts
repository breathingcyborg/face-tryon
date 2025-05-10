"use client";

import * as THREE from "three";
import { FaceResult } from "./FaceDetector";
import { CAMERA_VERTICAL_FOV_DEGRESS } from "./constants";

export function getVideoPlaneDistance({
  frameHeight,
  cameraVerticalFov = CAMERA_VERTICAL_FOV_DEGRESS,
}: {
  cameraVerticalFov?: number;
  frameHeight: number;
}) {
  const fovRad = THREE.MathUtils.degToRad(cameraVerticalFov);
  const distance = frameHeight / 2 / Math.tan(fovRad / 2);
  return distance;
}

export function createFaceMeshGeometry(facemesh: FaceResult["faceMesh"]) {
  if (!facemesh) {
    return null;
  }

  const positions = new Float32Array(facemesh.positions);
  const uvs = new Float32Array(facemesh.uvs);
  const indices = new Uint32Array(facemesh.indices);

  const geometry = new THREE.BufferGeometry();

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));

  geometry.setIndex(new THREE.BufferAttribute(indices, 1));
  geometry.computeVertexNormals();

  return geometry;
}

export function createExtendedFaceMeshGeometry(
  facemesh: FaceResult["faceMesh"],
  centerScaleFactor = 2,
  sidesScaleFactor = 0,
) {
  if (!facemesh) {
    return null;
  }

  // forehead vertex pairs [topVertex, vertexBelow]
  const foreheadPairs = [
    // center of forehead
    [10, 151],

    // to left, right from center
    [109, 108],
    [338, 337],

    [67, 69],
    [297, 299],

    [103, 104],
    [332, 333],

    [54, 68],
    [284, 298],

    [21, 71],
    [251, 301],

    [162, 139],
    [389, 368],

    // [127, 34],
    // [356, 264],
  ];

  const extraBottoms = [127, 356]; // [left, right]

  const maxScalingFactor = centerScaleFactor;
  const minScalingFactor = sidesScaleFactor;
  const difference = maxScalingFactor - minScalingFactor;

  // Calculate scaling factors (max at center min at sides)
  const centerIndex = 0;
  const scalingFactors = foreheadPairs.map((_, i) => {
    const distanceFromCenter = Math.abs(i - centerIndex);
    return (
      maxScalingFactor -
      difference * (distanceFromCenter / foreheadPairs.length)
    );
  });

  // Calculate new extended vertices
  const newVertices: [number, number, number][] = [];
  const newVertexIndices: number[] = [];
  const baseIndex = facemesh.positions.length / 3;

  foreheadPairs.forEach(([topIdx, belowIdx], i) => {
    const topVertex = getVertexPosition(facemesh.positions, topIdx);
    const belowVertex = getVertexPosition(facemesh.positions, belowIdx);
    const extendedVertex = calculateExtendedVertex(
      topVertex,
      belowVertex,
      scalingFactors[i],
    );

    newVertices.push(extendedVertex);
    newVertexIndices.push(baseIndex + i);
  });

  // Create new positions array
  const positions = new Float32Array([
    ...facemesh.positions,
    ...newVertices.flat(),
  ]);

  // Create new triangles connecting the extended vertices
  const newTriangles: number[] = [];

  newVertexIndices.forEach((vIndex, i) => {
    const bottomIdx = foreheadPairs[i][0];
    // For first forehead pair, which is center
    // create two triangles
    // one connecting it to left
    // other connecting it to right
    if (i == 0 && newVertexIndices.length >= 3) {
      // points in ccw from center -> left -> bottom
      newTriangles.push(vIndex, newVertexIndices[1], bottomIdx);
      // points in ccw from center -> bottom -> right
      newTriangles.push(vIndex, bottomIdx, newVertexIndices[2]);
      return;
    }

    // for every point except the center
    // create triangle (this new point, next new point, point below)
    if (i + 2 < newVertexIndices.length) {
      const otherVIndex = newVertexIndices[i + 2];
      if (i % 2 !== 0) {
        // odd index connects to point to the left
        // maintain ccw order
        newTriangles.push(vIndex, otherVIndex, bottomIdx);
      } else {
        // even index connects to point to the right
        // maintain ccw order
        newTriangles.push(vIndex, bottomIdx, otherVIndex);
      }
    }

    // for every point except the center
    // connect it to two points on curve below

    // first 2 points connect to center point
    if (i <= 2) {
      // first two points connect to center poins
      const vIndex = newVertexIndices[i];
      const bottom = foreheadPairs[i][0];
      const centerBottom = foreheadPairs[0][0];
      if (i == 1) {
        // point to the left of center
        newTriangles.push(vIndex, bottom, centerBottom);
      } else {
        // point to the right of center
        newTriangles.push(vIndex, centerBottom, bottom);
      }
      return;
    }

    if (i - 2 >= 0) {
      const vIndex = newVertexIndices[i];
      const bottom = foreheadPairs[i][0];
      const previousBottom = foreheadPairs[i - 2][0];
      if (i % 2 !== 0) {
        newTriangles.push(vIndex, bottom, previousBottom);
        // point to the left of center
      } else {
        // right
        newTriangles.push(vIndex, previousBottom, bottom);
      }
    }
  });

  // connect left most to bottom left point of original curve
  // ccw order
  newTriangles.push(
    newVertexIndices[newVertexIndices.length - 2],
    extraBottoms[0],
    foreheadPairs[foreheadPairs.length - 2][0],
  );

  // connect right most to bottom right point of original curve
  // ccw order
  newTriangles.push(
    newVertexIndices[newVertexIndices.length - 1],
    foreheadPairs[foreheadPairs.length - 1][0],
    extraBottoms[1],
  );

  // Create final geometry
  const uvs = new Float32Array(facemesh.uvs);
  const indices = new Uint32Array([...facemesh.indices, ...newTriangles]);

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
  geometry.setIndex(new THREE.BufferAttribute(indices, 1));
  geometry.computeVertexNormals();

  return geometry;
}

export function getThreeJSTransformationMatrix(transformationMatrix: number[]) {
  return new THREE.Matrix4().fromArray(transformationMatrix);
}

export function isMesh(obj: THREE.Object3D): obj is THREE.Mesh {
  return (obj as THREE.Mesh).isMesh === true;
}

/**
 * returns scale for creating effect similar
 * to css object fit cover
 *
 * @param dimensions
 * @param dimensions.viewport viewport / html canvas dimensions
 * @param dimensions.frame video frame / image dimensions
 * @returns {[number, number, number]}
 */
export function getCoverFitScale({
  cameraVerticalFov = CAMERA_VERTICAL_FOV_DEGRESS,
  viewport,
  frame,
}: {
  cameraVerticalFov?: number;
  viewport: { width: number; height: number };
  frame: { width: number; height: number };
}): [number, number, number] {
  if (viewport.width === 0 || viewport.height === 0) {
    return [1, 1, 1];
  }

  if (frame.width === 0 || frame.height === 0) {
    return [1, 1, 1];
  }

  const distance = getVideoPlaneDistance({
    cameraVerticalFov: cameraVerticalFov,
    frameHeight: frame.height,
  });

  const visibleHeight =
    2 * distance * Math.tan(THREE.MathUtils.degToRad(63 / 2));

  const viewportAspect = viewport.width / viewport.height;
  const planeAspect = frame.width / frame.height;

  const ratio = viewportAspect / planeAspect;
  const scalingFactor = (visibleHeight / frame.height) * Math.max(ratio, 1);

  return [scalingFactor, scalingFactor, 1];
}

export function makeOccluder(model: THREE.Object3D) {
  model.traverse((child) => {
    if (child instanceof THREE.Mesh || (child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;
      if (mesh.material) {
        const materials = Array.isArray(mesh.material)
          ? mesh.material
          : [mesh.material];
        materials.forEach((mat) => {
          console.debug({ occluderMatId: mat.id });
          mat.colorWrite = false;
          // mat.depthTest = true;
          // mat.depthWrite = true;
          // mat.transparent = false;
          mat.needsUpdate = true;
        });
      }
    }
  });
  return model;
}

function getVertexPosition(
  positions: number[],
  vertexIndex: number,
): [number, number, number] {
  const base = vertexIndex * 3;
  return [positions[base], positions[base + 1], positions[base + 2]];
}

function calculateExtendedVertex(
  vertex: [number, number, number],
  vertexBelow: [number, number, number],
  extensionFactor: number = 1.0,
): [number, number, number] {
  const direction = [
    vertex[0] - vertexBelow[0],
    vertex[1] - vertexBelow[1],
    vertex[2] - vertexBelow[2],
  ];
  return [
    vertex[0] + direction[0] * extensionFactor,
    vertex[1] + direction[1] * extensionFactor,
    vertex[2] + direction[2] * extensionFactor,
  ];
}

export function deepCloneWithMaterial(model: THREE.Object3D | THREE.Group) {
  const clone = model.clone(true);

  const materialCache = new Map<number, THREE.Material>();

  const getClonedMat = (mat: THREE.Material) => {
    const id = mat.id;

    if (!materialCache.has(id)) {
      const clonedMaterial = mat.clone();
      materialCache.set(id, clonedMaterial);
    }

    return materialCache.get(id) as THREE.Material;
  };

  clone.traverse((child) => {
    if (child instanceof THREE.Mesh || (child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;

      if (mesh.material) {
        if (Array.isArray(mesh.material)) {
          mesh.material = mesh.material.map((mat) => getClonedMat(mat));
          return;
        }
        mesh.material = getClonedMat(mesh.material);
      }
    }
  });

  materialCache.clear();

  return clone;
}
