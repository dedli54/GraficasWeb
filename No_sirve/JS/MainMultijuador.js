//librerias del proyecto desde cdns tambien se puede con los js pero hay que quitar la ruta a internet//
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
import { OBJLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/OBJLoader.js";
import { GLTFLoader } from "./GLTFLoader.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getDatabase, ref, update , onValue} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
 
  // Your web app's Firebase configuration
  const firebaseConfig = {
   apiKey: "AIzaSyDH02J997ayPxyI_fBnUCjZfJVYoWEavaM",
   authDomain: "piagcw-53251.firebaseapp.com",
   databaseURL: "https://piagcw-53251-default-rtdb.firebaseio.com",
   projectId: "piagcw-53251",
   storageBucket: "piagcw-53251.appspot.com",
   messagingSenderId: "796665278678",
   appId: "1:796665278678:web:e8a42b970b2daa7353d977"
 };

 // Initialize Firebase
 const app = initializeApp(firebaseConfig);
 const auth = getAuth(app);
 const database = getDatabase(app);
 var idUsuario;

 // Update user status to 'activo' when user logs in
 onAuthStateChanged(auth, (user) => {
     if (user) {
         const userRef = ref(database, 'users/' + user.uid);
         update(userRef, {
             status: 'activo'
         }).then(() => {
             console.log('User status set to activo');
         }).catch((error) => {
             console.error('Error updating user status:', error);
         });

         document.getElementById('userName').innerHTML = `<p>Nombre: ${user.displayName}</p>`;
         idUsuario = user.uid;
     } else {
         document.getElementById('userName').innerHTML = '<p>No se ha iniciado sesión.</p>';
     }
 });

 // Update user status to 'inactivo' when user logs out
 const buttonlogout = document.getElementById("buttonlogout");
 buttonlogout.addEventListener("click", async function() {
     const user = auth.currentUser;
     if (user) {
         const userRef = ref(database, 'users/' + user.uid);
         await update(userRef, {
             status: 'inactivo'
         }).then(async () => {
             await signOut(auth);
             localStorage.removeItem('currentUser');
             window.location.href = 'MenuModo.html';
         }).catch((error) => {
             console.error('Error updating user status:', error);
         });
     }
 });

 // Update user status to 'inactivo' when window is closed
 window.addEventListener('beforeunload', async (event) => {
     const user = auth.currentUser;
     if (user) {
         const userRef = ref(database, 'users/' + user.uid);
         await update(userRef, {
             status: 'inactivo'
         }).catch((error) => {
             console.error('Error updating user status:', error);
         });
     }
 });



function updateUserData(userId, x, z) {

    const userRef = ref(database, 'users/' + userId);

    update(userRef, {
        x: x,
        z: z
    }).then(() => {
        console.log('User data updated successfully');
    }).catch((error) => {
        console.error('Error updating user data:', error);
    });
}


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
let terrainMesh;
//onst userLogged = localStorage.getItem('userLogged');
//let nombreUsuario = document.getElementById('userName');

//nombreUsuario.innerHTML = `<p><strong>${userLogged}</strong></p>`;


//OrbitControls allow the camera to move around the scene
let controls;
//Set which object to render
let objToRender = 'MisModelos';

const fondoTexture = new THREE.TextureLoader();
//imagen de fondo
const skytexture = fondoTexture.load('IMAGENES/CieloTextura.jpg');
scene.background = skytexture;


//Instantiate a loader for the .obj file
const objloader = new OBJLoader();
const textureLoader = new THREE.TextureLoader();



//Load the file
  objloader.load(
    'MODELOS/ArbolLava/ArbolLava.obj',
    function (arbol) {
        // Si el archivo se carga correctamente, añádelo a la escena
        arbol.scale.set(0.1, 0.1, 0.1);
        arbol.position.set(-180, 0, -60);
        arbol.rotation.set(0, 0, 0);

        // Cargar la textura
        textureLoader.load(
            'MODELOS/ArbolLava/Textura.png',
            function (texture) {
                console.log('Textura cargada correctamente:', texture);
                // Crear un material con la textura cargada
                const material = new THREE.MeshBasicMaterial({ map: texture });
                // Aplicar el material al objeto
                arbol.traverse(function (child) {
                    if (child instanceof THREE.Mesh) {
                        child.material = material;
                    }
                });
            },
            undefined,
            function (error) {
                console.error('Error al cargar la textura:', error);
            }
        );
        scene.add(arbol);
        arbolBoundingBox = new THREE.Box3().setFromObject(arbol);
    }
);
objloader.load(
  'MODELOS/Hongo/Hongo.obj',
  function (hongo) {
      // Si el archivo se carga correctamente, añádelo a la escena
      hongo.scale.set(40, 40, 40);
      hongo.position.set(-200, 12, -20);
      hongo.rotation.set(0, 0, 0);

      // Cargar la textura
      textureLoader.load(
          'MODELOS/Hongo/Textura.png',
          function (texture) {
              console.log('Textura cargada correctamente:', texture);
              // Crear un material con la textura cargada
              const material = new THREE.MeshBasicMaterial({ map: texture });
              // Aplicar el material al objeto
              hongo.traverse(function (child) {
                  if (child instanceof THREE.Mesh) {
                      child.material = material;
                  }
              });
          },
          undefined,
          function (error) {
              console.error('Error al cargar la textura:', error);
          }
      );
      scene.add(hongo);
      hongoBoundingBox = new THREE.Box3().setFromObject(hongo);
  }
);


//Instantiate a new renderer and set its size
const renderer = new THREE.WebGLRenderer({ alpha: true }); //Alpha: true allows for the transparent background
renderer.setSize(window.innerWidth, window.innerHeight);

//Add the renderer to the DOM
document.getElementById("container3D").appendChild(renderer.domElement);

//Set how far the camera will be from the 3D model
camera.position.z = objToRender === "MisModelos" ? 30 : 500;



//Add lights to the scene, so we can actually see the 3D model
const topLight = new THREE.DirectionalLight(0xffffff, 1); // (color, intensity)
topLight.position.set(500, 500, 500) //top-left-ish
topLight.castShadow = true;
scene.add(topLight);

//This adds controls to the camera, so we can rotate / zoom it with the mouse
if (objToRender === "MisModelos") {
 controls = new OrbitControls(camera, renderer.domElement);
}

//resposivity when you minimaze or maximaze the window
window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

function createTerrain() {
  const terrainMap = new THREE.PlaneGeometry(1000, 1000, sliders.widthseg, sliders.heightseg);
  const disMap = new THREE.TextureLoader()
    .setPath("")
    .load(sliders.heightMap);
  disMap.wrapS = disMap.wrapT = THREE.RepeatWrapping;
  disMap.repeat.set(sliders.hortexture, sliders.vertTexture);

  const texture = new THREE.TextureLoader()
    .setPath("")
    .load("IMAGENES/MapaTextura.jpg");
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(sliders.hortexture, sliders.vertTexture);

  const terrainMat = new THREE.MeshStandardMaterial({
    color: 0xffffff, // Color blanco para que la textura se muestre correctamente
    wireframe: false,
    displacementMap: disMap,
    displacementScale: sliders.dispScale,
    map: texture, // Asignar la textura del terreno al material
  });

  terrainMesh = new THREE.Mesh(terrainMap, terrainMat); 
  scene.add(terrainMesh);
  terrainMesh.rotation.x = -Math.PI / 2;
  terrainMesh.position.y = -0.5;

 
}
const sliders = {
  widthseg: 160,
  heightseg: 160,
  heightMap: "IMAGENES/MapaAlturas.jpg",
  hortexture: 1,
  vertTexture: 1,
  dispScale: 120
};

//velocidad de camara
const cameraSpeed = 3;
camera.position.y = 15;

//mover camara
/*
document.addEventListener('keydown', (event) => {
  switch(event.key) {
 case 'i':
  camera.position.z -= cameraSpeed; // adelante
  break;
case 'j':
  camera.position.x -= cameraSpeed; // izquierda
  break;
case 'k':
  camera.position.z += cameraSpeed; // atrás
  break;
case 'l':
  camera.position.x += cameraSpeed; // derecha
  break;

  } 

});*/

document.addEventListener('keydown', function(event) {
  // Si la tecla presionada es la barra espaciadora
  if (event.code === 'Space') {
    // Seleccionar el modal y mostrarlo
    const modal = document.getElementById('myModal');
    modal.style.display = 'block';
  }
});

document.querySelector('.btn-close').addEventListener('click', function() {
  const modal = document.getElementById('myModal');
  modal.style.display = 'none';
});



const loaderGLTF = new GLTFLoader();


let enemy1BoundingBox;
let enemy2BoundingBox;
let enemy3BoundingBox;
let enemy4BoundingBox;
let enemy5BoundingBox;
let moneyBoundingBox;
let ammoBoundingBox;
let medkitBoundingBox;
let laserBoundingBox= [];
let plataformaBoundingBox= [];
let bombaBoundingBox= [];
let base1BoundingBox;
let base2BoundingBox;
let base3BoundingBox;
let tunel1BoundingBox;
let tunel2BoundingBox;
let tunel3BoundingBox;
let nave1BoundingBox;
let nave2BoundingBox;
let nave3BoundingBox;
let built1BoundingBox;
let built2BoundingBox;
let door1BoundingBox;
let door2BoundingBox;
let cab1BoundingBox;
let cab2BoundingBox;
let hongoBoundingBox;
let arbolBoundingBox;
let enemyVida1 = 100;
let enemyVida2 = 100;
let enemyVida3 = 100;
let enemyVida4 = 100;
let enemyVida5 = 100; // Establecer la vida inicial del robot
let enemyEscape = 0 ;
let enemy2Escape =0;
let enemy3Escape =0;
let enemy4Escape =0;
let enemy5Escape =0;
let Escapes = 0;
let msj="Te Destruyeron";
const reduccionVida = 5; // Velocidad de reducción de la vida del robot
const dañarEnemigo = 8;
const laserfatal = 7;
const bombafatal = 10;
const plataformafatal = 0.001;
const recargarMunicion = 1;//aumento de municion
const curarVida = 5;//aumento de municion

// Función para el disparo desde el modelo del robot
function disparar() {
  // Crear una esfera como proyectil
  const proyectil = new THREE.Mesh(
      new THREE.SphereGeometry(0.2, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0xff0000 })
  );
  
  // Posicionar el proyectil en la misma posición que el modelo del robot
  proyectil.position.copy(model.position);
  
  // Añadir el proyectil a la escena
  scene.add(proyectil);
  
  // Definir la velocidad del proyectil
  const velocidadProyectil = 1  ;
  
  // Función para actualizar el movimiento del proyectil
  function moverProyectil() {
      // Mover el proyectil en la dirección del eje Z
      proyectil.position.z -= velocidadProyectil;
      
      // Actualizar el bounding box del proyectil
      const proyectilBoundingBox = new THREE.Box3().setFromObject(proyectil);
      
      // Verificar si hay colisión con el enemigo
      if (proyectilBoundingBox.intersectsBox(enemy1BoundingBox)) {
        // Reducir la vida del robot si hay colisión
        enemyVida1 -= dañarEnemigo;
        if (enemyVida1 < 0) {
          enemyVida1 = 0;
       
      }
        console.log("¡Colisión detectada! Vida del Enemigo1:", enemyVida1);
        scene.remove(proyectil);
        // Verificar si la vida del robot llega a cero
        if (enemyVida1 === 0) {
            console.log("¡El pulpodo 1 ha sido destruido!");
            enemy1BoundingBox = null;
            scene.remove(modeloo1);
            // Aquí puedes agregar la lógica para lo que quieras hacer cuando el robot sea destruido
        }
      } 
      
      if (proyectilBoundingBox.intersectsBox(enemy2BoundingBox)) {
        // Reducir la vida del robot si hay colisión
        enemyVida2 -= dañarEnemigo;
        if (enemyVida2 < 0) {
          enemyVida2 = 0;
       
      }
        console.log("¡Colisión detectada! Vida del Enemigo2:", enemyVida2);
        scene.remove(proyectil);
        // Verificar si la vida del robot llega a cero
        if (enemyVida2 === 0) {
            console.log("¡El pulpodo 2 ha sido destruido!");
          enemy2BoundingBox = null;
            scene.remove(modeloo2);
            // Aquí puedes agregar la lógica para lo que quieras hacer cuando el robot sea destruido
        }
      } 
      
      if (proyectilBoundingBox.intersectsBox(enemy3BoundingBox)) {
        // Reducir la vida del robot si hay colisión
        enemyVida3 -= dañarEnemigo;
        if (enemyVida3 < 0) {
          enemyVida3 = 0;
       
      }
        console.log("¡Colisión detectada! Vida del Enemigo3:", enemyVida3);
        scene.remove(proyectil);
        // Verificar si la vida del robot llega a cero
        if (enemyVida3 === 0) {
            console.log("¡El pulpodo 3 ha sido destruido!");
            enemy3BoundingBox = null;
            scene.remove(modeloo3);
            // Aquí puedes agregar la lógica para lo que quieras hacer cuando el robot sea destruido
        }
      }

      if (proyectilBoundingBox.intersectsBox(enemy4BoundingBox)) {
        // Reducir la vida del robot si hay colisión
        enemyVida4 -= dañarEnemigo;
        if (enemyVida4 < 0) {
          enemyVida4 = 0;
       
      }
        console.log("¡Colisión detectada! Vida del Enemigo4:", enemyVida4);
        scene.remove(proyectil);
        // Verificar si la vida del robot llega a cero
        if (enemyVida4 === 0) {
            console.log("¡El pulpodo 4 ha sido destruido!");
            enemy4BoundingBox = null;
            scene.remove(modeloo4);
            // Aquí puedes agregar la lógica para lo que quieras hacer cuando el robot sea destruido
        }
      }
      if (proyectilBoundingBox.intersectsBox(enemy5BoundingBox)) {
        // Reducir la vida del robot si hay colisión
        enemyVida5 -= dañarEnemigo;
        if (enemyVida5 < 0) {
          enemyVida5 = 0;
       
      }
        console.log("¡Colisión detectada! Vida del Enemigo5:", enemyVida5);
        scene.remove(proyectil);
        // Verificar si la vida del robot llega a cero
        if (enemyVida5 === 0) {
            console.log("¡El pulpodo 5 ha sido destruido!");
            enemy5BoundingBox = null;
            scene.remove(modeloo5);

        
            // Aquí puedes agregar la lógica para lo que quieras hacer cuando el robot sea destruido
        }
      }
      
      
      
      else {
          // Solicitar el próximo fotograma de animación para el movimiento continuo del proyectil
          requestAnimationFrame(moverProyectil);
      }
 
  }
  
  
  // Iniciar el movimiento del proyectil
  moverProyectil();
}
let previousPosition = new THREE.Vector3();

