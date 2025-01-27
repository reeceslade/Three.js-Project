import * as THREE from 'three';

// Set up renderer
const w = window.innerWidth;
const h = window.innerHeight;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

// Set up camera
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 10);
camera.position.z = 5;

// Set up scene
const scene = new THREE.Scene();

// Create cube mesh
function createCube(x, y, z = 0) {
  const geo = new THREE.BoxGeometry(1, 1, 1);
  const mat = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(geo, mat);
  cube.position.set(x, y, z);
  return cube;
}

// Create triangle mesh
function createTriangle(x, y) {
  const triangleShape = new THREE.Shape();
  triangleShape.moveTo(0, -0.5);
  triangleShape.lineTo(-0.5, 0.5);
  triangleShape.lineTo(0.5, 0.5);
  triangleShape.lineTo(0, -0.5);
  
  const triangleGeo = new THREE.ShapeGeometry(triangleShape);
  const triangleMat = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
  const triangle = new THREE.Mesh(triangleGeo, triangleMat);
  triangle.position.set(x, y, 0);
  return triangle;
}

// Create line mesh
function createLine(x1, y1, x2, y2) {
  const lineMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff });
  const lineGeometry = new THREE.Geometry();
  lineGeometry.vertices.push(new THREE.Vector3(x1, y1, 0), new THREE.Vector3(x2, y2, 0));
  return new THREE.Line(lineGeometry, lineMaterial);
}

// Create cubes and triangles and add them to the scene
const cubes = [
  createCube(-1.5, 0),
  createCube(0, 0),
  createCube(1.5, 0),
  createCube(3, 0),
];
cubes.forEach(cube => scene.add(cube));

const triangles = [
  createTriangle(-1.5, 3),
  createTriangle(0, 3),
  createTriangle(1.5, 3),
  createTriangle(3, 3),
];
triangles.forEach(triangle => scene.add(triangle));

// Create lines
const lines = [
  createLine(-1.5, 2.5, 1.5, 2.5),
  createLine(-0.5, 2.5, 0.5, 2.5),
  createLine(1.5, 2.5, 3, 2.5)
];
lines.forEach(line => scene.add(line));

// Raycasting setup for mouse hover detection
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const cubeOffsets = [0, 0, 0, 0];
const isHovered = [false, false, false, false];

// Mouse event listener
document.addEventListener('mousemove', onMouseMove, false);

// Detect mouse movement
function onMouseMove(event) {
  mouse.x = (event.clientX / w) * 2 - 1;
  mouse.y = -(event.clientY / h) * 2 + 1;

  raycaster.ray.origin.set(camera.position.x, camera.position.y, camera.position.z);
  raycaster.ray.direction.set(mouse.x, mouse.y, -1).normalize();

  const intersects = raycaster.intersectObjects(cubes);

  // Handle hover states
  cubes.forEach((cube, index) => {
    if (intersects.length > 0 && intersects[0].object === cube && !isHovered[index]) {
      isHovered[index] = true;
      console.log(`Hovered over cube: ${cube.name}`);
    } else if (intersects.length === 0 && isHovered[index]) {
      console.log(`Left cube: ${cube.name}`);
      isHovered[index] = false;
    }
  });
}

// Set up animation for hovering cubes
function animate() {
  requestAnimationFrame(animate);

  cubes.forEach((cube, index) => {
    if (isHovered[index] && cubeOffsets[index] < 1.8) cubeOffsets[index] += 0.01;
    cube.position.y = cubeOffsets[index];
  });

  renderer.render(scene, camera);
}

animate();
