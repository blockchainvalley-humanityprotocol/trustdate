'use client';

import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, PresentationControls, Stage, Float } from '@react-three/drei';
import { Vector3, Mesh } from 'three';

interface ModelProps {
  path: string;
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
}

function Model({ path, scale = 1, position = [0, 0, 0], rotation = [0, 0, 0] }: ModelProps) {
  const ref = useRef<Mesh>(null);
  const { scene } = useGLTF(path);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.getElapsedTime() * 0.15;
    }
  });

  return (
    <primitive 
      ref={ref} 
      object={scene} 
      scale={scale} 
      position={new Vector3(...position)} 
      rotation={rotation} 
    />
  );
}

interface ThreeDModelProps {
  modelPath: string;
  scale?: number;
  autoRotate?: boolean;
  enableZoom?: boolean;
  className?: string;
  interactive?: boolean;
}

export default function ThreeDModel({ 
  modelPath, 
  scale = 1, 
  autoRotate = true, 
  enableZoom = false,
  className = '',
  interactive = true
}: ThreeDModelProps) {
  return (
    <div className={`${className}`}>
      <Canvas shadows dpr={[1, 2]} camera={{ fov: 45 }}>
        <color attach="background" args={['#f8f9fa']} />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        
        {interactive ? (
          <PresentationControls
            global
            rotation={[0, -Math.PI / 4, 0]}
            polar={[-Math.PI / 4, Math.PI / 4]}
            azimuth={[-Math.PI / 4, Math.PI / 4]}
            // @ts-ignore - drei 타입 정의 문제 무시
            config={{ mass: 2, tension: 500 }}
            snap={{ mass: 4, tension: 1500 }}
          >
            <Float rotationIntensity={0.4}>
              <Model path={modelPath} scale={scale} />
            </Float>
          </PresentationControls>
        ) : (
          <Stage environment="city" intensity={0.6}>
            <Model path={modelPath} scale={scale} />
          </Stage>
        )}
        
        {autoRotate && <OrbitControls autoRotate enableZoom={enableZoom} />}
      </Canvas>
    </div>
  );
} 