const db = getDatabase();
const starCountRef = ref(db, 'users/' );
onValue(starCountRef, (snapshot) => {
    const data = snapshot.val();
    console.log(data);

    Object.entries(data).forEach(([key, value])=>{
    if (value.status === 'activo') {
        console.log(`${key} ${value.name} ${value.x} ${value.z}`);
        const jugador = scene.getObjectByName(key);

    if(!jugador){
let robotBoundingBox;
            //PRIMER ROBOT
            let bombas = [];
let lasers = [];
let plataformas = [];
let mixer;
let robotVida = 100; // Establecer la vida inicial del robot

let robotDinero = 0; // Establecer la dinero inicial del robot
let robotMunicion = 0;//Establecer municion inicial

let model;
var jugadorActual;
loaderGLTF.load(
    "MODELOS/robot_walk_cycle.glb",
    function (gltf) {
        model = gltf.scene;
        model.scale.set(2, 2, 2);

        model.name = key;
        model.position.set(value.x, 0, value.z);
        scene.add(model);

    // Crear un sprite para el nombre de usuario
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const fontSize = 100;
    context.font = `${fontSize}px Arial`;
    context.fillStyle = 'white';
    context.fillText(value.name, 0, fontSize);

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(spriteMaterial);
    
    // Ajustar la escala del sprite para que sea más legible
    sprite.scale.set(2.5, 1, 0.5);

    // Posicionar el sprite por encima del robot
    sprite.position.set(0, 3, 0); // Posición relativa al modelo
                    
    // Hacer que el sprite sea hijo del modelo
    model.add(sprite);

        mixer = new THREE.AnimationMixer(model);
        gltf.animations.forEach((clip) => {
            mixer.clipAction(clip).play();
        });

        // Crear caja de colisión para el primer robot
        robotBoundingBox = new THREE.Box3().setFromObject(model);
        // Crear el HUD
        const hudElement = document.createElement('div');
        hudElement.id = 'hud';
        hudElement.style.position = 'absolute';
        hudElement.style.top = '24px';
        hudElement.style.left = '10px';
        hudElement.style.color = 'white';
        hudElement.style.fontFamily = 'Arial';
        hudElement.style.fontSize = '16px';
        document.body.appendChild(hudElement);

        // Función para actualizar el HUD
        function updateHUD() {
            hudElement.innerHTML = `
                <p>Vida: ${robotVida}</p>
                <p>Munición: ${robotMunicion}</p>
                <p>Dinero: ${robotDinero}</p>
            `;

            // Cambiar el color de la vida en el HUD basado en el valor actual
            if (robotVida <= 25) {
                hudElement.style.color = 'red';
            } else {
                hudElement.style.color = 'white';
            }
        }
        
        function cargarBomba() {
            loaderGLTF.load(
                "MODELOS/bomb.glb",
                function (modelin) {
                  const bomba = modelin.scene;
                  bomba.scale.set(3, 3, 3);
                  bomba.position.copy(previousPosition); // Establecer la posición de la plataforma
                  scene.add(bomba);
                  bombas.push(bomba);
                  bombaBoundingBox.push(new THREE.Box3().setFromObject(bomba));
              }
            );
        }    
        
        function cargarLaser() {
            loaderGLTF.load(
                "MODELOS/laser_barrier.glb",
                function (modelin) {
                    const laser = modelin.scene;
                    laser.scale.set(10, 3, 6);
                    laser.position.copy(previousPosition); // Establecer la posición de la plataforma
                    scene.add(laser);
                    lasers.push(laser);
                    laserBoundingBox.push(new THREE.Box3().setFromObject(laser));
                }
            );
        }
        
        function cargarPlataforma() {
            loaderGLTF.load(
                "MODELOS/tablet_display.glb",
                function (modelin) {
                    const plata = modelin.scene;
                    plata.scale.set(80, 90, 60);
                    plata.rotation.set(0, 0, 99);
                    plata.position.copy(previousPosition); // Establecer la posición de la plataforma
                    scene.add(plata);
                    plataformas.push(plata);
                    plataformaBoundingBox.push(new THREE.Box3().setFromObject(plata));
                }
            );
            }
        
        document.addEventListener('keydown', (event) => {
             jugadorActual = scene.getObjectByName(idUsuario);
            previousPosition.copy(jugadorActual.position);
        
            if(jugadorActual != null){
                switch (event.key) {
                    case 'w':
                        jugadorActual.position.z -= cameraSpeed; // adelante
                       
                            updateUserData(idUsuario, jugadorActual.position.x, jugadorActual.position.z);
                        
                        break;
                    case 'a':
                        jugadorActual.position.x -= cameraSpeed; // izquierda
                       
                            updateUserData(idUsuario, jugadorActual.position.x, jugadorActual.position.z);
                        
                        break;
                    case 's':
                        jugadorActual.position.z += cameraSpeed; // atrás
                       
                            updateUserData(idUsuario, jugadorActual.position.x, jugadorActual.position.z);
                        
                        break;
                    case 'd':
                        jugadorActual.position.x += cameraSpeed; // derecha
                        
                            updateUserData(idUsuario, jugadorActual.position.x, jugadorActual.position.z);
                        
                        break;
                
                    case 'e':
                          if (robotMunicion > 0) {
                              disparar();
                              robotMunicion--;
                              console.log("¡Munición reducida! Munición restante:", robotMunicion);
                              updateHUD(); // Actualizar el HUD después de reducir la munición
                          }
                        break;
                    case '1':
                      if(robotDinero>=100){
                        cargarPlataforma();
                        robotDinero -= 100;
                        updateHUD();
                        } else {
                        // Mostrar mensaje indicando que el usuario no tiene suficiente dinero
                        console.log('No tienes suficiente dinero para comprar la plataforma.');
                        }
                        
                        break;
                    case '2':
                      if(robotDinero>=250){
                        cargarLaser();
                        robotDinero -= 250;
                        updateHUD();
                    } else {
                        // Mostrar mensaje indicando que el usuario no tiene suficiente dinero
                        console.log('No tienes suficiente dinero para comprar el laser.');
                    }
                      
                        break;
                    case '3':
                      if(robotDinero>=500){
                        cargarBomba();
                        robotDinero -= 500;
                        updateHUD();
                        } else {
                        // Mostrar mensaje indicando que el usuario no tiene suficiente dinero
                        console.log('No tienes suficiente dinero para comprar la bomba.');
                        }
                    break;
        
                    
                }
               
            }
            
          });
        

        function animate() {
            requestAnimationFrame(animate);
            handleCollisions();
            updateHUD();
            
             

            // Actualizar la posición del modelo
            jugadorActual.position.y = 0; // Ajustar la altura del modelo si es necesario
            function handleCollisions() {
            if (robotBoundingBox && enemy1BoundingBox&& enemy2BoundingBox && moneyBoundingBox && ammoBoundingBox && ammo2BoundingBox&& ammo3BoundingBox
              && medkitBoundingBox && medkit2BoundingBox && medkit3BoundingBox && money2BoundingBox&& money3BoundingBox
              &&base1BoundingBox&&base2BoundingBox&&base3BoundingBox&&tunel1BoundingBox&&tunel2BoundingBox&&tunel3BoundingBox
              &&nave1BoundingBox&&nave2BoundingBox&&nave3BoundingBox&&built1BoundingBox&&built2BoundingBox&&door1BoundingBox
              &&door2BoundingBox&&cab1BoundingBox&&cab2BoundingBox&&arbolBoundingBox&&hongoBoundingBox&& mixer) {
                robotBoundingBox.setFromObject(jugadorActual);
                

                if (robotBoundingBox.intersectsBox(enemy1BoundingBox)) {
                    // Reducir la vida del robot si hay colisión
                    robotVida -= reduccionVida;
                    if (robotVida < 0) {
                      robotVida = 0;
                  }
                    console.log("¡Colisión detectada! Vida del robot:", robotVida);

                    // Verificar si la vida del robot llega a cero
                    if (robotVida === 0) {
                        console.log("¡El robot ha sido destruido!");
                        scene.remove(jugadorActual);
                        msjTexto.innerHTML = msj;
                        alert("¡Abandonando sesion...!");
                        window.location.href = 'MainMenu.html';
                        // Aquí puedes agregar la lógica para lo que quieras hacer cuando el robot sea destruido
                    }
                  }
                  if (robotBoundingBox.intersectsBox(enemy2BoundingBox)) {
                    // Reducir la vida del robot si hay colisión
                    robotVida -= reduccionVida;
                    if (robotVida < 0) {
                      robotVida = 0;
                  }
                    console.log("¡Colisión detectada! Vida del robot:", robotVida);

                    // Verificar si la vida del robot llega a cero
                    if (robotVida === 0) {
                        console.log("¡El robot ha sido destruido!");
                        scene.remove(jugadorActual);
                        msjTexto.innerHTML = msj;
                        alert("¡Abandonando sesion...!");
                        window.location.href = 'MainMenu.html';
                        // Aquí puedes agregar la lógica para lo que quieras hacer cuando el robot sea destruido
                    }
                  }
                  if (robotBoundingBox.intersectsBox(enemy3BoundingBox)) {
                    // Reducir la vida del robot si hay colisión
                    robotVida -= reduccionVida;
                    if (robotVida < 0) {
                      robotVida = 0;
             
                  }
                    console.log("¡Colisión detectada! Vida del robot:", robotVida);

                    // Verificar si la vida del robot llega a cero
                    if (robotVida === 0) {
                        console.log("¡El robot ha sido destruido!");
                        scene.remove(jugadorActual);
                        msjTexto.innerHTML = msj;
                        alert("¡Abandonando sesion...!");
                        window.location.href = 'MainMenu.html';
                        // Aquí puedes agregar la lógica para lo que quieras hacer cuando el robot sea destruido
                    }
                  }
                  if (robotBoundingBox.intersectsBox(enemy4BoundingBox)) {
                    // Reducir la vida del robot si hay colisión
                    robotVida -= reduccionVida;
                    if (robotVida < 0) {
                      robotVida = 0;
                  }
                    console.log("¡Colisión detectada! Vida del robot:", robotVida);

                    // Verificar si la vida del robot llega a cero
                    if (robotVida === 0) {
                        console.log("¡El robot ha sido destruido!");
                        scene.remove(model);
                        msjTexto.innerHTML = msj;
                        alert("¡Abandonando sesion...!");
                        window.location.href = 'MainMenu.html';
                        // Aquí puedes agregar la lógica para lo que quieras hacer cuando el robot sea destruido
                    }
                  }
                  if (robotBoundingBox.intersectsBox(enemy5BoundingBox)) {
                    // Reducir la vida del robot si hay colisión
                    robotVida -= reduccionVida;
                    if (robotVida < 0) {
                      robotVida = 0;
                  }
                    console.log("¡Colisión detectada! Vida del robot:", robotVida);

                    // Verificar si la vida del robot llega a cero
                    if (robotVida === 0) {
                        console.log("¡El robot ha sido destruido!");
                        scene.remove(jugadorActual);
                        msjTexto.innerHTML = msj;
                        alert("¡Abandonando sesion...!");
                        window.location.href = 'MainMenu.html';

                        // Aquí puedes agregar la lógica para lo que quieras hacer cuando el robot sea destruido
                    }
                  }
                    // Verificar colisión con el dinero
                    if (robotBoundingBox.intersectsBox(moneyBoundingBox)){
                      // Aumentar el escape si hay colisión
                      if ( robotDinero  < 500) {
                        robotDinero  = 500;
                    }
                      console.log("¡Colisión detectada! Dinero:", robotDinero );
        
                      // Verificar si la vida del pulpodo llega a cero
                      if ( robotDinero  === 500) {
                          console.log("¡Este es el limite!");
                          scene.remove(money);
                          // Aquí puedes agregar la lógica para lo que quieras hacer cuando el robot sea destruido
                      }
                    }
                    if (robotBoundingBox.intersectsBox(money2BoundingBox)){
                      // Aumentar el escape si hay colisión
                      if ( robotDinero  < 500) {
                        robotDinero  = 500;
                    }
                      console.log("¡Colisión detectada! Dinero:", robotDinero );
        
                      // Verificar si la vida del pulpodo llega a cero
                      if ( robotDinero  === 500) {
                          console.log("¡Este es el limite!");
                          scene.remove(money2);
                          // Aquí puedes agregar la lógica para lo que quieras hacer cuando el robot sea destruido
                      }
                    }
                    if (robotBoundingBox.intersectsBox(money3BoundingBox)){
                      // Aumentar el escape si hay colisión
                      if ( robotDinero  < 500) {
                        robotDinero  = 500;
                    }
                      console.log("¡Colisión detectada! Dinero:", robotDinero );
        
                      // Verificar si la vida del pulpodo llega a cero
                      if ( robotDinero  === 500) {
                          console.log("¡Este es el limite!");
                          scene.remove(money3);
                          // Aquí puedes agregar la lógica para lo que quieras hacer cuando el robot sea destruido
                      }
                    }
                 
                   if (robotBoundingBox.intersectsBox(ammoBoundingBox)) {
                    // Aumentar munucion del robot si hay colisión
                    robotMunicion += recargarMunicion;
                    if (robotMunicion > 10) {
                      robotMunicion = 10;
                  }
                    console.log("¡Colisión detectada! Municion del robot:", robotMunicion);

                    // Verificar si la municion del robot llega a 5
                    if (robotMunicion === 10) {
                        console.log("¡Municion Recargada!");
                        scene.remove(ammo);
                    }
                  
                 }
                 if (robotBoundingBox.intersectsBox(ammo2BoundingBox)) {
                  // Aumentar munucion del robot si hay colisión
                  robotMunicion += recargarMunicion;
                  if (robotMunicion > 10) {
                    robotMunicion = 10;
                }
                  console.log("¡Colisión detectada! Municion del robot:", robotMunicion);

                  // Verificar si la municion del robot llega a 5
                  if (robotMunicion === 10) {
                      console.log("¡Municion Recargada!");
                      scene.remove(ammo2);
                  }
                
               }
               if (robotBoundingBox.intersectsBox(ammo3BoundingBox)) {
                // Aumentar munucion del robot si hay colisión
                robotMunicion += recargarMunicion;
                if (robotMunicion > 10) {
                  robotMunicion = 10;
              }
                console.log("¡Colisión detectada! Municion del robot:", robotMunicion);

                // Verificar si la municion del robot llega a 5
                if (robotMunicion === 10) {
                    console.log("¡Municion Recargada!");
                    scene.remove(ammo3);
                }
              
             }
                 if (robotBoundingBox.intersectsBox(medkitBoundingBox)) {
                  // Aumentar vida del robot si hay colisión
                  robotVida += curarVida;
                  if (robotVida > 100) {
                    robotVida = 100;
                }
                  console.log("¡Colisión detectada! Vida del robot:", robotVida);

                  // Verificar si la municion del robot llega a 5
                  if (robotVida === 100) {
                      console.log("¡Vida Restaurada!");
                      scene.remove(medicina);  
                  }
                
               }

               if (robotBoundingBox.intersectsBox(medkit2BoundingBox)) {
                // Aumentar vida del robot si hay colisión
                robotVida += curarVida;
                if (robotVida > 100) {
                  robotVida = 100;
              }
                console.log("¡Colisión detectada! Vida del robot:", robotVida);

                // Verificar si la municion del robot llega a 5
                if (robotVida === 100) {
                    console.log("¡Vida Restaurada!");
                    scene.remove(medicina2);  
                }
              
             }

             if (robotBoundingBox.intersectsBox(medkit3BoundingBox)) {
              // Aumentar vida del robot si hay colisión
              robotVida += curarVida;
              if (robotVida > 100) {
                robotVida = 100;
            }
              console.log("¡Colisión detectada! Vida del robot:", robotVida);

              // Verificar si la municion del robot llega a 5
              if (robotVida === 100) {
                  console.log("¡Vida Restaurada!");
                  scene.remove(medicina3);  
              }
            
           }
               if (robotBoundingBox.intersectsBox(base1BoundingBox)) {
                model.position.copy(previousPosition);
               }
               if (robotBoundingBox.intersectsBox(base2BoundingBox)) {
                model.position.copy(previousPosition);
               }
               if (robotBoundingBox.intersectsBox(base3BoundingBox)) {
                model.position.copy(previousPosition);
               }
               if (robotBoundingBox.intersectsBox(tunel1BoundingBox)) {
                model.position.copy(previousPosition);
               }
               if (robotBoundingBox.intersectsBox(tunel2BoundingBox)) {
                model.position.copy(previousPosition);
               }
               if (robotBoundingBox.intersectsBox(tunel3BoundingBox)) {
                model.position.copy(previousPosition);
               }
               if (robotBoundingBox.intersectsBox(nave1BoundingBox)) {
                model.position.copy(previousPosition);
               }
               if (robotBoundingBox.intersectsBox(nave2BoundingBox)) {
                model.position.copy(previousPosition);
               }
               if (robotBoundingBox.intersectsBox(nave3BoundingBox)) {
                model.position.copy(previousPosition);
               }
               if (robotBoundingBox.intersectsBox(built1BoundingBox)) {
                model.position.copy(previousPosition);
               }
               if (robotBoundingBox.intersectsBox(built2BoundingBox)) {
                model.position.copy(previousPosition);
               }
               if (robotBoundingBox.intersectsBox(door1BoundingBox)) {
                model.position.copy(previousPosition);
               }
               if (robotBoundingBox.intersectsBox(door2BoundingBox)) {
                model.position.copy(previousPosition);
               }
               if (robotBoundingBox.intersectsBox(cab1BoundingBox)) {
                model.position.copy(previousPosition);
               }
               if (robotBoundingBox.intersectsBox(cab2BoundingBox)) {
                model.position.copy(previousPosition);
               }
               if (robotBoundingBox.intersectsBox(hongoBoundingBox)) {
                model.position.copy(previousPosition);
               }
               if (robotBoundingBox.intersectsBox(arbolBoundingBox)) {
                model.position.copy(previousPosition);
               }
             
                mixer.update(0.04);
                renderer.render(scene, camera);
            }
            
          }
        }


        animate(); // Llamar a la función animate después de definirla
    }
);


    }else{
        scene.getObjectByName(key).position.x = value.x;
        scene.getObjectByName(key).position.z = value.z;
      

    }
    }

    });
});




