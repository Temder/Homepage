'use strict';

Physijs.scripts.worker = './addons/physijs_worker.js';
Physijs.scripts.ammo = './ammoPhysisJS.js';

function initThree() {
    let sphere, player, camera, scene, renderer, controls, gravityDir;
    let moveForward = false, moveBackward = false, moveLeft = false, moveRight = false;
    let canJump = false;
    let jump = false;
    let prevTime = performance.now();
    const velocity = new THREE.Vector3();
    const direction = new THREE.Vector3();
    const objects = [];
    const playerHeight = 10;
    const playerSpeed = 1;
    const gravityPoint = new THREE.Vector3(0, -100, 0);

    const textureLoader = new THREE.TextureLoader();
    
    init();
    animate();

    function init() {
        // Scene
        scene = new Physijs.Scene({ reportsize: 4 });
        scene.background = new THREE.Color(0xeeeeee);
        scene.setGravity(new THREE.Vector3(0, -40, 0));
        screen.addEventListener('update', function() {
            scene.simulate(undefined, 2);
        });

        // Camera
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
        camera.position.y = 30; // Start at a height of playerHeight

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

        // Ground
        var ground_material = Physijs.createMaterial(
			new THREE.MeshBasicMaterial({ map: textureLoader.load( './grass.jpg' ) }),
			.8, // high friction
			.4 // low restitution
		);
		ground_material.map.wrapS = ground_material.map.wrapT = THREE.RepeatWrapping;
		ground_material.map.repeat.set( 5, 5 );
		/*var NoiseGen = new SimplexNoise;
		var ground_geometry = new THREE.PlaneGeometry( 300, 300, 100, 100 );
		for ( var i = 0; i < ground_geometry.vertices.length; i++ ) {
			var vertex = ground_geometry.vertices[i];
			//vertex.z = NoiseGen.noise( vertex.x / 30, vertex.y / 30 ) * 2;
		}
		ground_geometry.computeFaceNormals();
		ground_geometry.computeVertexNormals();
		var ground = new Physijs.HeightfieldMesh(
				ground_geometry,
				ground_material,
				0 // mass
		);
        ground.position.set(0, 0, 0);
		ground.rotation.x = -Math.PI / 2;
		ground.receiveShadow = true;
		scene.add(ground);
        objects.push(ground);*/
        sphere = new Physijs.SphereMesh(new THREE.SphereGeometry(100, 100, 100), ground_material, 0);
        sphere.position.set(0, -100, 0);
        scene.add(sphere);
        
        /*const phyBoxGeometry = new THREE.BoxGeometry(10, 10, 10);
        const phyBoxMaterial = new THREE.MeshBasicMaterial({ color: 'green' });
        const phyBox = new Physijs.BoxMesh(phyBoxGeometry, phyBoxMaterial);
        phyBox.position.set(0, 20, -20);
        scene.add(phyBox);
        objects.push(phyBox);

        const box = new Physijs.BoxMesh(new THREE.BoxGeometry(20, 50, 20), new THREE.MeshBasicMaterial({ color: 'blue' }));
        box.position.set(20, 50, 0);
        scene.add(box);
        objects.push(box);*/
        
        player = new Physijs.SphereMesh(new THREE.SphereGeometry(5, 5, 5), new THREE.MeshBasicMaterial({ color: 'red' }));
        player.position.set(0, playerHeight, 0);
        scene.add(player);

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
                        //jump = true;
                        //player.setLinearVelocity(new THREE.Vector3(0, 10000, 0));
                        //scene.simulate();
                        velocity.y += 10;
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

        player.addEventListener( 'collision', function(other_object, relative_velocity, relative_rotation, contact_normal) {
            if (contact_normal.x < -0.9) {
                canJump = true;
            }
        });
    }

    function animate() {
        requestAnimationFrame(animate);
    
        if (controls.isLocked) {
            const time = performance.now();
            const delta = (time - prevTime) / 1000;
    
            velocity.x -= velocity.x * 10.0 * delta;
            velocity.z -= velocity.z * 10.0 * delta;
    
            direction.z = Number(moveForward) - Number(moveBackward);
            direction.x = Number(moveLeft) - Number(moveRight);
            direction.normalize();

            const moving = moveForward || moveBackward || moveRight || moveLeft;
    
            if (moveForward || moveBackward) velocity.z += direction.z * 10000.0 * playerSpeed * delta;
            if (moveLeft || moveRight) velocity.x += direction.x * 10000.0 * playerSpeed * delta;
            
            const lookDirection = new THREE.Vector3();
            camera.getWorldDirection(lookDirection);
            lookDirection.y = 0;
            lookDirection.normalize();

            const moveDirection = new THREE.Vector3();
            moveDirection.copy(lookDirection).multiplyScalar(direction.z).add(new THREE.Vector3(lookDirection.z, 0, -lookDirection.x).multiplyScalar(direction.x)).normalize().multiplyScalar(25);
            moveDirection.y = player.getLinearVelocity().y;
            player.setLinearVelocity(moveDirection);
            if (velocity.y > 0) {
                player.setLinearVelocity(player.getLinearVelocity().add(new THREE.Vector3(0, velocity.y, 0)));
                velocity.y = 0;
            }
            
            gravityDir = sphere.position.clone().sub(player.position);
            scene.setGravity(gravityDir.clone());
            //player.rotation.set(0, 0, 0);
            //player.__dirtyRotation = true;
            controls.getObject().position.set(player.position.x + gravityDir.normalize().x * -15, player.position.y + gravityDir.normalize().y * -15, player.position.z + gravityDir.normalize().z * -15);
            //console.log(controls.getObject().rotation);
            player.lookAt(sphere.position);

            const downRaycaster = new THREE.Raycaster(
                player.position,
                new THREE.Vector3(0, -1, 0),
                0,
                11
            );
    
            const downIntersects = downRaycaster.intersectObjects(objects);

            if (downIntersects.length > 0) {
                canJump = true;
            } else {
                canJump = false;
            }

            prevTime = time;
        }

        scene.simulate();
        renderer.render(scene, camera);
    }
}