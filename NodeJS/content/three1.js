function initThree() {
    let camera, scene, renderer, controls;
    let moveForward = false, moveBackward = false, moveLeft = false, moveRight = false;
    let canJump = false;
    let prevTime = performance.now();
    const velocity = new THREE.Vector3();
    const direction = new THREE.Vector3();
    const objects = [];
    const playerHeight = 10;
    const playerSpeed = 1;

    const textureLoader = new THREE.TextureLoader();
    
    init();
    animate();

    Rapier.init().then(() => {
        // Run the simulation.
    });
    
    // OR using the await syntax:
    async function run_simulation() {
        await RAPIER.init();
        // Run the simulation.
    }

    function init() {
        // Scene
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0xeeeeee);

        // Camera
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
        camera.position.y = playerHeight; // Start at a height of playerHeight

        // Renderer
        renderer = new THREE.WebGLRenderer({antialias : true, alpha : true});
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth / 2, window.innerHeight / 2);
        document.getElementById('threejs').appendChild(renderer.domElement);

        // Controls
        controls = new THREE.PointerLockControls(camera, document.body);
        
        document.getElementById('instructions').addEventListener('click', () => {
            controls.lock();
        });

        controls.addEventListener('lock', () => {
            renderer.setSize(window.innerWidth, window.innerHeight);
            document.getElementById('instructions').style.display = 'none';
            document.getElementById('threejs').style.position = 'absolute';
            document.getElementById('threejs').style.top = 0;
            document.getElementById('threejs').style.zIndex = 101;
        });

        controls.addEventListener('unlock', () => {
            renderer.setSize(window.innerWidth / 2, window.innerHeight / 2);
            document.getElementById('instructions').style.display = 'flex';
            document.getElementById('threejs').style.position = 'relative';
            document.getElementById('threejs').style.top = '4.5em';
            document.getElementById('threejs').style.zIndex = 0;
        });

        scene.add(controls.getObject());

        // Floor
        const grassTexture = textureLoader.load('./grass.jpg');
        grassTexture.wrapS = THREE.RepeatWrapping;
        grassTexture.wrapT = THREE.RepeatWrapping;
        grassTexture.repeat.set(20, 20);
        const floorGeometry = new THREE.BoxGeometry(200, 1, 200);
        const floorMaterial = new THREE.MeshBasicMaterial({ map: grassTexture });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        //floor.rotation.x = -Math.PI / 2;
        floor.position.y = -0.5;
        scene.add(floor);
        objects.push(floor);

        // Keyboard controls
        const onKeyDown = (event) => {
            switch (event.code) {
                case 'ArrowUp':
                case 'KeyW':
                    moveForward = true;
                    break;
                case 'ArrowLeft':
                case 'KeyA':
                    moveLeft = true;
                    break;
                case 'ArrowDown':
                case 'KeyS':
                    moveBackward = true;
                    break;
                case 'ArrowRight':
                case 'KeyD':
                    moveRight = true;
                    break;
                case 'Space':
                    if (canJump === true) {
                        velocity.y += 125;
                    }
                    canJump = false;
                    break;
            }
        };

        const onKeyUp = (event) => {
            switch (event.code) {
                case 'ArrowUp':
                case 'KeyW':
                    moveForward = false;
                    break;
                case 'ArrowLeft':
                case 'KeyA':
                    moveLeft = false;
                    break;
                case 'ArrowDown':
                case 'KeyS':
                    moveBackward = false;
                    break;
                case 'ArrowRight':
                case 'KeyD':
                    moveRight = false;
                    break;
            }
        };

        document.addEventListener('keydown', onKeyDown);
        document.addEventListener('keyup', onKeyUp);

        // Resize handling
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth / 2, window.innerHeight / 2);
        });
    }

    function animate() {
        requestAnimationFrame(animate);
    
        if (controls.isLocked) {
            const time = performance.now();
            const delta = (time - prevTime) / 1000;
    
            velocity.x -= velocity.x * 10.0 * delta;
            velocity.z -= velocity.z * 10.0 * delta;
            velocity.y -= 9.8 * 40.0 * delta; // gravity 50.0
    
            direction.z = Number(moveForward) - Number(moveBackward);
            direction.x = Number(moveLeft) - Number(moveRight);
            direction.normalize();
    
            if (moveForward || moveBackward) velocity.z -= direction.z * 400.0 * playerSpeed * delta;
            if (moveLeft || moveRight) velocity.x += direction.x * 400.0 * playerSpeed * delta;

            controls.moveRight(-velocity.x * delta);
            controls.moveForward(-velocity.z * delta);
            
            controls.getObject().position.y += (velocity.y * delta);

            if (controls.getObject().position.y < playerHeight) {
                velocity.y = 0;
                controls.getObject().position.y = playerHeight;
                canJump = true;
            }

            prevTime = time;
        }

        renderer.render(scene, camera);
    }
}