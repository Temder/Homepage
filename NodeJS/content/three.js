function initThree() {
    let camera, scene, renderer, controls, cursor1, cursor2;
    let moveForward = false, moveBackward = false, moveLeft = false, moveRight = false;
    let canJump = false;
    let isMoving = false;
    let prevTime = performance.now();
    const velocity = new THREE.Vector3();
    const direction = new THREE.Vector3();
    const objects = [];
    const playerHeight = 10;
    const playerSpeed = 0.5;
    const stepHeight = 5;
    const collisionDistance = 5.0; // Distance for collision detection

    const textureLoader = new THREE.TextureLoader();

    init();
    animate();

    function init() {
        // Scene
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0xeeeeee);

        // Camera
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
        camera.position.y = playerHeight; // Start at a height of playerHeight

        // Renderer
        renderer = new THREE.WebGLRenderer();
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

        // cube
        const brickTexture = textureLoader.load('./brick.jpg');
        brickTexture.repeat.set(1, 1);
        const box1Geometry = new THREE.BoxGeometry(20, 5, 5);
        const brickMaterial = new THREE.MeshBasicMaterial({ map: brickTexture });
        const box1 = new THREE.Mesh(box1Geometry, brickMaterial);
        box1.position.set(0, 2.5, -22.5);
        scene.add(box1);
        objects.push(box1);

        // cube
        const box2Geometry = new THREE.BoxGeometry(20, 10, 5);
        const box2 = new THREE.Mesh(box2Geometry, brickMaterial);
        box2.position.set(0, 5, -27.5);
        scene.add(box2);
        objects.push(box2);

        // cube
        const box3Geometry = new THREE.BoxGeometry(20, 15, 5);
        const box3 = new THREE.Mesh(box3Geometry, brickMaterial);
        box3.position.set(0, 7.5, -32.5);
        scene.add(box3);
        objects.push(box3);

        // sphere
        const sphereGeometry = new THREE.SphereGeometry(20, 20, 20);
        const sphere = new THREE.Mesh(sphereGeometry, brickMaterial);
        sphere.position.set(0, 10, 30);
        scene.add(sphere);
        objects.push(sphere);

        // cursor
        const cursorGeometry = new THREE.BoxGeometry(1, 1, 1);
        cursor1 = new THREE.Mesh(cursorGeometry, new THREE.MeshBasicMaterial({ color: 'lightgreen' }));
        cursor1.position.set(0, 10, 0);
        scene.add(cursor1);
        cursor2 = new THREE.Mesh(cursorGeometry, new THREE.MeshBasicMaterial({ color: 'lightblue' }));
        cursor2.position.set(0, 10, 0);
        scene.add(cursor2);

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
            isMoving = (moveForward || moveBackward || moveLeft || moveRight);

            // Get the direction the player is looking
            const lookDirection = new THREE.Vector3();
            camera.getWorldDirection(lookDirection);
            lookDirection.y = 0; // Ignore the y-component to keep movement on the x-z plane
            lookDirection.normalize();

            // Calculate movement direction
            const moveDirection = new THREE.Vector3();
            moveDirection.copy(lookDirection).multiplyScalar(direction.z).add(new THREE.Vector3(lookDirection.z, 0, -lookDirection.x).multiplyScalar(direction.x)).normalize();
            
            // Collision detection using raycasting
            const playerPosition = controls.getObject().position;
            
            const lookingVector = playerPosition.clone().add(moveDirection.multiplyScalar(1.5)); //.clone().add(moveDirection.multiplyScalar(collisionDistance / 2))

            // Horizontal collision detection
            const horizontalRaycaster = new THREE.Raycaster(
                playerPosition,
                moveDirection.normalize(),
                0,
                collisionDistance
            );

            const horizontalIntersects = horizontalRaycaster.intersectObjects(objects);
            let stepIntersects = [];
    
            if (horizontalIntersects.length === 0) {
                controls.moveRight(-velocity.x * delta);
                controls.moveForward(-velocity.z * delta);

                //cursor1.position.set(lookingVector.x, playerPosition.y - playerHeight + stepHeight, lookingVector.z);
                //cursor2.position.set(lookingVector.x, playerPosition.y - playerHeight, lookingVector.z);
                // Step detection and stepping up
                const stepRaycaster = new THREE.Raycaster(
                    playerPosition.clone().add(new THREE.Vector3(0,  -playerHeight + stepHeight, 0)),
                    new THREE.Vector3(0, -1, 0),
                    0,
                    stepHeight
                );
                stepIntersects = stepRaycaster.intersectObjects(objects);
                if (stepIntersects.length > 0 && stepIntersects[0].distance < stepHeight) {
                    controls.getObject().position.y = stepIntersects[0].point.y + playerHeight;
                }// else if (isMoving) {
                /*//    controls.getObject().position.y += (velocity.y * delta);
                //}*/
            } else {
                velocity.x = 0;
                velocity.z = 0;
            }


            // Vertical collision detection (falling)
            const downRaycaster = new THREE.Raycaster(
                playerPosition.clone().add(new THREE.Vector3(0, -playerHeight, 0)),
                new THREE.Vector3(0, -1, 0),
                0,
                2
            );
    
            const downIntersects = downRaycaster.intersectObjects(objects);

            if (downIntersects.length > 0) {
                if (downIntersects[0].distance < playerHeight) {
                    velocity.y = Math.max(0, velocity.y); // Prevent downward velocity
                    canJump = true;
                }
            } else {
                canJump = false;
            }

            // Vertical collision detection (jumping)
            const upRaycaster = new THREE.Raycaster(
                playerPosition,
                new THREE.Vector3(0, 1, 0),
                0,
                playerHeight / 2
            );
    
            const upIntersects = upRaycaster.intersectObjects(objects);
    
            if (upIntersects.length > 0) {
                const distance = upIntersects[0].distance;
                if (distance < playerHeight / 2) {
                    velocity.y = Math.min(0, velocity.y); // Prevent upward velocity
                }
            }

            if ((downIntersects.length === 0 || canJump) && stepIntersects.length === 0) {
                controls.getObject().position.y += (velocity.y * delta);
            }

            /*if (controls.getObject().position.y < playerHeight) {
                console.log('player on plane');
                velocity.y = 0;
                controls.getObject().position.y = playerHeight;
                canJump = true;
            }*/

            prevTime = time;
        }

        renderer.render(scene, camera);
    }
}