let base1, base2, base3;

// Cargar el modelo base camp shelter
loaderGLTF.load(
    "MODELOS/sci_fi_base_camp_shelter.glb",
    function (gltf) {
        // Crear la primera instancia y asignarle posición
        base1 = gltf.scene.clone();
        base1.scale.set(4.2, 4.5, 4.2);
        base1.position.set(-80, -0.5, -30); 
        base1.rotation.set(0, 33, 0); //en medio
        scene.add(base1);
        
        //Crear la segunda instancia y asignarle posición
        base2 = gltf.scene.clone();
        base2.scale.set(4.2, 4.5, 4.2);
        base2.position.set(-120, -0.5, 70); 
        base2.rotation.set(0, 110, 0);  //abajo
        scene.add(base2);
        
        // Crear la tercera instancia y asignarle posición
        base3 = gltf.scene.clone();
        base3.scale.set(4.2, 4.5, 4.2);
        base3.position.set(30, -0.5, -10);
        base3.rotation.set(0, 69, 0);//arriba
        scene.add(base3);

        // Crear bounding boxes para cada instancia
        base1BoundingBox = new THREE.Box3().setFromObject(base1);
        base2BoundingBox = new THREE.Box3().setFromObject(base2);
        base3BoundingBox = new THREE.Box3().setFromObject(base3);

        // Animaciones para cada instancia
        const mixer1 = new THREE.AnimationMixer(base1);
        gltf.animations.forEach((clip) => {
            mixer1.clipAction(clip).play();
        });
        const mixer2 = new THREE.AnimationMixer(base2);
        gltf.animations.forEach((clip) => {
            mixer2.clipAction(clip).play();
        });
        const mixer3 = new THREE.AnimationMixer(base3);
        gltf.animations.forEach((clip) => {
            mixer3.clipAction(clip).play();
        });

        // Función para animar cada instancia
        function animate() {
            requestAnimationFrame(animate);
            mixer1.update(0.01);
            mixer2.update(0.01);
            mixer3.update(0.01);
            renderer.render(scene, camera);
        }
        animate();
    }
);
let tunel1,tunel2, tunel3;
loaderGLTF.load(
  "MODELOS/spawn_tunnel.glb",
  function (modelin) {
    tunel1 = modelin.scene.clone();
    tunel1.scale.set(3, 4, 4);
    tunel1.position.set(0, 0, 20);
    scene.add(tunel1);

    tunel2 = modelin.scene.clone();
    tunel2.scale.set(3, 4, 4);
    tunel2.position.set(2, 0, 130);
    tunel2.rotation.set(0, 33, 0);
    scene.add(tunel2);

    tunel3 = modelin.scene.clone();
    tunel3.scale.set(3, 4, 4);
    tunel3.position.set(-25, 0, -110);
    tunel3.rotation.set(0, 33, 0);
    scene.add(tunel3);

    tunel1BoundingBox = new THREE.Box3().setFromObject(tunel1);
    tunel2BoundingBox = new THREE.Box3().setFromObject(tunel2);
    tunel3BoundingBox = new THREE.Box3().setFromObject(tunel3);

  }
  
);
let built1, built2;
loaderGLTF.load(
  "MODELOS/scifi_building.glb",
  function (modelin) {
    built1 = modelin.scene.clone();
    built1.scale.set(0.4, 0.4, 0.4);
    built1.position.set(30, 0, 120);
    scene.add(built1);

    built2 = modelin.scene.clone();
    built2 .scale.set(0.4, 0.4, 0.4);
    built2 .position.set(-50, 0, -120);
    scene.add(built2);

    built1BoundingBox = new THREE.Box3().setFromObject(built1);
    built2BoundingBox = new THREE.Box3().setFromObject(built2);
  }
);
let door1, door2;
loaderGLTF.load(
  "MODELOS/scifi_building_entrance.glb",
  function (modelin) {
    door1 = modelin.scene.clone();
    door1.scale.set(1.8, 1.8, 1,8);
    door1.position.set(100, 0, 30);
    scene.add(door1);

    door2 = modelin.scene.clone();
    door2.scale.set(1.8, 1.8, 1,8);
    door2.position.set(-125, 0, 30);
    scene.add(door2);
    
    door1BoundingBox = new THREE.Box3().setFromObject(door1);
    door2BoundingBox = new THREE.Box3().setFromObject(door2);
  }
);
let cab1, cab2;
  loaderGLTF.load(
    "MODELOS/scifi_cabin.glb",
    function (modelin) {
      cab1 = modelin.scene.clone();
      cab1.scale.set(4, 4, 4);
      cab1.position.set(100, 0.1, -50);
      scene.add(cab1);

      cab2 = modelin.scene.clone();
      cab2.scale.set(4, 4, 4);
      cab2.position.set(-70, 0.1, 100);
      scene.add(cab2);

      cab1BoundingBox = new THREE.Box3().setFromObject(cab1);
      cab2BoundingBox = new THREE.Box3().setFromObject(cab2);
    }
  );
    let nave1,nave2, nave3;
    loaderGLTF.load(
      "MODELOS/mother_spaceship.glb",
        function (modelin) {
        nave1 = modelin.scene.clone();
        nave1.scale.set(1.2, 1.2, 1.2);
        nave1.position.set(30, 7,-120);
        nave1.rotation.set(0, 99, 0);
        scene.add(nave1);

        nave2 = modelin.scene.clone();
        nave2.scale.set(1.2, 1.2, 1.2);
        nave2.position.set(120,7,180);
        nave2.rotation.set(0, 33, 0);
        scene.add(nave2);

        nave3 = modelin.scene.clone();
        nave3.scale.set(1.2, 1.2, 1.2);
        nave3.position.set(-210, 7,50);
        nave3.rotation.set(0, 66, 0);
        scene.add(nave3);


        nave1BoundingBox = new THREE.Box3().setFromObject(nave1);
        nave2BoundingBox = new THREE.Box3().setFromObject(nave2);
        nave3BoundingBox = new THREE.Box3().setFromObject(nave3);
      }
    );
  //KIT MEDICO
  let medicina;
  loaderGLTF.load(
    "MODELOS/med_kit_red.glb",
    function (modelin) {
      medicina = modelin.scene;
      medicina.scale.set(0.5, 0.5, 0.5);
      medicina.position.set(7, 4, 7);
      medicina.rotation.set(99, 0, 0);
      scene.add(medicina);
      medkitBoundingBox = new THREE.Box3().setFromObject(medicina);
      function rotateModel() {
        medicina.rotation.z += 0.3;
        renderer.render(scene, camera);
        requestAnimationFrame(rotateModel);
      }
      rotateModel();
    }
  );

