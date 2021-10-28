import * as THREE from 'https://cdn.skypack.dev/three@0.128.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/loaders/GLTFLoader.js';

var mesh, texture, material, geometry, scene, raceauto, lamp, town;
var meshFloor, x, z;
var camera, renderer;
var ambientLight;
var light;
var count, hoeveel, hoever;
var keyboard = {};
var USE_WIREFRAME = false;
var player = { height:3.8, speed:0.2, turnSpeed:Math.PI*0.02 };
var objectList = [];
var headlights;
var finishlinecheck = 0;

function main() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.set(0, 9, -505);
    camera.lookAt(new THREE.Vector3(0,player.height,0));

    //if you want to have a town surrounding the road you can use this code, but it will be very low fps
    // const loader = new GLTFLoader();
    // loader.load('model/Townbackground.glb', function(gltf) {
    //     gltf.scene.traverse( function( node ) {

    //         if ( node.isMesh ) { node.castShadow = true; }
    
    //     } );
    //     town = gltf.scene;
    //     town.scale.set(200,200,100)
    //     town.position.set(-16, -64, -400);
    //     town.rotateY(Math.PI / 2)
    //     scene.add(town)
    // }
    //     )
       
    const loader = new GLTFLoader();
    loader.load('model/automodel.glb', function(gltf) {
        gltf.scene.traverse( function( node ) {

            if ( node.isMesh ) { node.castShadow = true; }
    
        } );
        raceauto = gltf.scene;
        raceauto.scale.set(0.5,0.5,0.5)
        raceauto.position.set(0, 1, -490);
        raceauto.rotateY(Math.PI / 1)
        raceauto.castShadow = true;
        raceauto.receiveShadow = true;
        scene.add(raceauto)
        
        renderer.render( scene, camera );}, 
        )
        loader.castShadow = true;
        loader.receiveShadow = true;

      
          //camerasettings

            renderer = new THREE.WebGLRenderer();
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.BasicShadowMap;

            ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
            scene.add(ambientLight);

            headlights = new THREE.PointLight(0xffffff, 1.5, 20);
              
                headlights.castShadow = true;
                headlights.shadow.camera.near = 2;
                headlights.shadow.camera.far = 40;
                headlights.position.set(0, 3, -470);
                scene.add(headlights);

            renderer.setSize( window.innerWidth, window.innerHeight );
            document.body.appendChild( renderer.domElement );



    checkfinishline()
      createenemys()
      loadroad()
      createlight()
      skybox()
       

            //const controls = new OrbitControls(camera, canvas);
            //controls.target.set(0, 0, 0);
            //controls.update();
            
            function resizeRendererToDisplaySize(renderer) {
                const canvas = renderer.domElement;
                const width = canvas.clientWidth;
                const height = canvas.clientHeight;
                const needResize = canvas.width !== width || canvas.height !== height;
                if (needResize) {
                  renderer.setSize(width, height, false);
                }
                return needResize;
              }     

              function render(time) {
                time *= 0.001;
            
                if (resizeRendererToDisplaySize(renderer)) {
                  const canvas = renderer.domElement;
                  camera.aspect = canvas.clientWidth / canvas.clientHeight;
                  camera.updateProjectionMatrix();
                }
            
                renderer.render(scene, camera);
            
                requestAnimationFrame(render);
              }
            
              requestAnimationFrame(render);
            }

//This loads the road
function loadroad(){
    texture = new THREE.TextureLoader().load( "images/roadbackground.jpg" );
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set( 2, 50 );
    geometry = new THREE.PlaneGeometry(18, 1500, 10),
    material = new THREE.MeshPhongMaterial({map : texture, wireframe:USE_WIREFRAME})
	meshFloor = new THREE.Mesh(geometry, material);
	meshFloor.rotation.x -= Math.PI / 2; // Rotate the floor 90 degrees
    meshFloor.castShadow = true;
    meshFloor.receiveShadow = true;
	scene.add(meshFloor);

    const gras = new THREE.TextureLoader().load( "images/zijkant.jpg" );
    gras.wrapS = THREE.RepeatWrapping;
    gras.wrapT = THREE.RepeatWrapping;
    gras.repeat.set( 2,  1000 );
    const bos = new THREE.PlaneGeometry(1000, 1500, 10)
    const bosje = new THREE.MeshPhongMaterial({map : gras, wireframe:USE_WIREFRAME})
    const randjeweg = new THREE.Mesh(bos, bosje);
    const randjeweg2 = new THREE.Mesh(bos, bosje);
    randjeweg2.rotation.x -= Math.PI / 2; // Rotate the floor 90 degrees
    randjeweg2.position.set(-509 , 0, 0);
    randjeweg2.castShadow = true;
    randjeweg2.ReceiveShadow = true;
    scene.add(randjeweg2);
    randjeweg.rotation.x -= Math.PI / 2; // Rotate the floor 90 degrees
    randjeweg.position.set(509 , 0, 0);
    randjeweg.castShadow = true;
    randjeweg.ReceiveShadow = true;
    scene.add(randjeweg);
    
    const reling = new THREE.BoxGeometry( 2, 1, 1500);
    const reling1 = new THREE.MeshPhongMaterial( { color: 0x000000 });
    const cube = new THREE.Mesh(reling, reling1);
    cube.position.set(-10, 0.5, 0)
    cube.CastShadow = true;
    cube.ReceiveShadow = true;
    scene.add(cube);
    const cube2 = new THREE.Mesh(reling, reling1);
    cube2.position.set(10, 0.5, 0)
    cube2.CastShadow = true;
    cube2.ReceiveShadow = true;
    scene.add(cube2);  


    const finish = new THREE.BoxGeometry( 18, 0.2, 5);
    const finishmaterial = new THREE.MeshPhongMaterial( { color: 0xfffffff });
    const finishline = new THREE.Mesh(finish, finishmaterial);
    finishline.position.set(0, 0.5, 500)
    finishline.CastShadow = true;
    finishline.ReceiveShadow = true;
    scene.add(finishline);
  
}

