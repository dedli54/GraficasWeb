//Enemigo
let enemy;
loaderGLTF.load(
    "MODELOS/pulpodos.glb",
    function (gltf) {
        enemy= gltf.scene;
        enemy.scale.set(1, 1, 1);
        enemy.position.set(-30, 5.5, 60);
        scene.add(enemy);

        mixer = new THREE.AnimationMixer(model);
        gltf.animations.forEach((clip) => {
            mixer.clipAction(clip).play();
        });
        enemyBoundingBox = new THREE.Box3().setFromObject(enemy);
  //antes de animar
 const puntoA = new THREE.Vector3(-110, 5.5, 120);
 const puntoB = new THREE.Vector3(130, 5.5, -300);

 // Definir la duración total del movimiento en segundos
 const duracionMovimiento = 400; 

 // Crear una variable para el tiempo transcurrido
 let tiempoTranscurrido = 0;



 function cargarBomba() {
  loaderGLTF.load(
      "MODELOS/bomb.glb",
      function (modelin) {
          bomba = modelin.scene;
          bomba.scale.set(3, 3, 3);
          bomba.visible = false; // Inicialmente ocultar el modelo
          bomba.position.copy(previousPosition); // Establecer la posición del robot
          scene.add(bomba);
          bombaBoundingBox = new THREE.Box3().setFromObject(bomba);
      }
  );
}

function cargarLaser() {
  loaderGLTF.load(
      "MODELOS/laser_barrier.glb",
      function (modelin) {
          laser = modelin.scene;
          laser.scale.set(10, 3, 6);
          laser.visible = false; // Inicialmente ocultar el modelo
          laser.position.copy(previousPosition); // Establecer la posición del robot
          scene.add(laser);
          laserBoundingBox = new THREE.Box3().setFromObject(laser);
      }
  );
}

function cargarPlataforma() {
  loaderGLTF.load(
      "MODELOS/tablet_display.glb",
      function (modelin) {
          plata = modelin.scene;
          plata.scale.set(80, 90, 60);
          plata.rotation.set(0, 0, 99);
          plata.position.copy(previousPosition); // Establecer la posición del robot
          scene.add(plata);
          plataformaBoundingBox = new THREE.Box3().setFromObject(plata);
      }
  );
}

        function animate() {
            requestAnimationFrame(animate);
            handleCollisions();


            const factor = tiempoTranscurrido / duracionMovimiento;
            const posicionInterpolada = new THREE.Vector3().lerpVectors(puntoA, puntoB, factor);
        
            // Actualizar la posición del modelo del enemigo
            modeloo.position.copy(posicionInterpolada);
        
            // Actualizar la posición del bounding box del enemigo
            enemyBoundingBox.setFromObject(modeloo);
        
            // Incrementar el tiempo transcurrido
            tiempoTranscurrido += 1 / 60; // Suponiendo una frecuencia de actualización de 60 FPS
        
            // Si el tiempo transcurrido supera la duración del movimiento, reiniciar el tiempo
            if (tiempoTranscurrido > duracionMovimiento) {
                tiempoTranscurrido = 0;
            }
          
        }
        function handleCollisions() {
          if (enemyBoundingBox && laserBoundingBox && bombaBoundingBox && plataformaBoundingBox && nave1BoundingBoxBoundingBox&&mixer) {
              enemyBoundingBox.setFromObject(enemy);
              if (enemyBoundingBox.intersectsBox(laserBoundingBox)) {
                // Reducir la vida del robot si hay colisión
                enemyVida -= laserfatal;
                if ( enemyVida  < 0) {
                  enemyVida  = 0;
              }
                console.log("¡Colisión detectada! Vida del pulpodo:", enemyVida );
  
                // Verificar si la vida del pulpodo llega a cero
                if ( enemyVida  === 0) {
                    console.log("¡El pulpodo ha sido destruido!");
                    scene.remove(modeloo);
                    // Aquí puedes agregar la lógica para lo que quieras hacer cuando el robot sea destruido
                }
              }
              if (enemyBoundingBox.intersectsBox(bombaBoundingBox)) {
                // Reducir la vida del robot si hay colisión
                enemyVida -= bombafatal;
                if ( enemyVida  < 0) {
                  enemyVida  = 0;
              }
                console.log("¡Colisión detectada! Vida del pulpodo:", enemyVida );
  
                // Verificar si la vida del pulpodo llega a cero
                if ( enemyVida  === 0) {
                    console.log("¡El pulpodo ha sido destruido!");
                    scene.remove(modeloo);
                    // Aquí puedes agregar la lógica para lo que quieras hacer cuando el robot sea destruido
                }
              }
              if (enemyBoundingBox.intersectsBox(plataformaBoundingBox)) {
                // Reducir la vida del robot si hay colisión
                enemyVida -= plataformafatal;
                if ( enemyVida  < 0) {
                  enemyVida  = 0;
              }
                console.log("¡Colisión detectada! Vida del pulpodo:", enemyVida );
  
                // Verificar si la vida del pulpodo llega a cero
                if ( enemyVida  === 0) {
                    console.log("¡El pulpodo ha sido destruido!");
                    scene.remove(modeloo);
                    // Aquí puedes agregar la lógica para lo que quieras hacer cuando el robot sea destruido
                }
              }
              if (enemyBoundingBox.intersectsBox(nave1BoundingBox)) {
                // Aumentar el escape si hay colisión
                if ( enemyEscape  < 1) {
                  enemyEscape  = 1;
              }
                console.log("¡Colisión detectada! Abordaje:", enemyEscape );
  
                // Verificar si la vida del pulpodo llega a cero
                if ( enemyEscape  === 1) {
                    console.log("¡El pulpodo ha abordado!");
                    scene.remove(modeloo);
                    // Aquí puedes agregar la lógica para lo que quieras hacer cuando el robot sea destruido
                }
              }
              mixer.update(0.04);
              renderer.render(scene, camera);
          }
          
        }

        document.addEventListener('keydown', (event) => {
          previousPosition.copy(model.position);
            switch (event.key) {
                case '1':
                    cargarPlataforma();
                    break;
                case '2':
                    cargarLaser();
                    break;
                case '3':
                    cargarBomba();
                    break;
            }
        });

        animate();
    }
);