let medkit2BoundingBox;
  let medicina2;
  loaderGLTF.load(
    "MODELOS/med_kit_red.glb",
    function (modelin) {
      medicina2 = modelin.scene;
      medicina2.scale.set(0.5, 0.5, 0.5);
      medicina2.position.set(-36, 4, 33);
      medicina2.rotation.set(99, 0, 0);
      scene.add(medicina2);
      medkit2BoundingBox = new THREE.Box3().setFromObject(medicina2);
      function rotateModel() {
        medicina2.rotation.z += 0.3;
        renderer.render(scene, camera);
        requestAnimationFrame(rotateModel);
      }
      rotateModel();
    }
  );

let medkit3BoundingBox;
  let medicina3;
  loaderGLTF.load(
    "MODELOS/med_kit_red.glb",
    function (modelin) {
      medicina3 = modelin.scene;
      medicina3.scale.set(0.5, 0.5, 0.5);
      medicina3.position.set(66, 4, -66);
      medicina3.rotation.set(99, 0, 0);
      scene.add(medicina3);
      medkit3BoundingBox = new THREE.Box3().setFromObject(medicina3);
      function rotateModel() {
        medicina3.rotation.z += 0.3;
        renderer.render(scene, camera);
        requestAnimationFrame(rotateModel);
      }
      rotateModel();
    }
  );
  //MUNICION
  let ammo;
  loaderGLTF.load(
    "MODELOS/ammo_box.glb",
    function (modelin) {
      ammo= modelin.scene;
      ammo.scale.set(0.2, 0.2, 0.2);
      ammo.position.set(40, 4, 60);
      scene.add(ammo);
      ammoBoundingBox = new THREE.Box3().setFromObject(ammo);
      function rotateModel() {
        ammo.rotation.y += 0.3;
        renderer.render(scene, camera);
        requestAnimationFrame(rotateModel);
      }
      rotateModel();
    }
  );


