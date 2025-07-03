import * as THREE from 'three';

/**
 * Creates a basic Three.js scene
 * @param options - Scene options
 */
export const createScene = (options: {
  backgroundColor?: number;
  fogColor?: number;
  fogNear?: number;
  fogFar?: number;
} = {}) => {
  const { backgroundColor = 0x000000, fogColor, fogNear = 1, fogFar = 1000 } = options;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(backgroundColor);

  if (fogColor !== undefined) {
    scene.fog = new THREE.Fog(fogColor, fogNear, fogFar);
  }

  return scene;
};

/**
 * Creates a perspective camera
 * @param options - Camera options
 */
export const createCamera = (options: {
  fov?: number;
  aspect?: number;
  near?: number;
  far?: number;
  position?: [number, number, number];
} = {}) => {
  const {
    fov = 75,
    aspect = window.innerWidth / window.innerHeight,
    near = 0.1,
    far = 1000,
    position = [0, 0, 5],
  } = options;

  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(...position);

  return camera;
};

/**
 * Creates a WebGL renderer
 * @param options - Renderer options
 */
export const createRenderer = (options: {
  antialias?: boolean;
  alpha?: boolean;
  canvas?: HTMLCanvasElement;
  pixelRatio?: number;
  width?: number;
  height?: number;
} = {}) => {
  const {
    antialias = true,
    alpha = false,
    canvas,
    pixelRatio = window.devicePixelRatio,
    width = window.innerWidth,
    height = window.innerHeight,
  } = options;

  const renderer = new THREE.WebGLRenderer({
    antialias,
    alpha,
    canvas,
  });

  renderer.setPixelRatio(pixelRatio);
  renderer.setSize(width, height);

  return renderer;
};

/**
 * Creates ambient light
 * @param options - Light options
 */
export const createAmbientLight = (options: {
  color?: number;
  intensity?: number;
} = {}) => {
  const { color = 0xffffff, intensity = 0.5 } = options;
  return new THREE.AmbientLight(color, intensity);
};

/**
 * Creates directional light
 * @param options - Light options
 */
export const createDirectionalLight = (options: {
  color?: number;
  intensity?: number;
  position?: [number, number, number];
} = {}) => {
  const { color = 0xffffff, intensity = 1, position = [5, 5, 5] } = options;
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(...position);
  return light;
};

/**
 * Creates a basic animation loop
 * @param callback - Animation callback
 */
export const createAnimationLoop = (callback: (time: number) => void) => {
  let animationId: number;
  
  const animate = (time: number) => {
    animationId = requestAnimationFrame(animate);
    callback(time);
  };
  
  animate(0);
  
  return () => {
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
  };
};

/**
 * Handles window resize for Three.js
 * @param camera - Three.js camera
 * @param renderer - Three.js renderer
 */
export const handleResize = (
  camera: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer
) => {
  const onResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };
  
  window.addEventListener('resize', onResize);
  
  return () => {
    window.removeEventListener('resize', onResize);
  };
};

export default {
  createScene,
  createCamera,
  createRenderer,
  createAmbientLight,
  createDirectionalLight,
  createAnimationLoop,
  handleResize,
};