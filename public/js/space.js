var SEPARATION = 70000;
var AMOUNT = 0.1;
var container, stats;
var camera, scene, renderer, particle, light;
var mouseX = 0, mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
init();
animate();

function init() {

  // space js
  container = document.createElement( 'zen' );
  document.body.appendChild( container );

  scene = new THREE.Scene();
  
  // camera
  camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 10000 );
  camera.position.z = 40;
  camera.position.x = 600;
  camera.position.y = 600;

  // stars
   var redTexture = new THREE.TextureLoader().load( 'https://cdn.glitch.com/a639612e-6854-4f12-bc78-fd8f0d99cf8c%2Flensflare0.png?1534972228655' );
   var blueTexture = new THREE.TextureLoader().load( 'https://cdn.glitch.com/a639612e-6854-4f12-bc78-fd8f0d99cf8c%2Fp_0.png?1535153618577' );
  
  
  for ( var lumpx = 0.015; lumpx <= AMOUNT;lumpx = lumpx*1.0005 ) {
    var colorProbability = Math.random();
    var material = new THREE.SpriteMaterial({ map: colorProbability > 0.9 ? redTexture : blueTexture, blending: THREE.AdditiveBlending });    
    var star = new THREE.Sprite( material );
    
    if (colorProbability > 0.999) {
      star.scale.y = 30;
      star.scale.x = 30;
    } else if (colorProbability > 0.995) {
      star.scale.y = 9;
      star.scale.x = 9;
    } else if (colorProbability > 0.95) {
      star.scale.y = 5;
      star.scale.x = 5;
    } else {
      star.scale.x = 3;
      star.scale.y = 3;
    }

    var randx = Math.random();
    var randxdir = Math.random() > 0.5 ? 1 : -1;

    var randy = Math.random();
    var randydir = Math.random() > 0.5 ? 1 : -1;

    var randz = Math.random(); 
    var randzdir = Math.random() > 0.5 ? 1 : -1;

    star.position.x = (lumpx * 0.05 * SEPARATION * randxdir * randx);
    star.position.y = (lumpx * 0.05 * SEPARATION * randydir * randy);
    star.position.z = (lumpx * 0.05 * SEPARATION * randzdir * randz);

    scene.add( star );
  }

  //renderer
  renderer = new THREE.WebGLRenderer({alpha: true });
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  container.appendChild( renderer.domElement );
  document.addEventListener( 'mousemove', onDocumentMouseMove, false );
  document.addEventListener( 'touchstart', onDocumentTouchStart, false );
  document.addEventListener( 'touchmove', onDocumentTouchMove, false );
  //
  window.addEventListener( 'resize', onWindowResize, false );
}

function onWindowResize() {
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}
function onDocumentMouseMove( event ) {
  mouseX = event.clientX - windowHalfX;
  mouseY = event.clientY - windowHalfY;
}
function onDocumentTouchStart( event ) {
  if ( event.touches.length > 1 ) {
    event.preventDefault();
    mouseX = event.touches[ 0 ].pageX - windowHalfX;
    mouseY = event.touches[ 0 ].pageY - windowHalfY;
  }
}
function onDocumentTouchMove( event ) {
  if ( event.touches.length == 1 ) {
    event.preventDefault();
    mouseX = event.touches[ 0 ].pageX - windowHalfX;
    mouseY = event.touches[ 0 ].pageY - windowHalfY;
  }
}
function animate() {
  requestAnimationFrame( animate );
  render();
}
function render() {
  camera.position.x += ( mouseX - camera.position.x ) * 0.002;
  camera.position.y += ( - mouseY - camera.position.y ) * 0.002;
  camera.lookAt( scene.position );
  renderer.render( scene, camera );
}