function finish(){
    gewonnen();
}

function createlight(){

    let hoeveel = 0;
    let hoeveel1 = 0;
    let hoeveel2 = 0;
    let hoeveel3 = 0;
    let hoever = -450;
    let hoever1 = -450;
    let hoever2 = -370;
    let hoever3 = -370;



     for(count = 10; count < 1000; count++) {
        if(hoeveel < 10){
          
             const gltfloader = new GLTFLoader();
             gltfloader.load('model/StreetLamp.glb', function(gltf) {
                gltf.scene.traverse( function( node ) {

                    if ( node.isMesh ) { node.castShadow = true; }
            
                } );
                 lamp = gltf.scene;
                 lamp.scale.set(0.5,1,0.5)
                 lamp.position.set(-9, 1 , hoever1);
                 scene.add(light);
                 scene.add(lamp);
                 
                 hoever1 += 160;
                
             
                 ;}, 
                 )
                 hoeveel += 1;

                
             }    
   
         }

         for(count = 10; count < 1000; count++) {
            if(hoeveel2 < 10){
              
                 const gltfloader = new GLTFLoader();
                 gltfloader.load('model/StreetLamp.glb', function(gltf) {
                    gltf.scene.traverse( function( node ) {
    
                        if ( node.isMesh ) { node.castShadow = true; }
                
                    } );
               

                     lamp = gltf.scene;
                     lamp.rotateY(Math.PI / 1)
                     lamp.scale.set(0.5,1,0.5)
                     lamp.position.set(9, 1 , hoever2);
                     scene.add(light);
                     scene.add(lamp);
                     
                     hoever2 += 160;
                    
                 
                     ;}, 
                     )
                     hoeveel2 += 1;
    
                    
                 }    
       
             }
     
       
         for(count = 10; count < 1000; count++) {
            if(hoeveel1 < 6){
                light = new THREE.PointLight(0xffffff, 0.8, 25);
                light.castShadow = true;
                light.shadow.camera.near = 0.1;
                light.shadow.camera.far = 20;
                light.position.set(-3, 10, hoever);
                scene.add(light);
                     
                hoever += 160;  
                hoeveel1 += 1;
                    
                 }    
       
             }
             for(count = 10; count < 1000; count++) {
                if(hoeveel3 < 6){
                    light = new THREE.PointLight(0xffffff, 0.8, 25);
                    light.castShadow = true;
                    light.shadow.camera.near = 0.1;
                    light.shadow.camera.far = 20;
                    light.position.set(3, 10, hoever3);
                    scene.add(light);
                         
                    hoever3 += 160;  
                    hoeveel3 += 1;
                        
                     }    
           
                 }

            //  for(count = 10; count < 1000; count++) {
            //     if(hoeveel < 6){
            //         light = new THREE.PointLight(0xffffff, 0.8, 25);
            //         light.castShadow = true;
            //         light.shadow.camera.near = 0.1;
            //         light.shadow.camera.far = 20;
            //         light.position.set(-3, 10, hoever1);
            //         scene.add(light);
                         
            //         hoever1 += 160;  
            //         hoeveel += 1;
                        
            //          }    
           
            //      }
                
        
         
                // light = new THREE.PointLight(0xffffff, 0.8, 25);
                // light.position.set(-3, 10, hoever1+ 160);
                // light.castShadow = true;
                // light.shadow.camera.near = 0.1;
                // light.shadow.camera.far = 20;
                // scene.add(light);  
                                   
                // light = new THREE.PointLight(0xffffff, 0.8, 25);
                // light.position.set(-3, 10, hoever1 + 160 * 2);
                // light.castShadow = true;
                // light.shadow.camera.near = 0.1;
                // light.shadow.camera.far = 20;
                // scene.add(light);  
                
           
 
         
         
} 
       