let ammo2BoundingBox;
  let ammo2;
  loaderGLTF.load(
    "MODELOS/ammo_box.glb",
    function (modelin) {
      ammo2= modelin.scene;
      ammo2.scale.set(0.2, 0.2, 0.2);
      ammo2.position.set(-30, 4, 90);
      scene.add(ammo2);
      ammo2BoundingBox = new THREE.Box3().setFromObject(ammo2);
      function rotateModel() {
        ammo2.rotation.y += 0.3;
        renderer.render(scene, camera);
        requestAnimationFrame(rotateModel);
      }
      rotateModel();
    }
  );
  let ammo3BoundingBox;
  let ammo3;
  loaderGLTF.load(
    "MODELOS/ammo_box.glb",
    function (modelin) {
      ammo3= modelin.scene;
      ammo3.scale.set(0.2, 0.2, 0.2);
      ammo3.position.set(-90, 4, 30);
      scene.add(ammo3);
      ammo3BoundingBox = new THREE.Box3().setFromObject(ammo3);
      function rotateModel() {
        ammo3.rotation.y += 0.3;
        renderer.render(scene, camera);
        requestAnimationFrame(rotateModel);
      }
      rotateModel();
    }
  );
  //DINERO
  let money;
  loaderGLTF.load(
    "MODELOS/dinero.glb",
    function (modelin) {
      money = modelin.scene;
      money.scale.set(0.5, 0.5, 0.5);
      money.position.set(-120, 0, 40);
      scene.add(money);
      moneyBoundingBox = new THREE.Box3().setFromObject(money);
      function rotateModel() {
        money.rotation.y += 0.3;
        renderer.render(scene, camera);
        requestAnimationFrame(rotateModel);
      }
      rotateModel();
    }
  );

let money2BoundingBox;
  let money2;
  loaderGLTF.load(
    "MODELOS/dinero.glb",
    function (modelin) {
      money2 = modelin.scene;
      money2.scale.set(0.5, 0.5, 0.5);
      money2.position.set(50, 0, 40);
      scene.add(money2);
      money2BoundingBox = new THREE.Box3().setFromObject(money2);
      function rotateModel() {
        money2.rotation.y += 0.3;
        renderer.render(scene, camera);
        requestAnimationFrame(rotateModel);
      }
      rotateModel();
    }
  );

