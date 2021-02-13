import {
    Vector3,
    Scene,
    AmbientLight,
    DirectionalLight,
    Matrix4,
    SphereGeometry,
    Color,
    BufferGeometry,
    Mesh,
    MeshPhongMaterial,
    CylinderGeometry,
    Object3D
} from "three";
import * as Vec3 from "./core/Vec3";

export const newScene = (): Scene => {
    const scene = new Scene();
    scene.add(new AmbientLight(0xffffff, 0.4));
    const light = new DirectionalLight(0xffffff, 0.4);
    light.position.set(0, 1, 0);
    scene.add(light);
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
    return mesh;
};

export const updateCylinder = (from: Vec3.Vec3, to: Vec3.Vec3, radius: number) => (cylinder: Mesh): Mesh => {
    const orientation = new Matrix4();
    orientation.lookAt(new Vector3(...from), new Vector3(...to), new Object3D().up);
    orientation.multiply(new Matrix4().set(1, 0, 0, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, 0, 0, 1));
    cylinder.setRotationFromMatrix(orientation);
    cylinder.scale.set(radius, Vec3.length(Vec3.sub(to, from)), radius);
    const pos = Vec3.divideScalar(Vec3.add(from, to), 2);
    cylinder.position.set(pos[0], pos[1], pos[2]);
    return cylinder;
};

export const newCylinder = (from: Vec3.Vec3, to: Vec3.Vec3, radius: number, color: Color): Mesh => {
    const edgeGeometry = new CylinderGeometry(1, 1, 1, 8, 1);
    const cylinder = new Mesh(edgeGeometry, new MeshPhongMaterial({ color: color }));
    return updateCylinder(from, to, radius)(cylinder);
};
