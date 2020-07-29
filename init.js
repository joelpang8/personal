const canvas = document.querySelector('#c');
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
renderer.setClearColor(0x000000, 0);

function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const pixelRatio = window.devicePixelRatio;
    const width = window.outerWidth;
    const height = window.outerHeight/1.3;
    // const width = canvas.clientWidth * pixelRatio | 0;
    // const height = canvas.clientHeight * pixelRatio | 0;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
        renderer.setSize(width, height, false);
    }
    return needResize;
}

const camera = new THREE.PerspectiveCamera
    (
        75,//fov
        2,//aspect
        0.1,//near
        50//far
    );

camera.position.z = 14;
camera.position.x = 6;
camera.position.y = 2;

const scene = new THREE.Scene();

const light = new THREE.DirectionalLight
    (
        0xFFFFFF, //color
        0.9 //intensity
    );

const light2 = new THREE.DirectionalLight
    (
        0xFFFF00,
        1.5
    )

const light3 = new THREE.DirectionalLight
    (
        0xAAAADD,
        0.6
    )

scene.add(light);
light.position.set(0, 4, -5)

scene.add(light2);
light2.position.set(0, 1, -2)

scene.add(light3);
light3.position.set(0, -1, 1)

// var texture = THREE.ImageUtils.loadTexture('villaeste.jpg');
// var backgroundMesh = new THREE.Mesh(
//     new THREE.PlaneGeometry(2, 2, 0),
//     new THREE.MeshBasicMaterial({
//         // map: texture
//     }));

// backgroundMesh.material.depthTest = false;
// backgroundMesh.material.depthWrite = false;

// // Create your background scene
// var backgroundScene = new THREE.Scene();
// var backgroundCamera = new THREE.Camera();
// backgroundScene.add(backgroundCamera);
// backgroundScene.add(backgroundMesh);
