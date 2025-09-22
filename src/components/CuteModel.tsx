import React, { useRef, useEffect } from 'react';
import { useGLTF, OrbitControls, Environment, ContactShadows, SoftShadows } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CuteModelProps {
  position?: [number, number, number];
  scale?: number;
}

const CuteModel: React.FC<CuteModelProps> = ({ position = [0, 0, 0], scale = 1 }) => {
  const group = useRef<THREE.Group>(null);
  const { scene } = useGLTF('/cute.glb');

  // Traverse the scene to modify materials for a fluffier, smoother look
  scene.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      // Ensure the mesh has a material
      if (child.material instanceof THREE.MeshStandardMaterial) {
        // Adjust material properties for a fluffier look
        child.material.roughness = 0.3;
        child.material.metalness = 0.0;
        child.material.flatShading = false;
        // Add a slight emissive glow for fluffiness
        child.material.emissive = new THREE.Color(0x222222);
      } else if (child.material instanceof THREE.Material) {
        // For other material types, replace with a standard material
        child.material = new THREE.MeshStandardMaterial({ 
          color: '#ffffff',
          roughness: 0.3,
          metalness: 0.0,
          flatShading: false,
          emissive: new THREE.Color(0x222222)
        });
      } else {
        // If no material, create a new standard material
        child.material = new THREE.MeshStandardMaterial({ 
          color: '#ffffff',
          roughness: 0.3,
          metalness: 0.0,
          flatShading: false,
          emissive: new THREE.Color(0x222222)
        });
      }
      
      // Enable shadows for all meshes
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  return (
    <group ref={group} position={position} scale={[scale, scale, scale]}>
      <primitive object={scene} />
    </group>
  );
};

const CuteModelCanvas: React.FC = () => {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 50 }}
      style={{ height: '100%', width: '100%' }}
      shadows
    >
      <SoftShadows size={15} samples={15} />
      <ambientLight intensity={0.8} />
      <pointLight position={[10, 10, 10]} intensity={1} castShadow />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      <pointLight position={[0, 5, 5]} intensity={0.5} color="#ffd700" />
      <spotLight
        position={[0, 15, 0]}
        angle={0.3}
        penumbra={1}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <CuteModel scale={3.5} />
      <Environment preset="city" />
      <ContactShadows 
        position={[0, -2, 0]} 
        opacity={0.6} 
        scale={30} 
        blur={3} 
        far={4} 
      />
      <OrbitControls 
        enableZoom={true}
        enablePan={true}
        enableRotate={true}
        minPolarAngle={0}
        maxPolarAngle={Math.PI}
        autoRotate
        autoRotateSpeed={0.3}
      />
    </Canvas>
  );
};

export default CuteModelCanvas;