'use strict';

Physijs.scripts.worker = 'threejs/addons/physijs_worker.js';
Physijs.scripts.ammo = 'ammoPhysisJS.js';

function initThree() {
    let planet, sphere, player, camera, scene, renderer, gravityDir;
    let moveForward = false, moveBackward = false, moveLeft = false, moveRight = false;
    let locked = false;
    let prevTime = performance.now();
    let rot = 0;
    const playerHeight = 10;
    const playerSpeed = 1;
    const velocity = new THREE.Vector3();
    const direction = new THREE.Vector3();
    let rotationSpeed = 0.01; // Add this with other variables at the top
    let rotationAngle = 0; // Add these variables at the top with other declarations

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

        // Ground
        var ground_material = Physijs.createMaterial(
			new THREE.MeshBasicMaterial({ map: textureLoader.load( './graphics/grass.jpg' ) }),
			.8, // high friction
			.4 // low restitution
		);
		ground_material.map.wrapS = ground_material.map.wrapT = THREE.RepeatWrapping;
		ground_material.map.repeat.set( 5, 5 );
        planet = new Physijs.SphereMesh(new THREE.SphereGeometry(100, 100, 100), ground_material, 0);
        planet.position.set(0, -100, 0);
        scene.add(planet);
        
        //BoxMesh BoxGeometry
        player = new Physijs.SphereMesh(new THREE.SphereGeometry(5, 5, 5), new THREE.MeshBasicMaterial({ color: 'red' }));
        player.position.set(0, playerHeight, 0);
        scene.add(player);
        
        // Update camera setup
        camera.position.set(0, 10, 25); // Position relative to player
        camera.lookAt(new THREE.Vector3(0, 0, 0));
        player.add(camera); // Attach camera as child of player
        
        // Initial player orientation
        player.lookAt(planet.position);
        const initQuat = new THREE.Quaternion();
        const up = new THREE.Vector3(0, 1, 0);
        const gravityDir = planet.position.clone().sub(player.position).normalize();
        const playerUp = gravityDir.clone().multiplyScalar(-1);
        initQuat.setFromUnitVectors(up, playerUp);
        player.quaternion.copy(initQuat);

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
            // Calculate gravity direction and up vector
            gravityDir = planet.position.clone().sub(player.position).normalize();
            const playerUp = gravityDir.clone().multiplyScalar(-1);
            
            // Update rotation angle based on input
            if (moveRight) rotationAngle -= rotationSpeed;
            if (moveLeft) rotationAngle += rotationSpeed;
            
            // Create base quaternion for surface alignment
            const alignQuat = new THREE.Quaternion();
            const up = new THREE.Vector3(0, 1, 0);
            alignQuat.setFromUnitVectors(up, playerUp);
            
            // Create rotation quaternion
            const rotationQuat = new THREE.Quaternion();
            rotationQuat.setFromAxisAngle(playerUp, rotationAngle);
            
            // Combine rotations: first align with surface, then apply accumulated rotation
            player.quaternion.multiplyQuaternions(rotationQuat, alignQuat);
            
            // Get player's forward direction for movement
            const forward = new THREE.Vector3(0, 0, -1);
            forward.applyQuaternion(player.quaternion);
            forward.projectOnPlane(playerUp).normalize();
            
            // Calculate movement
            const moveDirection = new THREE.Vector3();
            if (moveForward) moveDirection.add(forward);
            if (moveBackward) moveDirection.sub(forward);
            
            if (moveDirection.length() > 0) {
                moveDirection.normalize();
                player.setLinearVelocity(moveDirection.multiplyScalar(50 * playerSpeed));
            } else {
                player.setLinearVelocity(new THREE.Vector3(0, 0, 0));
            }

            scene.setGravity(gravityDir.multiplyScalar(100));
        }
        scene.simulate();
        renderer.render(scene, camera);
    }
}