import * as THREE from 'three';
import coastlines from './earth-coastlines.json';
import landPoints from './earth-land-points.json';

// Public-domain Natural Earth 1:110m land coastlines, rounded to 0.01 degrees.
// https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_110m_land.geojson
const point = (lon: number, lat: number, radius = 1.035) => {
  const a = THREE.MathUtils.degToRad(lon), b = THREE.MathUtils.degToRad(lat);
  return new THREE.Vector3(radius * Math.cos(b) * Math.sin(a), radius * Math.sin(b), radius * Math.cos(b) * Math.cos(a));
};

export function createEarth(canvas: HTMLCanvasElement) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
  renderer.setClearColor(0x000000, 0);
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-2.3, 2.3, 2.3, -2.3, .1, 30);
  camera.position.z = 8;
  const rig = new THREE.Group(); scene.add(rig);
  const earth = new THREE.Group(); rig.add(earth);
  earth.rotation.z = -.12;
  scene.add(new THREE.AmbientLight(0x883342, 1.2));
  const key = new THREE.DirectionalLight(0xff8c9d, 4); key.position.set(-3, 4, 3); scene.add(key);
  const fill = new THREE.DirectionalLight(0xc41438, 2); fill.position.set(3, -2, 1); scene.add(fill);
  earth.add(new THREE.Mesh(new THREE.SphereGeometry(1.025, 64, 48), new THREE.MeshPhysicalMaterial({color:0x100b13,metalness:.65,roughness:.25,clearcoat:1,clearcoatRoughness:.12})));
  
  // Batch latitude and longitude grid lines into a single LineSegments draw call
  const gridSegments: THREE.Vector3[] = [];
  for (let lat = -75; lat <= 75; lat += 15) {
    let prev = point(-180, lat);
    for (let i = 1; i <= 180; i++) {
      const curr = point(i * 2 - 180, lat);
      gridSegments.push(prev, curr);
      prev = curr;
    }
  }
  for (let lon = -180; lon < 180; lon += 20) {
    let prev = point(lon, -90);
    for (let i = 1; i <= 90; i++) {
      const curr = point(lon, i * 2 - 90);
      gridSegments.push(prev, curr);
      prev = curr;
    }
  }
  earth.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(gridSegments), new THREE.LineBasicMaterial({color:0x9c2940,transparent:true,opacity:.22})));

  const coastPoints: THREE.Vector3[] = [];
  const coastSegments: THREE.Vector3[] = [];
  coastlines.forEach((ring) => {
    ring.forEach(([lon,lat],i)=>{if(i)coastSegments.push(point(...ring[i-1] as [number,number],1.043),point(lon,lat,1.043));});
    ring.forEach(([lon,lat],i)=> {if(i%3===0) coastPoints.push(point(lon,lat,1.046));});
  });
  earth.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(coastSegments),new THREE.LineBasicMaterial({color:0xf25a70,transparent:true,opacity:.8})));
  earth.add(new THREE.Points(new THREE.BufferGeometry().setFromPoints(landPoints.map(([lon,lat])=>point(lon,lat,1.04))),new THREE.PointsMaterial({color:0xd94560,size:.012,transparent:true,opacity:.55})));
  earth.add(new THREE.Points(new THREE.BufferGeometry().setFromPoints(coastPoints),new THREE.PointsMaterial({color:0xff647a,size:.012,transparent:true,opacity:.65,sizeAttenuation:true})));
  const cities = [[-74,40.7],[-118,34],[-46,-23],[-.1,51.5],[2.3,48.9],[13.4,52.5],[31,30],[3,6.5],[28,-26],[67,25],[77,28.6],[121,31],[139,35.7],[103,1.3],[151,-34]];
  earth.add(new THREE.Points(new THREE.BufferGeometry().setFromPoints(cities.map(([lon,lat])=>point(lon,lat,1.052))),new THREE.PointsMaterial({color:0xffb0bd,size:.033,transparent:true,opacity:.9})));
  const networks: THREE.Line[] = [];
  const netMaterials: THREE.LineBasicMaterial[] = [];
  [[0,3],[3,9],[9,12],[6,8],[10,13]].forEach(([a,b])=>{
    const start=point(...cities[a] as [number,number]).normalize(),end=point(...cities[b] as [number,number]).normalize();
    const mat = new THREE.LineBasicMaterial({color:0xf34060,transparent:true,opacity:.12});
    netMaterials.push(mat);
    const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(Array.from({length:41},(_,i)=>start.clone().lerp(end,i/40).normalize().multiplyScalar(1.052+Math.sin(i/40*Math.PI)*.13))), mat);
    earth.add(line);
    networks.push(line);
  });
  // Disable matrixAutoUpdate on static children of earth
  earth.traverse(child => {
    if (child !== earth) {
      child.matrixAutoUpdate = false;
      child.updateMatrix();
    }
  });

  // Fresnel shell: transparent center, restrained crimson rim, no post-processing.
  rig.add(new THREE.Mesh(new THREE.SphereGeometry(1.065,64,48),new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,uniforms:{},vertexShader:'varying vec3 n; varying vec3 v; void main(){ vec4 p=modelViewMatrix*vec4(position,1.); n=normalize(normalMatrix*normal); v=normalize(-p.xyz); gl_Position=projectionMatrix*p; }',fragmentShader:'varying vec3 n; varying vec3 v; void main(){float rim=pow(1.-max(dot(normalize(n),normalize(v)),0.),3.); gl_FragColor=vec4(1.,.15,.29,rim*.52); }'})));
  
  const rings: THREE.Group[]=[];
  const ringNodes: THREE.Mesh[] = [];
  const ringRadii = [1.3, 1.43, 1.56];
  const ringLineMat = new THREE.LineBasicMaterial({color:0xed3453,transparent:true,opacity:.27});
  const nodeGeom = new THREE.SphereGeometry(.024,12,8);
  const nodeMat = new THREE.MeshBasicMaterial({color:0xff7085});
  for(let i=0;i<3;i++) {
    const group=new THREE.Group(); rig.add(group); rings.push(group);
    group.rotation.set(.75+i*.48,.2+i*.6,-.45+i*.6);
    const radius=ringRadii[i];
    const ringLine = new THREE.Line(new THREE.BufferGeometry().setFromPoints(Array.from({length:181},(_,j)=>new THREE.Vector3(Math.cos(j*Math.PI/90)*radius,Math.sin(j*Math.PI/90)*radius,0))), ringLineMat);
    ringLine.matrixAutoUpdate = false;
    ringLine.updateMatrix();
    group.add(ringLine);
    const node=new THREE.Mesh(nodeGeom, nodeMat);
    node.position.x=radius; group.add(node);
    ringNodes.push(node);
  }
  
  const platform=new THREE.Group();platform.position.y=-1.48;platform.rotation.x=1.23;rig.add(platform);
  const platLineSegments: THREE.Vector3[] = [];
  [.5,.7,.91,1.12].forEach((r)=>{
    let prev = new THREE.Vector3(r, 0, 0);
    for (let j = 1; j <= 160; j++) {
      const a = j * Math.PI / 80;
      const curr = new THREE.Vector3(Math.cos(a) * r, Math.sin(a) * r, 0);
      platLineSegments.push(prev, curr);
      prev = curr;
    }
  });
  platform.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(platLineSegments), new THREE.LineBasicMaterial({color:0xd62c4d,transparent:true,opacity:.22})));
  
  const ticks:THREE.Vector3[]=[];
  for(let i=0;i<72;i++){const a=i*Math.PI/36;[.96,i%6===0?1.07:1.01].forEach(r=>ticks.push(new THREE.Vector3(Math.cos(a)*r,Math.sin(a)*r,0)));}
  platform.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(ticks),new THREE.LineBasicMaterial({color:0xed4962,transparent:true,opacity:.22})));
  platform.traverse(child => {
    if (child !== platform) {
      child.matrixAutoUpdate = false;
      child.updateMatrix();
    }
  });

  return {
    resize(size:number,mobile:boolean){renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1,mobile?1.5:2));renderer.setSize(size,size,false);},
    render(time:number,x:number,y:number){
      earth.rotation.y=-.3+time*.055;
      rig.rotation.x=y; rig.rotation.y=x;
      for (let i = 0; i < 3; i++) {
        const r = rings[i];
        r.rotation.z=(-.45+i*.6)+time*(i%2?-.022:.018);
        const rad = ringRadii[i];
        const a=time*(.18+i*.03);
        ringNodes[i].position.set(Math.cos(a)*rad,Math.sin(a)*rad,0);
      }
      for (let i = 0; i < 5; i++) {
        netMaterials[i].opacity=.035+Math.pow((Math.sin(time*.3+i*1.8)+1)*.5,4)*.16;
      }
      platform.rotation.z=time*.035;
      renderer.render(scene,camera);
    },
    dispose(){scene.traverse(o=>{const mesh=o as THREE.Mesh;if(mesh.geometry)mesh.geometry.dispose();if(mesh.material)(Array.isArray(mesh.material)?mesh.material:[mesh.material]).forEach(m=>m.dispose());});renderer.dispose();}
  };
}
