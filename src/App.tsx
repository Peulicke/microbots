import React, { FC, useEffect, useRef, useState } from "react";
import {
    Vector3,
    PerspectiveCamera,
    WebGLRenderer,
    Scene,
    AmbientLight,
    DirectionalLight,
    Matrix4,
    SphereGeometry,
    Color,
    BufferGeometry,
    Mesh,
    MeshToonMaterial
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Grid, Paper, makeStyles, List, ListItem } from "@material-ui/core";
import { useWindowSize } from "@react-hook/window-size";
import { pipe } from "ts-pipe-compose";
import { matrix } from "mathjs";
import { Bot, World } from "./core";

const useStyles = makeStyles(theme => ({
    gridItem: {
        padding: theme.spacing(2),
        textAlign: "center"
    }
}));

const bot1 = Bot.setFixed(true)(Bot.newBot());
const bot2 = Bot.setFixed(true)(Bot.setPos(matrix([1, 0, 0]))(Bot.newBot()));
const bot3 = Bot.setFixed(true)(Bot.setPos(matrix([0, 0, 1]))(Bot.newBot()));
const bot4 = Bot.setPos(matrix([0, 1, 0]))(Bot.newBot());
const bots = [bot1, bot2, bot3, bot4];
const world = pipe(World.newWorld(), World.setBots(bots), World.initEdges);

World.optimize(world);

const App: FC = () => {
    const [windowWidth, windowHeight] = useWindowSize();
    const width = windowWidth * 0.55;
    const height = windowHeight * 0.9;
    const fov = 75;
    const classes = useStyles();
    const mount = useRef<HTMLDivElement>(null);
    const [controls, setControls] = useState<OrbitControls>();
    const [scene, setScene] = useState<Scene>();
    const [camera, setCamera] = useState<PerspectiveCamera>();
    const [renderer, setRenderer] = useState<WebGLRenderer>();
    const [frame, setFrame] = useState(0);

    useEffect(() => {
        const mc = mount.current;
        if (!mc) return;
        // Camera
        const cam = new PerspectiveCamera(fov, width / height, 0.1, 1000);
        cam.position.set(50, 50, 50);
        cam.lookAt(0, 0, 0);
        setCamera(cam);
        // Renderer
        const ren = new WebGLRenderer({ antialias: true });
        ren.setClearColor("#000000");
        ren.setSize(width, height);
        mc.appendChild(ren.domElement);
        setRenderer(ren);
        // Controls
        const ctrls = new OrbitControls(cam, ren.domElement);
        ctrls.enableDamping = true;
        ctrls.dampingFactor = 0.5;
        setControls(ctrls);

        const scn = new Scene();
        scn.add(new AmbientLight(0xffffff, 0.4));
        const light = new DirectionalLight(0xffffff, 0.4);
        light.position.set(0, 1, 0);
        scn.add(light);

        const mat = new Matrix4().setPosition(new Vector3(0, 0, 0));
        const geom = new SphereGeometry(1, 16, 16).applyMatrix4(mat);
        geom.computeVertexNormals();
        const color = new Color(0, 1, 0);
        geom.faces.forEach(face => (face.vertexColors = new Array(3).fill(true).map(() => color)));
        const bg = new BufferGeometry().fromGeometry(geom);
        delete bg.attributes.uv;
        const mesh = new Mesh(bg, new MeshToonMaterial({ color: color }));
        mesh.geometry = bg;
        mesh.matrixAutoUpdate = false;
        mesh.matrix = mat;
        mesh.updateMatrix();
        scn.add(mesh);
        setScene(scn);

        // Animate
        const t = window.setInterval(() => setFrame(frame => frame + 1), 1000 / 30);
        return () => {
            window.clearInterval(t);
            mc.removeChild(ren.domElement);
        };
    }, [mount, width, height]);

    useEffect(() => {
        if (controls) controls.update();
        if (renderer && scene && camera) renderer.render(scene, camera);
    }, [controls, renderer, scene, camera, frame]);

    return (
        <>
            <Grid container item xs={11}>
                <Grid
                    item
                    xs={4}
                    style={{ height: window.innerHeight * 0.9, overflowX: "hidden", overflowY: "scroll" }}>
                    <Grid container direction="column">
                        <Grid item className={classes.gridItem}>
                            <Paper>
                                <List>
                                    <ListItem>
                                        <b>Microbots</b>
                                    </ListItem>
                                </List>
                            </Paper>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={5}>
                    <div ref={mount} />
                </Grid>
            </Grid>
        </>
    );
};

export default App;
