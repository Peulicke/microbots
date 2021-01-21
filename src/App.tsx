import React, { FC, useEffect, useRef, useState } from "react";
import { Vector3, PerspectiveCamera, WebGLRenderer, Scene, Color } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Grid, Paper, makeStyles, List, ListItem } from "@material-ui/core";
import { useWindowSize } from "@react-hook/window-size";
import { pipe } from "ts-pipe-compose";
import { Bot, World } from "./core";
import { newScene, addSphere } from "./draw";

const useStyles = makeStyles(theme => ({
    gridItem: {
        padding: theme.spacing(2),
        textAlign: "center"
    }
}));

const randomBot = () =>
    Bot.setPos(new Vector3(...[Math.random(), Math.random(), Math.random()].map(x => x * 3)))(Bot.newBot());

const bot1 = Bot.setFixed(true)(Bot.newBot());
const bot2 = Bot.setFixed(true)(Bot.setPos(new Vector3(5, 0, 0))(Bot.newBot()));
const bot3 = Bot.setFixed(true)(Bot.setPos(new Vector3(0, 0, 2))(Bot.newBot()));
const bots = [
    bot1,
    bot2,
    bot3,
    randomBot(),
    randomBot(),
    randomBot(),
    randomBot(),
    randomBot(),
    randomBot(),
    randomBot()
];
let world = pipe(World.newWorld(), World.setBots(bots), World.initEdges);

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
        if (renderer && scene && camera) renderer.render(scene, camera);
        if (iterations >= 100) return;
        setIterations(iterations + 1);
        setScene(
            world.bots
                .map(bot => addSphere(bot.pos, bot.fixed ? new Color(0, 0, 1) : new Color(0, 1, 0)))
                .reduce((x, fn) => fn(x), newScene())
        );
        world = World.optimizeStep(0.1)(0.9)(world);
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
