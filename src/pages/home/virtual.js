import Stats from 'stats-js';
import Orbitcontrols from 'three-orbitcontrols';

import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
var THREE = (window.THREE = require('three'));

export class VirtualDrive {
  constructor(container) {
    this.init(container);
  }

  //场景
  scene;
  group;
  //状态器
  stats;
  loader;

  init(container) {
    const conWidth = container.clientWidth;
    const conHeight = container.clientHeight;
    //状态器
    this.stats = new Stats();
    container.appendChild(this.stats.dom);
    //渲染器
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(conWidth, conHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    //相机
    const camera = new THREE.PerspectiveCamera(45, conWidth / conHeight, 1, 10000);
    camera.position.z = 200; //控制相机在整个3D环境中的位置
    camera.lookAt(0, 0, 0); //控制相机的焦点位置

    // 场景
    this.scene = new THREE.Scene();

    this.group = new THREE.Group();
    this.group.rotation.x = -Math.PI / 2;
    this.scene.add(this.group);

    //角度控制
    const control = new Orbitcontrols(camera, renderer.domElement);
    control.target = new THREE.Vector3(0, 0, 0); // 控制焦点
    control.autoRotate = false;
    control.screenSpacePanning = true;
    control.zoomSpeed = 3;

    //载入3D模型及材质
    this.load3dObj();

    //渲染器自动渲染，每个可用帧都会调用的函数
    renderer.setAnimationLoop(() => {
      control.update();
      this.stats.update();
      renderer.render(this.scene, camera);
    });
  }

  // 需要天空盒支持，否则纹理不明显
  // material = new THREE.MeshPhongMaterial({
  //   side: THREE.DoubleSide,
  //   specular: 0x111111,
  //   shininess: 200,
  // });

  material = new THREE.MeshNormalMaterial();

  //加载3D模型
  load3dObj() {
    this.loader = new STLLoader();

    [
      { file: 'artery', color: 0x811b1b },
      { file: 'bone', color: 0x938c72 },
      { file: 'bone edma', color: 0x209916 },
      { file: 'nerve', color: 0xc8971e },
      { file: 'rectum', color: 0xa045a0 },
      { file: 'tumor', color: 0x5a783a },
      { file: 'ureter', color: 0x916663 },
      { file: 'urinary bladder', color: 0xe18a95 },
      { file: 'uterus', color: 0x6868b4 },
      { file: 'vein', color: 0x144e85 },
    ].forEach(item => {
      this.load(item);
    });
  }

  load(stl) {
    //STL文件加载器 加载所有的.stl文件，每个stl对应一个模型模块
    this.loader.load(
      require('assets/' + stl.file + '.stl'),
      geometry => {
        // let _material = this.material.clone().setValues({ color: stl.color });
        const mesh = new THREE.Mesh(geometry, this.material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        this.group.add(mesh);
      },
      null,
      function(xhr) {
        console.error(xhr);
      },
    );
  }
}

export default VirtualDrive;
