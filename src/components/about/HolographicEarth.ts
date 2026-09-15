import {
  MathUtils,
  Vector3,
  WebGLRenderer,
  Scene,
  OrthographicCamera,
  Group,
  AmbientLight,
  DirectionalLight,
  Mesh,
  SphereGeometry,
  MeshPhysicalMaterial,
  MeshBasicMaterial,
  Line,
  BufferGeometry,
  LineBasicMaterial,
  LineSegments,
  Points,
  PointsMaterial,
  ShaderMaterial,
  AdditiveBlending,
  Object3D,
} from 'three';
import coastlines from './earth-coastlines.json';
import landPoints from './earth-land-points.json';

// Public-domain Natural Earth 1:110m land coastlines, rounded to 0.01 degrees.
// https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_110m_land.geojson
const point = (lon: number, lat: number, radius = 1.035) => {
  const a = MathUtils.degToRad(lon), b = MathUtils.degToRad(lat);
  return new Vector3(radius * Math.cos(b) * Math.sin(a), radius * Math.sin(b), radius * Math.cos(b) * Math.cos(a));
};

export function createEarth(canvas: HTMLCanvasElement) {
  const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
  renderer.setClearColor(0x000000, 0);
  const scene = new Scene();
  const camera = new OrthographicCamera(-2.3, 2.3, 2.3, -2.3, .1, 30);
  camera.position.z = 8;
  const rig = new Group(); scene.add(rig);
  const earth = new Group(); rig.add(earth);
  earth.rotation.z = -.12;
  scene.add(new AmbientLight(0x883342, 1.2));
  const key = new DirectionalLight(0xff8c9d, 4); key.position.set(-3, 4, 3); scene.add(key);
  const fill = new DirectionalLight(0xc41438, 2); fill.position.set(3, -2, 1); scene.add(fill);
  earth.add(new Mesh(new SphereGeometry(1.025, 64, 48), new MeshPhysicalMaterial({color:0x100b13,metalness:.65,roughness:.25,clearcoat:1,clearcoatRoughness:.12})));
  const gridMat = new LineBasicMaterial({ color: 0x9c2940, transparent: true, opacity: 0.22 });
  const lines = (points: Vector3[], color: number, opacity: number, parent: Object3D = earth, sharedMat?: LineBasicMaterial) => {
    const line = new Line(new BufferGeometry().setFromPoints(points), sharedMat || new LineBasicMaterial({color,transparent:true,opacity})); parent.add(line); return line;
  };
  for (let lat = -75; lat <= 75; lat += 15) lines(Array.from({length:181},(_,i)=>point(i*2-180,lat)),0x9c2940,.22,earth,gridMat);
  for (let lon = -180; lon < 180; lon += 20) lines(Array.from({length:91},(_,i)=>point(lon,i*2-90)),0x9c2940,.22,earth,gridMat);
  const coastPoints: Vector3[] = [];
  const coastSegments: Vector3[] = [];
  coastlines.forEach((ring) => {
    ring.forEach(([lon,lat],i)=>{if(i)coastSegments.push(point(...ring[i-1] as [number,number],1.043),point(lon,lat,1.043));});
    ring.forEach(([lon,lat],i)=> {if(i%3===0) coastPoints.push(point(lon,lat,1.046));});
  });
  earth.add(new LineSegments(new BufferGeometry().setFromPoints(coastSegments),new LineBasicMaterial({color:0xf25a70,transparent:true,opacity:.8})));
  earth.add(new Points(new BufferGeometry().setFromPoints(landPoints.map(([lon,lat])=>point(lon,lat,1.04))),new PointsMaterial({color:0xd94560,size:.012,transparent:true,opacity:.55})));
  earth.add(new Points(new BufferGeometry().setFromPoints(coastPoints),new PointsMaterial({color:0xff647a,size:.012,transparent:true,opacity:.65,sizeAttenuation:true})));
  const cities = [[-74,40.7],[-118,34],[-46,-23],[-.1,51.5],[2.3,48.9],[13.4,52.5],[31,30],[3,6.5],[28,-26],[67,25],[77,28.6],[121,31],[139,35.7],[103,1.3],[151,-34]];
  earth.add(new Points(new BufferGeometry().setFromPoints(cities.map(([lon,lat])=>point(lon,lat,1.052))),new PointsMaterial({color:0xffb0bd,size:.033,transparent:true,opacity:.9})));
  const networks: Line[] = [];
  [[0,3],[3,9],[9,12],[6,8],[10,13]].forEach(([a,b])=>{
    const start=point(...cities[a] as [number,number]).normalize(),end=point(...cities[b] as [number,number]).normalize();
    networks.push(lines(Array.from({length:41},(_,i)=>start.clone().lerp(end,i/40).normalize().multiplyScalar(1.052+Math.sin(i/40*Math.PI)*.13)),0xf34060,.12));
  });
  // Fresnel shell: transparent center, restrained crimson rim, no post-processing.
  rig.add(new Mesh(new SphereGeometry(1.065,64,48),new ShaderMaterial({transparent:true,depthWrite:false,blending:AdditiveBlending,uniforms:{},vertexShader:'varying vec3 n; varying vec3 v; void main(){ vec4 p=modelViewMatrix*vec4(position,1.); n=normalize(normalMatrix*normal); v=normalize(-p.xyz); gl_Position=projectionMatrix*p; }',fragmentShader:'varying vec3 n; varying vec3 v; void main(){float rim=pow(1.-max(dot(normalize(n),normalize(v)),0.),3.); gl_FragColor=vec4(1.,.15,.29,rim*.52); }'})));
  const rings: Group[]=[];
  for(let i=0;i<3;i++) {
    const group=new Group(); rig.add(group); rings.push(group);
    group.rotation.set(.75+i*.48,.2+i*.6,-.45+i*.6);
    const radius=1.3+i*.13;
    lines(Array.from({length:181},(_,j)=>new Vector3(Math.cos(j*Math.PI/90)*radius,Math.sin(j*Math.PI/90)*radius,0)),0xed3453,.27,group);
    const node=new Mesh(new SphereGeometry(.024,12,8),new MeshBasicMaterial({color:0xff7085}));
    node.position.x=radius; group.add(node);
  }
  const platform=new Group();platform.position.y=-1.48;platform.rotation.x=1.23;rig.add(platform);
  [.5,.7,.91,1.12].forEach((r,i)=>lines(Array.from({length:161},(_,j)=>new Vector3(Math.cos(j*Math.PI/80)*r,Math.sin(j*Math.PI/80)*r,0)),0xd62c4d,i===1?.5:.17,platform));
  const ticks:Vector3[]=[];
  for(let i=0;i<72;i++){const a=i*Math.PI/36;[.96,i%6===0?1.07:1.01].forEach(r=>ticks.push(new Vector3(Math.cos(a)*r,Math.sin(a)*r,0)));}
  platform.add(new LineSegments(new BufferGeometry().setFromPoints(ticks),new LineBasicMaterial({color:0xed4962,transparent:true,opacity:.22})));
  return {
    resize(size:number,mobile:boolean){renderer.setPixelRatio(Math.min(devicePixelRatio,mobile?1.5:2));renderer.setSize(size,size,false);},
    render(time:number,x:number,y:number){
      earth.rotation.y=-.3+time*.055;
      rig.rotation.x=y; rig.rotation.y=x;
      rings.forEach((r,i)=>{r.rotation.z=(-.45+i*.6)+time*(i%2?-.022:.018);const node=r.children[1];const a=time*(.18+i*.03);node.position.set(Math.cos(a)*(1.3+i*.13),Math.sin(a)*(1.3+i*.13),0);});
      networks.forEach((line,i)=>(line.material as LineBasicMaterial).opacity=.035+Math.pow((Math.sin(time*.3+i*1.8)+1)/2,4)*.16);
      platform.rotation.z=time*.035;
      renderer.render(scene,camera);
    },
    dispose(){scene.traverse(o=>{const mesh=o as Mesh;if(mesh.geometry)mesh.geometry.dispose();if(mesh.material)(Array.isArray(mesh.material)?mesh.material:[mesh.material]).forEach(m=>m.dispose());});renderer.dispose();}
  };
}
