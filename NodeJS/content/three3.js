'use strict';

Physijs.scripts.worker = './addons/physijs_worker.js';
Physijs.scripts.ammo = './ammoPhysisJS.js';

function initThree() {
    let sphere, player, camera, scene, renderer, gravityDir;
    let moveForward = false, moveBackward = false, moveLeft = false, moveRight = false;
    let locked = false;
    let prevTime = performance.now();
    const playerHeight = 10;
    const playerSpeed = 1;
    const velocity = new THREE.Vector3();
    const direction = new THREE.Vector3();

    const textureLoader = new THREE.TextureLoader();
    
    init();
    animate();

    function init() {
        // Scene
        scene = new Physijs.Scene({ reportsize: 4 });
        scene.background = new THREE.Color(0xeeeeee);
        scene.setGravity(new THREE.Vector3(0, -100, 0));
        screen.addEventListener('update', function() {
            scene.simulate(undefined, 2);
        });

        // Camera
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);

        // Renderer
        renderer = new THREE.WebGLRenderer({antialias : true, alpha : true});
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth / 2, window.innerHeight / 2);
        document.getElementById('threejs').appendChild(renderer.domElement);
        
        const container = document.getElementById('instructions');
        container.addEventListener('click', () => {
            container.requestPointerLock();
        });

        document.addEventListener('pointerlockchange', () => {
            if (document.pointerLockElement === container) {
                renderer.setSize(window.innerWidth, window.innerHeight);
                document.getElementById('instructions').style.display = 'none';
                document.getElementById('threejs').style.position = 'absolute';
                document.getElementById('threejs').style.top = 0;
                document.getElementById('threejs').style.zIndex = 101;
                locked = true;
            } else {
                renderer.setSize(window.innerWidth / 2, window.innerHeight / 2);
                document.getElementById('instructions').style.display = 'flex';
                document.getElementById('threejs').style.position = 'relative';
                document.getElementById('threejs').style.top = '4.5em';
                document.getElementById('threejs').style.zIndex = 0;
                locked = false;
            }
        }, false);

        //scene.add(camera);

        // Ground
        var ground_material = Physijs.createMaterial(
			new THREE.MeshBasicMaterial({ map: textureLoader.load( './grass.jpg' ) }),
			.8, // high friction
			.4 // low restitution
		);
		ground_material.map.wrapS = ground_material.map.wrapT = THREE.RepeatWrapping;
		ground_material.map.repeat.set( 5, 5 );
        sphere = new Physijs.SphereMesh(new THREE.SphereGeometry(100, 100, 100), ground_material, 0);
        sphere.position.set(0, -100, 0);
        scene.add(sphere);
        
        player = new Physijs.SphereMesh(new THREE.SphereGeometry(5, 5, 5), new THREE.MeshBasicMaterial({ color: 'red' }));
        player.position.set(0, playerHeight, 0);
        scene.add(player);
        camera.position.set(player.position.x, player.position.y + 10, player.position.z + 20);
        camera.rotation.set(-44.5, 0, 0);
        player.add(camera);

        // Keyboard controls
        document.addEventListener('keydown', (event) => {
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
            }
        });

        document.addEventListener('keyup', (event) => {
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
        });

        // Resize handling
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth / 2, window.innerHeight / 2);
        });
    }

    function animate() {
        requestAnimationFrame(animate);
    
        if (locked) {
            const time = performance.now();
            const delta = (time - prevTime) / 1000;
    
            velocity.x -= velocity.x * 10.0 * delta;
            velocity.z -= velocity.z * 10.0 * delta;
    
            direction.z = Number(moveForward) - Number(moveBackward);
            direction.x = Number(moveLeft) - Number(moveRight);
            direction.normalize();

            if (moveForward || moveBackward) velocity.z += direction.z * 10000.0 * playerSpeed * delta;
            if (moveLeft || moveRight) velocity.x += direction.x * 10000.0 * playerSpeed * delta;

            const lookDirection = new THREE.Vector3();
            camera.getWorldDirection(lookDirection);
            lookDirection.y = 0;
            lookDirection.normalize();
            
            const moveDirection = new THREE.Vector3();
            moveDirection.copy(lookDirection).multiplyScalar(direction.z).add(new THREE.Vector3(lookDirection.z, 0, -lookDirection.x).multiplyScalar(direction.x)).normalize().multiplyScalar(25);
            player.rotation.set(0, 0, 0);
            player.setLinearVelocity(moveDirection);

            gravityDir = sphere.position.clone().sub(player.position);
            scene.setGravity(gravityDir.clone());
        }

        scene.simulate();
        renderer.render(scene, camera);
    }
}