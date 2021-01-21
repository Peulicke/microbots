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
    MeshPhongMaterial
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
