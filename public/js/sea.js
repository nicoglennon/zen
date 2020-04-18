
var container;
var camera, scene, renderer, light;
var controls, water, sphere;
var mouseX = 0, mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
init();
animate();
function init() {
  container = document.createElement( 'zen' );
  document.body.appendChild( container );
  //
  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  container.appendChild( renderer.domElement );
  //
  scene = new THREE.Scene();
  //
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
  camera.position.z = 40;
  camera.position.x = 0;
  camera.position.y = 300;
  
  //
  light = new THREE.DirectionalLight( 0xffffff, 0.8 );
  scene.add( light );
  // Water
  var waterGeometry = new THREE.PlaneBufferGeometry( 20000, 20000 );
  water = new THREE.Water(
    waterGeometry,
    {
      textureWidth: 512,
      textureHeight: 512,
      waterNormals: new THREE.TextureLoader().load( 'https://cdn.glitch.com/a639612e-6854-4f12-bc78-fd8f0d99cf8c%2Fwaternormals.jpg?1535600380936', function ( texture ) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      }),
      alpha: 1.0,
      sunDirection: light.position.clone().normalize(),
      sunColor: 0xffffff,
      waterColor: 0x001e0f,
      distortionScale:  8,
      fog: scene.fog !== undefined
    }
  );
  water.rotation.x = - Math.PI / 2;
  scene.add( water );
  // Skybox
  var sky = new THREE.Sky();
  sky.scale.setScalar( 10000 );
  scene.add( sky );
  var uniforms = sky.material.uniforms;
  uniforms.turbidity.value = 10;
  uniforms.rayleigh.value = 2;
  uniforms.luminance.value = 1;
  uniforms.mieCoefficient.value = 0.005;
  uniforms.mieDirectionalG.value = 0.8;
  var parameters = {
    distance: 400,
    inclination: 0.43,
    azimuth: 0.205
  };
  var cubeCamera = new THREE.CubeCamera( 1, 20000, 256 );
  cubeCamera.renderTarget.texture.minFilter = THREE.LinearMipMapLinearFilter;
  function updateSun() {
    var theta = Math.PI * ( parameters.inclination - 0.5 );
    var phi = 2 * Math.PI * ( parameters.azimuth - 0.5 );
    light.position.x = 0;
    light.position.y = parameters.distance * Math.sin( phi ) * Math.sin( theta );
    light.position.z = parameters.distance * Math.sin( phi ) * Math.cos( theta );
    sky.material.uniforms.sunPosition.value = light.position.copy( light.position );
    water.material.uniforms.sunDirection.value.copy( light.position ).normalize();
    cubeCamera.update( renderer, scene );
  }
  updateSun();
  //
  var geometry = new THREE.IcosahedronBufferGeometry( 20, 1 );
  var count = geometry.attributes.position.count;
  var colors = [];
  var color = new THREE.Color();
  for ( var i = 0; i < count; i += 3 ) {
    color.setHex( Math.random() * 0xffffff );
    colors.push( color.r, color.g, color.b );
    colors.push( color.r, color.g, color.b );
    colors.push( color.r, color.g, color.b );
  }
  geometry.addAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
  var material = new THREE.MeshStandardMaterial( {
    vertexColors: THREE.VertexColors,
    roughness: 0.0,
    flatShading: true,
    envMap: cubeCamera.renderTarget.texture,
    side: THREE.DoubleSide
  } );
  
  window.addEventListener( 'resize', onWindowResize, false );
  document.addEventListener( 'mousemove', onDocumentMouseMove, false );
  document.addEventListener( 'touchstart', onDocumentTouchStart, false );
  document.addEventListener( 'touchmove', onDocumentTouchMove, false );
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
  water.material.uniforms.time.value += 1.0 / 60.0;
  camera.position.x += ( mouseX - camera.position.x ) * 0.004;
  camera.position.y += ( (- mouseY/3) + (windowHalfY/3) - camera.position.y ) * 0.004;
  camera.lookAt( light.position );
  renderer.render( scene, camera );
}