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

export const newScene = (): Scene => {
    const scene = new Scene();
    scene.add(new AmbientLight(0xffffff, 0.4));
    const light = new DirectionalLight(0xffffff, 0.4);
    light.position.set(0, 1, 0);
    scene.add(light);
    return scene;
};

export const addSphere = (pos: Vector3, color: Color) => (scene: Scene): Scene => {
    const mat = new Matrix4().setPosition(pos).scale(new Vector3(0.5, 0.5, 0.5));
    const geom = new SphereGeometry(1, 16, 16).applyMatrix4(mat);
    geom.computeVertexNormals();
    geom.faces.forEach(face => (face.vertexColors = new Array(3).fill(true).map(() => color)));
    const bg = new BufferGeometry().fromGeometry(geom);
    delete bg.attributes.uv;
    const mesh = new Mesh(bg, new MeshPhongMaterial({ color: color }));
    mesh.geometry = bg;
    mesh.matrixAutoUpdate = false;
    mesh.matrix = mat;
    mesh.updateMatrix();
    scene.add(mesh);
    return scene;
};

export const addCylinder = (from: Vector3, to: Vector3, radius: number, color: Color) => (scene: Scene): Scene => {
    const direction = new Vector3().subVectors(to, from);
    const orientation = new Matrix4();
    orientation.lookAt(from, to, new Object3D().up);
    orientation.multiply(new Matrix4().set(1, 0, 0, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, 0, 0, 1));
    const edgeGeometry = new CylinderGeometry(radius, radius, direction.length(), 8, 1);
    const edge = new Mesh(edgeGeometry, new MeshPhongMaterial({ color: color }));
    edge.applyMatrix4(orientation);
    edge.position.x = (to.x + from.x) / 2;
    edge.position.y = (to.y + from.y) / 2;
    edge.position.z = (to.z + from.z) / 2;
    scene.add(edge);
    return scene;
};
