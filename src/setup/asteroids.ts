import * as THREE from 'three';
import { fetchNEOData, NEOData } from '../setup/services/nasaApi';

// Function to create an asteroid mesh based on NEO data
export function createAsteroidMesh(neoData: NEOData): THREE.Mesh {
  const diameter = Math.max(neoData.estimated_diameter.kilometers.estimated_diameter_max / 1000, 0.01); // Ensure a minimum size
  
  // Create a sphere geometry for the asteroid
  const geometry = new THREE.SphereGeometry(diameter, 32, 32);
  const material = new THREE.MeshBasicMaterial({ color: 0xffcc00 });  // Yellowish color for asteroids
  const asteroid = new THREE.Mesh(geometry, material);

  // STEP 1: Safely get the miss distance if available
  const closeApproach = neoData.close_approach_data[0];  // Get the first close approach data
  
  // Only proceed if close approach data exists
  if (closeApproach && closeApproach.miss_distance && closeApproach.miss_distance.kilometers) {
    const missDistance = parseFloat(closeApproach.miss_distance.kilometers);  // Miss distance in kilometers

    // STEP 2: Convert missDistance to a distance from the Sun by scaling it down
    const distanceFromSun = missDistance * 0.0001;  // Example scaling factor

    // STEP 3: Set random angles to distribute asteroids in 3D space, creating an orbit-like distribution
    const theta = Math.random() * 2 * Math.PI;  // Random angle in the XY plane
    const phi = Math.random() * Math.PI;        // Random angle for vertical rotation

    // STEP 4: Convert spherical coordinates (distance, theta, phi) to Cartesian (x, y, z)
    asteroid.position.set(
      distanceFromSun * Math.sin(phi) * Math.cos(theta),  // X position
      distanceFromSun * Math.sin(phi) * Math.sin(theta),  // Y position
      distanceFromSun * Math.cos(phi)                     // Z position
    );
  } else {
    console.warn(`No close approach data available for NEO: ${neoData.name}`);
  }

  return asteroid;
}

// Function to fetch NEO data and add asteroid meshes to the scene
export async function addAsteroidsToScene(scene: THREE.Scene) {
  const neos = await fetchNEOData();  // Fetch NEO data from NASA API
  
  console.log(`Fetched ${neos.length} NEOs`, neos);  // For debugging: check if NEO data is fetched correctly

  neos.forEach(neo => {
    const asteroidMesh = createAsteroidMesh(neo);
    scene.add(asteroidMesh);  // Add the asteroid mesh to the scene
  });
}
