import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { createScene, createCamera, createRenderer, createAmbientLight, createDirectionalLight, createAnimationLoop, handleResize } from '@/lib/three-utils';

interface ThreeSceneProps {
  className?: string;
  backgroundColor?: number;
  ambientLightColor?: number;
  ambientLightIntensity?: number;
  directionalLightColor?: number;
  directionalLightIntensity?: number;
  directionalLightPosition?: [number, number, number];
  cameraPosition?: [number, number, number];
  animate?: boolean;
}

const ThreeScene: React.FC<ThreeSceneProps> = ({
  className = '',
  backgroundColor = 0x000000,
  ambientLightColor = 0xffffff,
  ambientLightIntensity = 0.5,
  directionalLightColor = 0xffffff,
  directionalLightIntensity = 1,
  directionalLightPosition = [5, 5, 5],
  cameraPosition = [0, 0, 5],
  animate = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Create scene
    const scene = createScene({ backgroundColor });
    sceneRef.current = scene;
    
    // Create camera
    const camera = createCamera({
      position: cameraPosition,
    });
    cameraRef.current = camera;
    
    // Create renderer
    const renderer = createRenderer({
      canvas: containerRef.current.querySelector('canvas') as HTMLCanvasElement,
      width: containerRef.current.clientWidth,
      height: containerRef.current.clientHeight,
    });
    rendererRef.current = renderer;
    
    // Add lights
    const ambientLight = createAmbientLight({
      color: ambientLightColor,
      intensity: ambientLightIntensity,
    });
    scene.add(ambientLight);
    
    const directionalLight = createDirectionalLight({
      color: directionalLightColor,
      intensity: directionalLightIntensity,
      position: directionalLightPosition,
    });
    scene.add(directionalLight);
    
    // Add a simple cube for testing
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ color: 0x44aa88 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    
    // Handle window resize
    const cleanupResize = handleResize(camera, renderer);
    
    // Animation loop
    let cleanupAnimation: (() => void) | undefined;
    
    if (animate) {
      cleanupAnimation = createAnimationLoop((time) => {
        if (!cube) return;
        
        // Rotate the cube
        cube.rotation.x = time * 0.001;
        cube.rotation.y = time * 0.0005;
        
        // Render the scene
        if (renderer && scene && camera) {
          renderer.render(scene, camera);
        }
      });
    } else {
      // Render once if not animating
      renderer.render(scene, camera);
    }
    
    // Append the renderer to the container
    if (containerRef.current) {
      containerRef.current.appendChild(renderer.domElement);
    }
    
    // Cleanup
    return () => {
      if (cleanupAnimation) cleanupAnimation();
      cleanupResize();
      
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      
      if (containerRef.current && containerRef.current.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [
    backgroundColor,
    ambientLightColor,
    ambientLightIntensity,
    directionalLightColor,
    directionalLightIntensity,
    directionalLightPosition,
    cameraPosition,
    animate,
  ]);
  
  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      <canvas className="block w-full h-full" />
    </div>
  );
};

export default ThreeScene;