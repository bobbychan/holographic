import { STLLoader } from "@/utils/loaders/STLLoader";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import {
  ForwardedRef,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import * as THREE from "three";

interface ModelRenderProps {
  url: string;
  rotate?: "left" | "right";
}

export type MeshHandle = {
  zoom: (type: "in" | "out") => void;
};

const ModelRender = (
  props: ModelRenderProps,
  ref: ForwardedRef<MeshHandle>
) => {
  const { url, rotate } = props;
  const { camera } = useThree();
  const meshRef = useRef<
    THREE.Mesh<THREE.BoxGeometry, THREE.MeshStandardMaterial>
  >(null!);

  const geometry = useLoader(STLLoader, url);
  geometry.center();
  geometry.computeVertexNormals(); // 修复模型法线
  geometry.computeBoundingBox();

  useEffect(() => {
    if (meshRef.current) {
      const { max } = new THREE.Box3().setFromObject(meshRef.current); // 获取模型边框
      camera.position.set(max.x * 1.5, max.y * 1.5, max.z * 1.5); // 设置相机位置
      camera.zoom = 1;
    }
  }, [camera, url]);

  useFrame(() => {
    if (meshRef.current) {
      if (rotate === "left") {
        meshRef.current.rotation.y -= 0.01;
      } else {
        meshRef.current.rotation.y += 0.01;
      }
    }
  });

  useImperativeHandle(ref, () => {
    return {
      zoom: (type: "in" | "out") => {
        if (type === "in") {
          camera.zoom += 0.1;
        } else {
          camera.zoom -= 0.1;
        }
        camera.updateProjectionMatrix();
      },
    };
  });

  return (
    <mesh ref={meshRef} geometry={geometry} name="model">
      <meshStandardMaterial
        color={"#ffffff"}
        transparent={false}
        opacity={1}
        wireframe={true}
        shadowSide={THREE.DoubleSide}
        depthTest={true}
        onUpdate={(self) => {
          self.needsUpdate = true;
        }}
      />
    </mesh>
  );
};

const _ModelRender = forwardRef(ModelRender);

export { _ModelRender as ModelRender };