let money3BoundingBox;
  let money3;
  loaderGLTF.load(
    "MODELOS/dinero.glb",
    function (modelin) {
      money3 = modelin.scene;
      money3.scale.set(0.5, 0.5, 0.5);
      money3.position.set(-70, 0, -30);
      scene.add(money3);
      money3BoundingBox = new THREE.Box3().setFromObject(money3);
      function rotateModel() {
        money3.rotation.y += 0.3;
        renderer.render(scene, camera);
        requestAnimationFrame(rotateModel);
      }
      rotateModel();
    }
  );

 //Enemigo 1
 let modeloo1;
 let modeloo2;
 let modeloo3;
 let modeloo4;
 let modeloo5;
  loaderGLTF.load(
    "MODELOS/pulpodos.glb",
    function (modelin) {
      modeloo1 = modelin.scene;
      modeloo1.scale.set(1, 1, 1);
      modeloo1.position.set(-30, 5.5, 60);
        scene.add(modeloo1);
        enemy1BoundingBox = new THREE.Box3().setFromObject(modeloo1);

        // Definir los puntos A y B de la ruta
        const puntoA = new THREE.Vector3(-100, 5.5, 100);
        const puntoB = new THREE.Vector3(130, 5.5, -300);

        // Definir la duración total del movimiento en segundos
        const duracionMovimiento = 100; 

        // Crear una variable para el tiempo transcurrido
        let tiempoTranscurrido = 0;

        // Función para animar el movimiento del enemigo
        function animarMovimientoEnemigo() {
          // Calcular la posición del enemigo en función del tiempo transcurrido
          const factor = tiempoTranscurrido / duracionMovimiento;
          const posicionInterpolada = new THREE.Vector3().lerpVectors(puntoA, puntoB, factor);
      
          // Actualizar la posición del modelo del enemigo
          modeloo1.position.copy(posicionInterpolada);
      
          // Actualizar la posición del bounding box del enemigo
          enemy1BoundingBox.setFromObject(modeloo1);
      
          // Incrementar el tiempo transcurrido
          tiempoTranscurrido += 1 / 60; // Suponiendo una frecuencia de actualización de 60 FPS
      
          // Si el tiempo transcurrido supera la duración del movimiento, reiniciar el tiempo
          if (tiempoTranscurrido > duracionMovimiento) {
              tiempoTranscurrido = 0;
          }
          laserBoundingBox.forEach((box, index) => box.setFromObject(lasers[index]));
          bombaBoundingBox.forEach((box, index) => box.setFromObject(bombas[index]));
          plataformaBoundingBox.forEach((box, index) => box.setFromObject(plataformas[index]));
      
   
          if (enemy1BoundingBox && laserBoundingBox && bombaBoundingBox && plataformaBoundingBox && nave1BoundingBox) {
            enemy1BoundingBox.setFromObject(modeloo1);
    
            laserBoundingBox.forEach(box => {
              if (enemy1BoundingBox.intersectsBox(box)) {
                  enemyVida -= laserfatal;
                  enemyVida = Math.max(0, enemyVida);
                  console.log("¡Colisión con láser! Vida del pulpodo:", enemyVida);
                  if (enemyVida === 0) {
                      console.log("¡El pulpodo 1 ha sido destruido!");
                      scene.remove(modeloo1);
                      enemy1BoundingBox=null;
                  }
              }
          });
            bombaBoundingBox.forEach(box => {
              if (enemy1BoundingBox.intersectsBox(box)) {
                  enemyVida -= bombafatal;
                  enemyVida = Math.max(0, enemyVida);
                  console.log("¡Colisión con bomba! Vida del pulpodo:", enemyVida);
                  if (enemyVida === 0) {
                      console.log("¡El pulpodo 1 ha sido destruido!");
                      scene.remove(modeloo1);
                      enemy1BoundingBox=null;
                  }
              }
          });
            plataformaBoundingBox.forEach(box => {
              if (enemy1BoundingBox.intersectsBox(box)) {
                  enemyVida -= plataformafatal;
                  enemyVida = Math.max(0, enemyVida);
                  console.log("¡Colisión con plataforma! Vida del pulpodo:", enemyVida);
                  if (enemyVida === 0) {
                      console.log("¡El pulpodo ha 1 sido destruido!");
                      scene.remove(modeloo1);
                      enemy1BoundingBox=null;
                  }
              }
          });
          if (enemy1BoundingBox != null&&enemy1BoundingBox.intersectsBox(nave1BoundingBox) && enemyEscape === 0) {
            // Marcar la colisión como detectada
            enemyEscape = 1;
        
            console.log("¡Colisión detectada! Abordaje:", enemyEscape);
        
            // Verificar si la vida del enemigo llega a cero
            if (enemyEscape === 1) {
                console.log("¡El enemigo ha escapado!");
                scene.remove(modeloo1);
                enemy1BoundingBox=null;
                if (Escapes >= 0) {
                    Escapes = Escapes + 1;
                    console.log("Escapes:", Escapes);
            
                }
                         
                // Aquí puedes agregar la lógica para lo que quieras hacer cuando el enemigo sea destruido
            }
        }
        }
               // Solicitar el próximo fotograma de animación
               requestAnimationFrame(animarMovimientoEnemigo);
             
      }

        // Iniciar la animación del movimiento del enemigo
        animarMovimientoEnemigo();
    }
);
//Enemigo 2
loaderGLTF.load(
  "MODELOS/pulpodos.glb",
  function (modelin) {
    modeloo2 = modelin.scene;
      modeloo2.scale.set(1, 1, 1);
      modeloo2.position.set(-30, 5.5, 60);
      scene.add(modeloo2);
      enemy2BoundingBox = new THREE.Box3().setFromObject(modeloo2);

      // Definir los puntos A y B de la ruta
      const puntoA = new THREE.Vector3(-80, 5.5, 120);
      const puntoB = new THREE.Vector3(130, 5.5, -300);

      // Definir la duración total del movimiento en segundos
      const duracionMovimiento = 100; 

      // Crear una variable para el tiempo transcurrido
      let tiempoTranscurrido = 0;

      // Función para animar el movimiento del enemigo
      function animarMovimientoEnemigo() {
        // Calcular la posición del enemigo en función del tiempo transcurrido
        const factor = tiempoTranscurrido / duracionMovimiento;
        const posicionInterpolada = new THREE.Vector3().lerpVectors(puntoA, puntoB, factor);
    
        // Actualizar la posición del modelo del enemigo
        modeloo2.position.copy(posicionInterpolada);
    
        // Actualizar la posición del bounding box del enemigo
        enemy2BoundingBox.setFromObject(modeloo2);
    
        // Incrementar el tiempo transcurrido
        tiempoTranscurrido += 1 / 60; // Suponiendo una frecuencia de actualización de 60 FPS
    
        // Si el tiempo transcurrido supera la duración del movimiento, reiniciar el tiempo
        if (tiempoTranscurrido > duracionMovimiento) {
            tiempoTranscurrido = 0;
        }
        laserBoundingBox.forEach((box, index) => box.setFromObject(lasers[index]));
        bombaBoundingBox.forEach((box, index) => box.setFromObject(bombas[index]));
        plataformaBoundingBox.forEach((box, index) => box.setFromObject(plataformas[index]));
    
 
        if (enemy2BoundingBox && laserBoundingBox && bombaBoundingBox && plataformaBoundingBox && nave1BoundingBox) {
          enemy2BoundingBox.setFromObject(modeloo2);
  
          laserBoundingBox.forEach(box => {
            if (enemy2BoundingBox.intersectsBox(box)) {
                enemyVida -= laserfatal;
                enemyVida = Math.max(0, enemyVida);
                console.log("¡Colisión con láser! Vida del pulpodo:", enemyVida);
                if (enemyVida === 0) {
                    console.log("¡El pulpodo 2 ha sido destruido!");
                    scene.remove(modeloo2);
                    enemy2BoundingBox=null;
                }
            }
        });
          bombaBoundingBox.forEach(box => {
            if (enemy2BoundingBox.intersectsBox(box)) {
                enemyVida -= bombafatal;
                enemyVida = Math.max(0, enemyVida);
                console.log("¡Colisión con bomba! Vida del pulpodo:", enemyVida);
                if (enemyVida === 0) {
                    console.log("¡El pulpodo 2 ha sido destruido!");
                    scene.remove(modeloo2);
                    enemy2BoundingBox=null;
                }
            }
        });
          plataformaBoundingBox.forEach(box => {
            if (enemy2BoundingBox.intersectsBox(box)) {
                enemyVida -= plataformafatal;
                enemyVida = Math.max(0, enemyVida);
                console.log("¡Colisión con plataforma! Vida del pulpodo:", enemyVida);
                if (enemyVida === 0) {
                    console.log("¡El pulpodo 2 ha sido destruido!");
                    scene.remove(modeloo2);
                    enemy2BoundingBox=null;
                }
            }
        });
        if (enemy2BoundingBox != null&&enemy2BoundingBox.intersectsBox(nave1BoundingBox) && enemy2Escape === 0) {
          enemy2Escape = 1;
      
          console.log("¡Colisión con enemigo 2 detectada! Abordaje:", enemy2Escape);
      
          if (enemy2Escape === 1) {
              console.log("¡El enemigo 2 ha escapado!");
              scene.remove(modeloo2);
              enemy2BoundingBox=null;
              if (Escapes >= 0) {
                  Escapes = Escapes + 1;
                  console.log("Escapes:", Escapes);
              }
          }
      }
      }
             // Solicitar el próximo fotograma de animación
             requestAnimationFrame(animarMovimientoEnemigo);
           
    }

      // Iniciar la animación del movimiento del enemigo
      animarMovimientoEnemigo();
  }
);
//Enemigo 3
loaderGLTF.load(
  "MODELOS/pulpodos.glb",
  function (modelin) {
    modeloo3 = modelin.scene;
      modeloo3.scale.set(1, 1, 1);
      modeloo3.position.set(-30, 5.5, 60);
      scene.add(modeloo3);
      enemy3BoundingBox = new THREE.Box3().setFromObject(modeloo3);

      // Definir los puntos A y B de la ruta
      const puntoA = new THREE.Vector3(-100, 5.5, 150);
      const puntoB = new THREE.Vector3(130, 5.5, -300);

      // Definir la duración total del movimiento en segundos
      const duracionMovimiento = 100; 

      // Crear una variable para el tiempo transcurrido
      let tiempoTranscurrido = 0;

      // Función para animar el movimiento del enemigo
      function animarMovimientoEnemigo() {
        // Calcular la posición del enemigo en función del tiempo transcurrido
        const factor = tiempoTranscurrido / duracionMovimiento;
        const posicionInterpolada = new THREE.Vector3().lerpVectors(puntoA, puntoB, factor);
    
        // Actualizar la posición del modelo del enemigo
        modeloo3.position.copy(posicionInterpolada);
    
        // Actualizar la posición del bounding box del enemigo
        enemy3BoundingBox.setFromObject(modeloo3);
    
        // Incrementar el tiempo transcurrido
        tiempoTranscurrido += 1 / 60; // Suponiendo una frecuencia de actualización de 60 FPS
    
        // Si el tiempo transcurrido supera la duración del movimiento, reiniciar el tiempo
        if (tiempoTranscurrido > duracionMovimiento) {
            tiempoTranscurrido = 0;
        }
        laserBoundingBox.forEach((box, index) => box.setFromObject(lasers[index]));
        bombaBoundingBox.forEach((box, index) => box.setFromObject(bombas[index]));
        plataformaBoundingBox.forEach((box, index) => box.setFromObject(plataformas[index]));
    
 
        if (enemy3BoundingBox && laserBoundingBox && bombaBoundingBox && plataformaBoundingBox && nave1BoundingBox) {
          enemy3BoundingBox.setFromObject(modeloo3);
  
          laserBoundingBox.forEach(box => {
            if (enemy3BoundingBox.intersectsBox(box)) {
                enemyVida -= laserfatal;
                enemyVida = Math.max(0, enemyVida);
                console.log("¡Colisión con láser! Vida del pulpodo:", enemyVida);
                if (enemyVida === 0) {
                    console.log("¡El pulpodo 3 ha sido destruido!");
                    scene.remove(modeloo3);
                    enemy3BoundingBox=null;
                }
            }
        });
          bombaBoundingBox.forEach(box => {
            if (enemy3BoundingBox.intersectsBox(box)) {
                enemyVida -= bombafatal;
                enemyVida = Math.max(0, enemyVida);
                console.log("¡Colisión con bomba! Vida del pulpodo:", enemyVida);
                if (enemyVida === 0) {
                    console.log("¡El pulpodo 3 ha sido destruido!");
                    scene.remove(modeloo3);
                    enemy3BoundingBox=null;
                }
            }
        });
          plataformaBoundingBox.forEach(box => {
            if (enemy3BoundingBox.intersectsBox(box)) {
                enemyVida -= plataformafatal;
                enemyVida = Math.max(0, enemyVida);
                console.log("¡Colisión con plataforma! Vida del pulpodo:", enemyVida);
                if (enemyVida === 0) {
                    console.log("¡El pulpodo 3 ha sido destruido!");
                    scene.remove(modeloo3);
                    enemy3BoundingBox=null;
                }
            }
        });
        if (enemy3BoundingBox != null&&enemy3BoundingBox.intersectsBox(nave1BoundingBox) && enemy3Escape === 0) {
          enemy3Escape = 1;
      
          console.log("¡Colisión con enemigo 3 detectada! Abordaje:", enemy3Escape);
      
          if (enemy3Escape === 1) {
              console.log("¡El enemigo 3 ha escapado!");
              scene.remove(modeloo3);
              enemy3BoundingBox = null;
              if (Escapes >= 0) {
                  Escapes = Escapes + 1;
                  console.log("Escapes:", Escapes);
              }
          }
      }
      }
             // Solicitar el próximo fotograma de animación
             requestAnimationFrame(animarMovimientoEnemigo);
           
    }

      // Iniciar la animación del movimiento del enemigo
      animarMovimientoEnemigo();
  }
);
//Enemigo 4
loaderGLTF.load(
  "MODELOS/pulpodos.glb",
  function (modelin) {
    modeloo4 = modelin.scene;
      modeloo4.scale.set(1, 1, 1);
      modeloo4.position.set(-30, 5.5, 60);
      scene.add(modeloo4);
      enemy4BoundingBox = new THREE.Box3().setFromObject(modeloo4);

      // Definir los puntos A y B de la ruta
      const puntoA = new THREE.Vector3(-120, 5.5, 140);
      const puntoB = new THREE.Vector3(130, 5.5, -300);

      // Definir la duración total del movimiento en segundos
      const duracionMovimiento = 100; 

      // Crear una variable para el tiempo transcurrido
      let tiempoTranscurrido = 0;

      // Función para animar el movimiento del enemigo
      function animarMovimientoEnemigo() {
        // Calcular la posición del enemigo en función del tiempo transcurrido
        const factor = tiempoTranscurrido / duracionMovimiento;
        const posicionInterpolada = new THREE.Vector3().lerpVectors(puntoA, puntoB, factor);
    
        // Actualizar la posición del modelo del enemigo
        modeloo4.position.copy(posicionInterpolada);
    
        // Actualizar la posición del bounding box del enemigo
        enemy4BoundingBox.setFromObject(modeloo4);
    
        // Incrementar el tiempo transcurrido
        tiempoTranscurrido += 1 / 60; // Suponiendo una frecuencia de actualización de 60 FPS
    
        // Si el tiempo transcurrido supera la duración del movimiento, reiniciar el tiempo
        if (tiempoTranscurrido > duracionMovimiento) {
            tiempoTranscurrido = 0;
        }
        laserBoundingBox.forEach((box, index) => box.setFromObject(lasers[index]));
        bombaBoundingBox.forEach((box, index) => box.setFromObject(bombas[index]));
        plataformaBoundingBox.forEach((box, index) => box.setFromObject(plataformas[index]));
    
 
        if (enemy4BoundingBox && laserBoundingBox && bombaBoundingBox && plataformaBoundingBox && nave1BoundingBox) {
          enemy4BoundingBox.setFromObject(modeloo4);
  
          laserBoundingBox.forEach(box => {
            if (enemy4BoundingBox.intersectsBox(box)) {
                enemyVida -= laserfatal;
                enemyVida = Math.max(0, enemyVida);
                console.log("¡Colisión con láser! Vida del pulpodo:", enemyVida);
                if (enemyVida === 0) {
                    console.log("¡El pulpodo 4 ha sido destruido!");
                    scene.remove(modeloo4);
                    enemy4BoundingBox=null;
                }
            }
        });
          bombaBoundingBox.forEach(box => {
            if (enemy4BoundingBox.intersectsBox(box)) {
                enemyVida -= bombafatal;
                enemyVida = Math.max(0, enemyVida);
                console.log("¡Colisión con bomba! Vida del pulpodo:", enemyVida);
                if (enemyVida === 0) {
                    console.log("¡El pulpodo 4 ha sido destruido!");
                    scene.remove(modeloo4);
                    enemy4BoundingBox=null;
                }
            }
        });
          plataformaBoundingBox.forEach(box => {
            if (enemy4BoundingBox.intersectsBox(box)) {
                enemyVida -= plataformafatal;
                enemyVida = Math.max(0, enemyVida);
                console.log("¡Colisión con plataforma! Vida del pulpodo:", enemyVida);
                if (enemyVida === 0) {
                    console.log("¡El pulpodo 4 ha sido destruido!");
                    scene.remove(modeloo4);
                    enemy4BoundingBox=null;
                }
            }
        });
        if (enemy4BoundingBox != null&&enemy4BoundingBox.intersectsBox(nave1BoundingBox) && enemy4Escape === 0) {
          enemy4Escape = 1;
      
          console.log("¡Colisión con enemigo 4 detectada! Abordaje:", enemy4Escape);
      
          if (enemy4Escape === 1) {
              console.log("¡El enemigo 4 ha escapado!");
              scene.remove(modeloo4);
              enemy4BoundingBox=null;
              if (Escapes >= 0) {
                  Escapes = Escapes + 1;
                  console.log("Escapes:", Escapes);
              }
          }
      }
      }
             // Solicitar el próximo fotograma de animación
             requestAnimationFrame(animarMovimientoEnemigo);
           
    }

      // Iniciar la animación del movimiento del enemigo
      animarMovimientoEnemigo();
  }
);
//Enemigo 5
loaderGLTF.load(
  "MODELOS/pulpodos.glb",
  function (modelin) {
    modeloo5 = modelin.scene;
      modeloo5.scale.set(1, 1, 1);
      modeloo5.position.set(-30, 5.5, 60);
      scene.add(modeloo5);
      enemy5BoundingBox = new THREE.Box3().setFromObject(modeloo5);

      // Definir los puntos A y B de la ruta
      const puntoA = new THREE.Vector3(-110, 5.5, 120);
      const puntoB = new THREE.Vector3(130, 5.5, -300);

      // Definir la duración total del movimiento en segundos
      const duracionMovimiento = 100; 

      // Crear una variable para el tiempo transcurrido
      let tiempoTranscurrido = 0;

      // Función para animar el movimiento del enemigo
      function animarMovimientoEnemigo() {
        // Calcular la posición del enemigo en función del tiempo transcurrido
        const factor = tiempoTranscurrido / duracionMovimiento;
        const posicionInterpolada = new THREE.Vector3().lerpVectors(puntoA, puntoB, factor);
    
        // Actualizar la posición del modelo del enemigo
        modeloo5.position.copy(posicionInterpolada);
    
        // Actualizar la posición del bounding box del enemigo
        enemy5BoundingBox.setFromObject(modeloo5);
    
        // Incrementar el tiempo transcurrido
        tiempoTranscurrido += 1 / 60; // Suponiendo una frecuencia de actualización de 60 FPS
    
        // Si el tiempo transcurrido supera la duración del movimiento, reiniciar el tiempo
        if (tiempoTranscurrido > duracionMovimiento) {
            tiempoTranscurrido = 0;
        }
        laserBoundingBox.forEach((box, index) => box.setFromObject(lasers[index]));
        bombaBoundingBox.forEach((box, index) => box.setFromObject(bombas[index]));
        plataformaBoundingBox.forEach((box, index) => box.setFromObject(plataformas[index]));
    
 
        if (enemy5BoundingBox && laserBoundingBox && bombaBoundingBox && plataformaBoundingBox && nave1BoundingBox) {
          enemy5BoundingBox.setFromObject(modeloo5);
  
          laserBoundingBox.forEach(box => {
            if (enemy5BoundingBox.intersectsBox(box)) {
                enemyVida -= laserfatal;
                enemyVida = Math.max(0, enemyVida);
                console.log("¡Colisión con láser! Vida del pulpodo:", enemyVida);
                if (enemyVida === 0) {
                    console.log("¡El pulpodo 5 ha sido destruido!");
                    scene.remove(modeloo5);
                    enemy5BoundingBox=null;
                }
            }
        });
          bombaBoundingBox.forEach(box => {
            if (enemy5BoundingBox.intersectsBox(box)) {
                enemyVida -= bombafatal;
                enemyVida = Math.max(0, enemyVida);
                console.log("¡Colisión con bomba! Vida del pulpodo:", enemyVida);
                if (enemyVida === 0) {
                    console.log("¡El pulpodo 5 ha sido destruido!");
                    scene.remove(modeloo5);
                    enemy5BoundingBox=null;
                }
            }
        });
          plataformaBoundingBox.forEach(box => {
            if (enemy5BoundingBox.intersectsBox(box)) {
                enemyVida -= plataformafatal;
                enemyVida = Math.max(0, enemyVida);
                console.log("¡Colisión con plataforma! Vida del pulpodo:", enemyVida);
                if (enemyVida === 0) {
                    console.log("¡El pulpodo 5 ha sido destruido!");
                    scene.remove(modeloo5);
                    enemy5BoundingBox=null;
                }
            }
        });
        if (enemy5BoundingBox != null &&enemy5BoundingBox.intersectsBox(nave1BoundingBox) && enemy5Escape === 0) {
          enemy5Escape = 1;
      
          console.log("¡Colisión con enemigo 5 detectada! Abordaje:", enemy5Escape);
      
          if (enemy5Escape === 1) {
              console.log("¡El enemigo 5 ha escapado!");
              scene.remove(modeloo5);
              enemy5BoundingBox=null;
              if (Escapes >= 0) {
                  Escapes = Escapes + 1;
                  console.log("Escapes:", Escapes);
              }
          }
      }
      }
             // Solicitar el próximo fotograma de animación
             requestAnimationFrame(animarMovimientoEnemigo);
           
    }

      // Iniciar la animación del movimiento del enemigo
      animarMovimientoEnemigo();
  }
);




  let tiempoRestante = 60 * 60;
  let intervaloTiempo;

  // Crear Timer para el HUD
  const hudElement = document.createElement('div');
  hudElement.id = 'hud';
  hudElement.style.position = 'absolute';
  hudElement.style.top = '10px';
  hudElement.style.left = '570px';
  hudElement.style.color = 'white';
  hudElement.style.fontFamily = 'Arial';
  hudElement.style.fontSize = '20px';
  document.body.appendChild(hudElement);
