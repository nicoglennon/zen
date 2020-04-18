var SEPARATION = 80;
var AMOUNTX = 70;
var AMOUNTY = 70;
var container, stats;
var camera, scene, renderer, particle;
var mouseX = 0, mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var drops = [];
init();
animate();

function init() {

  // rain js
  container = document.createElement( 'zen' );
  document.body.appendChild( container );

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
  camera.position.z = 1000;

  var material = new THREE.SpriteMaterial({ color: 'white'});
  for ( var ix = 0; ix < AMOUNTX; ix++ ) {
    for ( var iy = 0; iy < AMOUNTY; iy++ ) {
      var drop = new THREE.Sprite( material );
      drop.scale.y = 100;
      drop.scale.x = 3;
      
      var rand = Math.random();
      drop.position.x = ix * SEPARATION - ( ( AMOUNTX * SEPARATION ) / 2 );
      drop.position.z = iy * SEPARATION - ( ( AMOUNTY * SEPARATION ) / 2 );
      drop.position.y = 300 + (rand * 5000);
      scene.add( drop );
      drops.push( drop );
    }
  }

  renderer = new THREE.WebGLRenderer({alpha: true });
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  container.appendChild( renderer.domElement );
  document.addEventListener( 'mousemove', onDocumentMouseMove, false );
  document.addEventListener( 'touchstart', onDocumentTouchStart, false );
  document.addEventListener( 'touchmove', onDocumentTouchMove, false );
  window.addEventListener( 'resize', onWindowResize, false );
  
}
function onWindowResize() {
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}
//
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
//
function animate() {
  requestAnimationFrame( animate );
  render();
}
function render() {
  for ( var i = 0, il = drops.length; i < il; i ++ ) {
    var drop = drops[ i ];
    drop.position.y -= 1;
  }

  camera.position.x += ( mouseX - camera.position.x ) * 0.02;
  camera.position.y += ( - mouseY - camera.position.y ) * 0.02;
  camera.lookAt( scene.position );
  renderer.render( scene, camera );
}