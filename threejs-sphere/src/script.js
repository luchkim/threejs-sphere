import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { PointLightHelper } from 'three'

window.addEventListener('scroll', function(){
    sphere.position.y = window.scrollY * .001;
})
// Loading
// https://threejs.org/docs/#api/en/loaders/Loader
const textureLoader = new THREE.TextureLoader()

const normalTexture = textureLoader.load('/texture/NormalMap.png')

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Objects
// const geometry = new THREE.TorusGeometry( .7, .2, 16, 100 ); // ring
const geometry = new THREE.SphereBufferGeometry(.5, 64, 64)

// Materials
const material = new THREE.MeshStandardMaterial()
material.metalness = 0.7;
material.roughness = 0.2;
material.normalMap = normalTexture;

material.color = new THREE.Color(0x292929)

// Mesh
const sphere = new THREE.Mesh(geometry,material)
scene.add(sphere)

// Lights
const pointLight = new THREE.PointLight(0xffffff, 0.1)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

// red light
const pointLight2 = new THREE.PointLight(0xff0000, 2)
pointLight2.position.set(-1.86, 1, -1.65) // x, y, z
pointLight2.intensity = 10;
scene.add(pointLight2)

// GUI Folder group for separate the light groups in gui browser
const light1 = gui.addFolder('Light 1')

// GUI , by doing this, we have full control of the light 
light1.add(pointLight2.position, 'y').min(-3).max(3).step(0.01) // min.max.step gives the bar on gui
light1.add(pointLight2.position, 'x').min(-6).max(6).step(0.01) // min.max.step gives the bar on gui
light1.add(pointLight2.position, 'z').min(-3).max(3).step(0.01) // min.max.step gives the bar on gui
light1.add(pointLight2, 'intensity').min(0).max(10).step(0.01) // min.max.step gives the bar on gui

// point light helper = it acts like a sun that close, far, and front, back. 
// based on the point-light helper, we can get the right light x, y, z from gui to pointLight2 position.set. 

const pointLightHelper = new THREE.PointLightHelper(pointLight2, 1) //  size of point light
scene.add(pointLightHelper)




// Blue Light
const pointLight3 = new THREE.PointLight(0xe1ff, 2)
pointLight3.position.set(2.13, -3, -1.98) // x, y, z
pointLight3.intensity = 6.8;
scene.add(pointLight3)

const light2 = gui.addFolder('Light 2')

// GUI , by doing this, we have full control of the light 
light2.add(pointLight3.position, 'y').min(-3).max(3).step(0.01) // min.max.step gives the bar on gui
light2.add(pointLight3.position, 'x').min(-6).max(6).step(0.01) // min.max.step gives the bar on gui
light2.add(pointLight3.position, 'z').min(-3).max(3).step(0.01) // min.max.step gives the bar on gui
light2.add(pointLight3, 'intensity').min(0).max(10).step(0.01) // min.max.step gives the bar on gui

// change color 
const light2Color = {
    color: 0xff000
}
light2.addColor(light2Color, 'color').onChange(function(){
    pointLight3.color.set(light2Color.color)
})

const pointLightHelper2 = new THREE.PointLightHelper(pointLight3, 1) //  size of point light
scene.add(pointLightHelper2)


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

})



/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 2
scene.add(camera)

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true, 
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */

document.addEventListener('mousemove', onDocumentMouseMove);

let mouseX = 0;
let mouseY = 0;

let targetX = 0;
let targetY = 0;

const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight /2;

function onDocumentMouseMove(e){
    mouseX = e.clientX - windowHalfX;
    mouseY = e.clientY - windowHalfY;
}





const clock = new THREE.Clock()
const tick = () =>
{
    targetX = mouseX * 0.001;
    targetY = mouseY * 0.001;

    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sphere.rotation.y = .5 * elapsedTime

    // mouse movement
    sphere.rotation.y += .5 * ( targetX - sphere.rotation.y);
    sphere.rotation.x += .05 * ( targetY - sphere.rotation.x);
    sphere.position.z += -.05 * ( targetY - sphere.rotation.x);

    // Update Orbital Controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)

}

tick();