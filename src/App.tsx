import React, { FC, useEffect, useRef, useState } from "react";
import { PerspectiveCamera, WebGLRenderer, Color, Mesh } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Grid, Paper, makeStyles, List, ListItem, Button } from "@material-ui/core";
import { useWindowSize } from "@react-hook/window-size";
import { Vec3, World, Animation } from "./core";
import { newScene, newSphere, newCylinder, updateCylinder } from "./draw";
import Prando from "prando";
import loadExample, { examples } from "./examples";

const useStyles = makeStyles(theme => ({
    gridItem: {
        padding: theme.spacing(2),
        textAlign: "center"
    }
}));

const saveImage = () => {
    const canvas = document.getElementsByTagName("canvas")[0];
    const image = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = image.replace(/^data:image\/[^;]/, "data:application/octet-stream");
    a.download = "image.png";
    a.click();
};

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
    const [time, setTime] = useState(0);
    const [animate, setAnimate] = useState(false);
    const [scene, setScene] = useState(newScene());
    const [botMeshes, setBotMeshes] = useState<Mesh[]>([]);
    const [groundEdgeMeshes, setGroundEdgeMeshes] = useState<Mesh[]>([]);
    const [edgeMeshes, setEdgeMeshes] = useState<Mesh[][]>([]);
    const [animation, setAnimation] = useState<World.World[]>([]);
    const [worldStart, setWorldStart] = useState<World.World>(World.newWorld());
    const [worldEnd, setWorldEnd] = useState<World.World>(World.newWorld());
    const [selectedExample, setSelectedExample] = useState<number | undefined>(undefined);

    const updateWorld = (time: number) => {
        animation[time].bots.map((bot, i) => {
            botMeshes[i].position.set(...bot.pos);
        });
        animation[time].bots.map((bot, i) => {
            scene.remove(groundEdgeMeshes[i]);
            const strength = World.edgeStrength(bot.pos[1] + 0.5);
            if (strength < 0.01) return;
            scene.add(groundEdgeMeshes[i]);
            updateCylinder(
                bot.pos,
                Vec3.newVec3(bot.pos[0], 0, bot.pos[2]),
                Math.sqrt(strength) * 0.3
            )(groundEdgeMeshes[i]);
        });
        animation[time].bots.map((from, i) =>
            animation[time].bots.map((to, j) => {
                if (i >= j) return;
                scene.remove(edgeMeshes[i][j]);
                const strength = World.edgeStrength(Vec3.length(Vec3.sub(to.pos, from.pos)));
                if (strength < 0.01) return;
                scene.add(edgeMeshes[i][j]);
                updateCylinder(from.pos, to.pos, Math.sqrt(strength) * 0.3)(edgeMeshes[i][j]);
            })
        );
    };

    useEffect(() => {
        if (animation.length === 0) return;
        setBotMeshes(
            animation[0].bots.map(bot =>
                newSphere(bot.pos, bot.target(1) === undefined ? new Color(0, 0, 1) : new Color(0, 1, 0))
            )
        );
        setGroundEdgeMeshes(
            animation[0].bots.map(bot =>
                newCylinder(bot.pos, Vec3.newVec3(bot.pos[0], 0, bot.pos[2]), 1, new Color(1, 0, 0))
            )
        );
        setEdgeMeshes(
            animation[0].bots.map(a => animation[0].bots.map(b => newCylinder(a.pos, b.pos, 1, new Color(1, 0, 0))))
        );
    }, [animation]);

    useEffect(() => {
        const scn = newScene();
        botMeshes.map(mesh => scn.add(mesh));
        groundEdgeMeshes.map(mesh => scn.add(mesh));
        edgeMeshes.map((row, i) =>
            row.map((mesh, j) => {
                if (i >= j) return;
                scn.add(mesh);
            })
        );
        setScene(scn);
    }, [botMeshes, groundEdgeMeshes, edgeMeshes]);

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
        if (renderer && camera && scene) renderer.render(scene, camera);
    }, [controls, renderer, camera, frame, scene]);

    useEffect(() => {
        if (botMeshes.length === 0) return;
        const pauseFrac = 0.1;
        const pauseFrames = Math.round(pauseFrac * animation.length);
        let t = time % (2 * (animation.length + pauseFrames));
        if (t < pauseFrames) {
            updateWorld(0);
            return;
        }
        t -= pauseFrames;
        if (t < animation.length) {
            updateWorld(t);
            return;
        }
        t -= animation.length;
        if (t < pauseFrames) {
            updateWorld(animation.length - 1);
            return;
        }
        t -= pauseFrames;
        updateWorld(animation.length - 1 - t);
    }, [time, scene]);

    useEffect(() => {
        if (!animate) return;
        const t = setInterval(() => setTime(time => time + 1), 10);
        return () => clearInterval(t);
    }, [animate]);

    return (
        <>
            <Grid container item xs={11}>
                <Grid
                    item
                    xs={4}
                    style={{ height: window.innerHeight * 0.9, overflowX: "hidden", overflowY: "scroll" }}>
                    <Grid container direction="column">
                        <b>Microbots</b>
                        <Grid item className={classes.gridItem}>
                            <Paper>
                                <List>
                                    <ListItem>
                                        <b>Select an example</b>
                                    </ListItem>
                                </List>
                                {examples.map((example, i) => (
                                    <Button
                                        key={i}
                                        variant="contained"
                                        color={selectedExample === i ? "primary" : "default"}
                                        onClick={() => {
                                            const rng = new Prando(123);
                                            const [ws, we] = loadExample(i);
                                            console.log(ws, we);
                                            const rand = () =>
                                                Vec3.multiplyScalar(
                                                    Vec3.newVec3(rng.next() - 0.5, rng.next() - 0.5, rng.next() - 0.5),
                                                    0.1
                                                );
                                            ws.bots.map(bot => (bot.pos = Vec3.add(bot.pos, rand())));
                                            we.bots.map(bot => (bot.pos = Vec3.add(bot.pos, rand())));
                                            setWorldStart(ws);
                                            setWorldEnd(we);
                                            setAnimation([ws, we]);
                                            setAnimate(false);
                                            setSelectedExample(i);
                                        }}>
                                        {example.title} ({example.world.bots.length} bots)
                                    </Button>
                                ))}
                                <br />
                                <br />
                            </Paper>
                        </Grid>
                        <Grid item className={classes.gridItem}>
                            <Paper>
                                <List>
                                    <ListItem>
                                        <b>Compute the animation</b>
                                    </ListItem>
                                    <ListItem>
                                        <Button
                                            variant="contained"
                                            onClick={() => {
                                                const t = Date.now();
                                                setAnimation(Animation.createAnimation(worldStart, worldEnd, 8));
                                                console.log((Date.now() - t) / 1000);
                                                setAnimate(true);
                                            }}>
                                            Generate animation
                                        </Button>
                                    </ListItem>
                                </List>
                            </Paper>
                        </Grid>
                        <Grid item className={classes.gridItem}>
                            <Paper>
                                <List>
                                    <ListItem>
                                        <b>Extra options</b>
                                    </ListItem>
                                    <ListItem>
                                        <Button variant="contained" onClick={() => setTime(time + 1)}>
                                            Time: {time}
                                        </Button>
                                    </ListItem>
                                    <ListItem>
                                        <Button variant="contained" onClick={() => setAnimate(!animate)}>
                                            Animate: {animate ? "true" : "false"}
                                        </Button>
                                    </ListItem>
                                    <ListItem>
                                        <Button variant="contained" onClick={() => saveImage()}>
                                            Save screenshot
                                        </Button>
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
