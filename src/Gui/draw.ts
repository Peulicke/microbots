import {
    Scene,
    AmbientLight,
    DirectionalLight,
    SphereGeometry,
    Color,
    BufferGeometry,
    Mesh,
    MeshPhongMaterial,
    TextureLoader,
    MeshBasicMaterial,
    BackSide,
    BoxGeometry,
    PlaneBufferGeometry,
    RepeatWrapping
} from "three";
import * as Vec3 from "../core/Vec3";

import px from "../assets/skyboxes/px.png";
import nx from "../assets/skyboxes/nx.png";
import py from "../assets/skyboxes/py.png";
import ny from "../assets/skyboxes/ny.png";
import pz from "../assets/skyboxes/pz.png";
import nz from "../assets/skyboxes/nz.png";
import grass from "../assets/grass.jpg";

export const newScene = (): Scene => {
    const scene = new Scene();

    const geo = new PlaneBufferGeometry(2000, 2000, 8, 8);
    const texture_grass = new TextureLoader().load(grass);
    texture_grass.wrapS = RepeatWrapping;
    texture_grass.wrapT = RepeatWrapping;
    texture_grass.repeat.set(100, 100);
    const mat = new MeshPhongMaterial({ map: texture_grass });
    const plane = new Mesh(geo, mat);
    plane.rotateX(-Math.PI / 2);
    plane.castShadow = false;
    plane.receiveShadow = true;
    scene.add(plane);

    scene.add(new AmbientLight(0xffffff, 0.4));
    const light = new DirectionalLight(0xffffff, 0.4);
    light.position.set(10, 50, 10);
    light.castShadow = true;
    light.shadowCameraRight = 50;
    light.shadowCameraLeft = -50;
    light.shadowCameraTop = 50;
    light.shadowCameraBottom = -50;
    light.shadowMapWidth = 1024;
    light.shadowMapHeight = 1024;
    scene.add(light);

    const materialArray = [];
    const texture_px = new TextureLoader().load(px);
    const texture_nx = new TextureLoader().load(nx);
    const texture_py = new TextureLoader().load(py);
    const texture_ny = new TextureLoader().load(ny);
    const texture_pz = new TextureLoader().load(pz);
    const texture_nz = new TextureLoader().load(nz);

    materialArray.push(new MeshBasicMaterial({ map: texture_px, fog: false }));
    materialArray.push(new MeshBasicMaterial({ map: texture_nx, fog: false }));
    materialArray.push(new MeshBasicMaterial({ map: texture_py, fog: false }));
    materialArray.push(new MeshBasicMaterial({ map: texture_ny, fog: false }));
    materialArray.push(new MeshBasicMaterial({ map: texture_pz, fog: false }));
    materialArray.push(new MeshBasicMaterial({ map: texture_nz, fog: false }));

    for (let i = 0; i < 6; i++) materialArray[i].side = BackSide;
    const skyboxGeo = new BoxGeometry(1000, 1000, 1000);
    const skybox = new Mesh(skyboxGeo, materialArray);
    scene.add(skybox);

    return scene;
};

export const newSphere = (pos: Vec3.Vec3, color: Color): Mesh => {
    const geom = new SphereGeometry(1, 16, 16);
    geom.computeVertexNormals();
    geom.faces.forEach(face => (face.vertexColors = new Array(3).fill(true).map(() => color)));
    const bg = new BufferGeometry().fromGeometry(geom);
    delete bg.attributes.uv;
    const mesh = new Mesh(bg, new MeshPhongMaterial({ color: color }));
    mesh.geometry = bg;
    mesh.position.set(...pos);
    mesh.scale.set(0.5, 0.5, 0.5);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
};
