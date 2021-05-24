import * as Vec3 from "../core/Vec3";

import {
    AmbientLight,
    BufferGeometry,
    Color,
    DirectionalLight,
    Mesh,
    MeshPhongMaterial,
    PlaneBufferGeometry,
    RepeatWrapping,
    Scene,
    SphereGeometry,
    TextureLoader
} from "three";

import grass from "../assets/grass.jpg";

export const newScene = (): Scene => {
    const scene = new Scene();

    const geo = new PlaneBufferGeometry(2000, 2000, 8, 8);
    const textureGrass = new TextureLoader().load(grass);
    textureGrass.wrapS = RepeatWrapping;
    textureGrass.wrapT = RepeatWrapping;
    textureGrass.repeat.set(100, 100);
    const mat = new MeshPhongMaterial({ map: textureGrass });
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

    return scene;
};

export const newSphere = (pos: Vec3.Vec3, color: Color): Mesh => {
    const geom = new SphereGeometry(1, 16, 16);
    geom.computeVertexNormals();
    geom.faces.forEach(face => (face.vertexColors = new Array(3).fill(true).map(() => color)));
    const bg = new BufferGeometry().fromGeometry(geom);
    delete bg.attributes.uv;
    const mesh = new Mesh(bg, new MeshPhongMaterial({ color }));
    mesh.geometry = bg;
    mesh.position.set(...pos);
    mesh.scale.set(0.5, 0.5, 0.5);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
};
