import React, { FC, useEffect, useRef, useState } from "react";
import { Vector3, PerspectiveCamera, WebGLRenderer, Color } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Grid, Paper, makeStyles, List, ListItem } from "@material-ui/core";
import { useWindowSize } from "@react-hook/window-size";
import { pipe } from "ts-pipe-compose";
import Prando from "prando";
const rng = new Prando(123);
import { Bot, World } from "./core";
import { newScene, newSphere, newCylinder, updateCylinder } from "./draw";

const useStyles = makeStyles(theme => ({
    gridItem: {
        padding: theme.spacing(2),
        textAlign: "center"
    }
}));

const randomBot = () => Bot.setPos(new Vector3(...[rng.next(), rng.next(), rng.next()].map(x => x * 10)))(Bot.newBot());

const bot1 = Bot.setFixed(true)(Bot.newBot());
const bot2 = Bot.setFixed(true)(Bot.setPos(new Vector3(3, 0, 0))(Bot.newBot()));
const bot3 = Bot.setFixed(true)(Bot.setPos(new Vector3(0, 0, 2))(Bot.newBot()));
const bots = [bot1, bot2, bot3, ...[...Array(47)].map(randomBot)];
let world = pipe(World.newWorld(), World.setBots(bots), World.initEdges);

const botMeshes = bots.map(bot => newSphere(bot.pos, bot.fixed ? new Color(0, 0, 1) : new Color(0, 1, 0)));
const edgeMeshes = bots.map(a => bots.map(b => newCylinder(a.pos, b.pos, 1, new Color(1, 0, 0))));
const scene = newScene();
botMeshes.map(mesh => scene.add(mesh));
edgeMeshes.map((row, i) =>
    row.map((mesh, j) => {
        if (i >= j) return;
        scene.add(mesh);
    })
);

const App: FC = () => {
    const [windowWidth, windowHeight] = useWindowSize();
    const width = windowWidth * 0.55;
    const height = windowHeight * 0.9;
    const fov = 75;
    const classes = useStyles();
    const mount = useRef<HTMLDivElement>(null);
    const [controls, setControls] = useState<OrbitControls>();
    const [camera, setCamera] = useState<PerspectiveCamera>();
    const [renderer, setRenderer] = useState<WebGLRenderer>();
    const [frame, setFrame] = useState(0);
    const [iterations, setIterations] = useState(0);

    useEffect(() => {
        const mc = mount.current;
        if (!mc) return;
        // Camera
        const cam = new PerspectiveCamera(fov, width / height, 0.1, 1000);
        cam.position.set(10, 10, 10);
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
        // Animate
        const t = window.setInterval(() => setFrame(frame => frame + 1), 1000 / 30);
        return () => {
            window.clearInterval(t);
            mc.removeChild(ren.domElement);
        };
    }, [mount, width, height]);

    useEffect(() => {
        if (controls) controls.update();
        if (renderer && camera) renderer.render(scene, camera);
    }, [controls, renderer, camera, frame]);

    useEffect(() => {
        if (iterations >= 30) return;
        const t = setTimeout(() => {
            setIterations(iterations + 1);
            world.bots.map((bot, i) => {
                botMeshes[i].position.set(...bot.pos.toArray());
            });
            world.bots.map((from, i) =>
                world.bots.map((to, j) => {
                    if (i >= j) return;
                    scene.remove(edgeMeshes[i][j]);
                    if (world.edges[i][j] < 0.01) return;
                    scene.add(edgeMeshes[i][j]);
                    updateCylinder(from.pos, to.pos, Math.sqrt(world.edges[i][j]) * 0.3)(edgeMeshes[i][j]);
                })
            );
            world = World.optimizeStepNumerical(0.5)(world);
        }, 10);
        return () => clearTimeout(t);
    }, [controls, renderer, camera, iterations]);

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
                                    <ListItem>
                                        <b>iterations: </b>
                                        {iterations}
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