// Crear elementos de texto para mostrar la calificación y el número de escapes
var calificacionTexto = document.createElement('div');
calificacionTexto.style.position = 'absolute';
calificacionTexto.style.width = 200;
calificacionTexto.style.height = 50;
calificacionTexto.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
calificacionTexto.style.color = '#ffffff';
calificacionTexto.style.top = '10px';
calificacionTexto.style.left = '1100px';
calificacionTexto.style.textAlign = 'center';
calificacionTexto.style.fontFamily = 'Arial';
calificacionTexto.style.fontSize = '20px';
calificacionTexto.innerHTML = 'Calificacion: ';

var escapesTexto = document.createElement('div');
escapesTexto.style.position = 'absolute';
escapesTexto.style.width = 200;
escapesTexto.style.height = 50;
escapesTexto.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
escapesTexto.style.color = '#ffffff';
escapesTexto.style.top = '30px';
escapesTexto.style.left = '1100px';
escapesTexto.style.textAlign = 'center';
escapesTexto.style.fontFamily = 'Arial';
escapesTexto.style.fontSize = '20px';
escapesTexto.innerHTML = 'Escapes: ';

// Crear un elemento de texto para mostrar el mensaje de victoria o derrota
var mensajeTexto = document.createElement('div');
mensajeTexto.style.position = 'absolute';
mensajeTexto.style.width = 300;
mensajeTexto.style.height = 50;
mensajeTexto.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
mensajeTexto.style.color = '#ffffff';
mensajeTexto.style.top = '300px';
mensajeTexto.style.left = '550px';
mensajeTexto.style.textAlign = 'center';
mensajeTexto.style.fontFamily = 'Arial';
mensajeTexto.style.fontSize = '38px';