function createenemys(){

    hoeveel = 0;
    hoever = -450;

       for(count = 10; count < 1000; count++) {
        if(hoeveel < 45){
          
             const gltfloader = new GLTFLoader();
             gltfloader.load('model/automodel2.glb', function(gltf) {
                gltf.scene.traverse( function( node ) {

                    if ( node.isMesh ) { node.castShadow = true; }
            
                } );
            
                 mesh = gltf.scene;
                 mesh.scale.set(0.5,0.5,0.5)
                 mesh.position.set(Math.floor(Math.random() * 14 ) - 6, 1, hoever);                 
                 mesh.receiveShadow = true;
                 mesh.receiveShadow = true;   
                 objectList.push(mesh); 
                 scene.add(mesh);
                 
                 hoever += 40;
                
             
                 ;}, 
                 )
                
                 hoeveel += 1;

                
             }    
   
         }

}

//this loads the skybox
function skybox(){
    const cLoader = new THREE.CubeTextureLoader();
    const texture = cLoader.load([
    'images/tropic_ft.jpg',
    'images/tropic_bk.jpg',
    'images/tropic_up.jpg',
    'images/tropic_dn.jpg',
    'images/tropic_rt.jpg',
    'images/tropic_lf.jpg',
    ]);
    scene.background = texture;
}


//this function is called on when the race is over
function gewonnen(){
    requestAnimationFrame(gewonnen);

    camera.position.z += -Math.cos(camera.rotation.y) * 0.01;
    camera.rotation.y += 0.01 * 1;
}

//this is a checkfunction if a and b are touching
function checkTouching(a, b) {
    let b1 = a.position.y;
    let t1 = a.position.y;
    let r1 = a.position.x;
    let l1 = a.position.x;
    let f1 = a.position.z + 5;
    let B1 = a.position.z - 5;
    let b2 = b.position.y;
    let t2 = b.position.y;
    let r2 = b.position.x;
    let l2 = b.position.x;
    let f2 = b.position.z;
    let B2 = b.position.z;
    if (t1 < b2 || r1 < l2 || b1 > t2 || l1 > r2 || f1 > B2 || B1 < f2) {
      return false;
    }
    return true;
  }

function checkfinishline(){
    
    if(finishlinecheck == 0){
        auto()   
    }
    if(finishlinecheck == 1){
        gewonnen()
    }
    
   
}

//the movement of the car
function auto(){
    requestAnimationFrame(auto);
    
    for( let i = 0; i <objectList.length; i++) {       
        objectList[i].position.z -= 0.01 * 10;     
    }

	// Keyboard movement inputs
	if(keyboard[87]){ // W key
        if(500> raceauto.position.z){
        headlights.position.z -= -Math.cos(camera.rotation.y) * (player.speed ** 0.4);
        raceauto.position.z -= -Math.cos(camera.rotation.y) * (player.speed ** 0.01);
        camera.position.z -= -Math.cos(camera.rotation.y) * (player.speed ** 0.01);
        }
        if(raceauto.position.z >500){
            finishlinecheck += 1;
            checkfinishline()
        }
        
    
	}
	if(keyboard[83]){ // S key
        headlights.position.z += -Math.cos(camera.rotation.y) * player.speed;
		raceauto.position.z += -Math.cos(camera.rotation.y) * player.speed;
        camera.position .z += -Math.cos(camera.rotation.y) * player.speed;
	}
	if(keyboard[65]){ // A key
		// Redirect motion by 90 degrees
        if(raceauto.position.x <= 7){
            headlights.position.x += Math.sin(camera.rotation.y + Math.PI/2) * player.speed;
		raceauto.position.x += Math.sin(camera.rotation.y + Math.PI/2) * player.speed;
        camera.position.x += Math.sin(camera.rotation.y + Math.PI/6) * player.speed;
        }       
	}
	if(keyboard[68]){ // D key
        if(-7 <= raceauto.position.x){
            headlights.position.x += Math.sin(camera.rotation.y - Math.PI/2) * player.speed;		

		raceauto.position.x += Math.sin(camera.rotation.y - Math.PI/2) * player.speed;		
        camera.position.x += Math.sin(camera.rotation.y - Math.PI/6) * player.speed;

        }

    }
   
}

function keyDown(event){
	keyboard[event.keyCode] = true;
}

function keyUp(event){
	keyboard[event.keyCode] = false;
}

window.addEventListener('keydown', keyDown);
window.addEventListener('keyup', keyUp);

main();