var msjTexto = document.createElement('div');
msjTexto.style.position = 'absolute';
msjTexto.style.width = 300;
msjTexto.style.height = 50;
msjTexto.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
msjTexto.style.color = '#ffffff';
msjTexto.style.top = '300px';
msjTexto.style.left = '550px';
msjTexto.style.textAlign = 'center';
msjTexto.style.fontFamily = 'Arial';
msjTexto.style.fontSize = '38px';

// Agregar el elemento de texto al documento
document.body.appendChild(mensajeTexto);
document.body.appendChild(msjTexto);
// Agregar elementos de texto al documento
document.body.appendChild(calificacionTexto);
document.body.appendChild(escapesTexto);

// Función para actualizar el HUD con la calificación y el número de escapes
function actualizarHUD() {
    // Actualizar el texto de la calificación
    if (Escapes === 5) {
        calificacionTexto.innerHTML = 'Calificación de partida: F';
    } else if (Escapes === 4) {
        calificacionTexto.innerHTML = 'Calificación de partida: E';
    } else if (Escapes === 3) {
        calificacionTexto.innerHTML = 'Calificación de partida: D';
    } else if (Escapes === 2) {
        calificacionTexto.innerHTML = 'Calificación de partida: C';
    } else if (Escapes === 1) {
        calificacionTexto.innerHTML = 'Calificación de partida: B';
    } else if (Escapes === 0) {
        calificacionTexto.innerHTML = 'Calificación de partida: A';
    } else {
        calificacionTexto.innerHTML = 'Calificación de partida: Fuera de rango';
    }

    // Actualizar el texto del número de escapes
    escapesTexto.innerHTML = 'Número de escapes: ' + Escapes;
}

  function actualizarTemporizador() {
    if (tiempoRestante >= 0) {
        const horas = Math.floor(tiempoRestante / 3600);
        const minutos = Math.floor((tiempoRestante % 3600) / 60);
        const segundos = tiempoRestante % 60;

        const tiempoFormateado = `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;

        hudElement.innerHTML = `
            <p>Tiempo restante: ${tiempoFormateado}</p>
        `;

        tiempoRestante--;
        actualizarHUD();
    } else {
        clearInterval(intervaloTiempo);
        console.log("¡Tiempo agotado! La partida ha terminado.");
        let mensaje = "";
        if (Escapes >= 0 && Escapes <= 2) {
            mensaje = "¡Has ganado!";
        } else {
            mensaje = "¡Has perdido!";
        }

        actualizarHUD();
        mensajeTexto.innerHTML = mensaje;
        alert("¡Tiempo de la partida agotado!");
        window.location.href = 'MainMenu.html';
    }
}
// Iniciar el temporizador
intervaloTiempo = setInterval(actualizarTemporizador, 1000);// Actualizar cada segundo




const listener = new THREE.AudioListener();
const audioLoader = new THREE.AudioLoader();
const audio = new THREE.Audio(listener);

audioLoader.load('AUDIO/Spark_Elwood.mp3', function(buffer) {
    audio.setBuffer(buffer);
    audio.setLoop(true);
    audio.setVolume(0.01); // ajustar el volumen (de 0 a 1)
    audio.play();
});

// Crear un objeto contenedor para el audio
const audioObject = new THREE.Object3D();
audioObject.add(audio);
camera.add(audioObject); // Agregar el objeto contenedor a la cámara

//Renderizar la escena
function animate() {
  requestAnimationFrame(animate);
  actualizarTemporizador();
  renderer.render(scene, camera);
}
createTerrain();
animate();