import React, { FC, useEffect, useState } from "react";
import { Color, Mesh } from "three";
import { Grid, Paper, makeStyles, List, ListItem, Button } from "@material-ui/core";
import { Vec3, World, Animation } from "./core";
import { newScene, newSphere, newCylinder, updateCylinder } from "./draw";
import { Canvas, SelectExample } from "./gui";

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
    const classes = useStyles();
    const [time, setTime] = useState(0);
    const [pause, setPause] = useState(true);
    const [scene, setScene] = useState(newScene());
    const [botMeshes, setBotMeshes] = useState<Mesh[]>([]);
    const [groundEdgeMeshes, setGroundEdgeMeshes] = useState<Mesh[]>([]);
    const [edgeMeshes, setEdgeMeshes] = useState<Mesh[][]>([]);
    const [animation, setAnimation] = useState<World.World[]>([]);

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
        if (pause) return;
        const t = setInterval(() => setTime(time => time + 1), 10);
        return () => clearInterval(t);
    }, [pause]);

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
                            <SelectExample
                                onSelect={(ws: World.World, we: World.World) => {
                                    setAnimation([ws, we]);
                                    setPause(true);
                                }}
                            />
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
                                                setAnimation(
                                                    Animation.createAnimation(
                                                        animation[0],
                                                        animation[animation.length - 1],
                                                        8
                                                    )
                                                );
                                                console.log((Date.now() - t) / 1000);
                                                setPause(false);
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
                                        <Button variant="contained" onClick={() => setPause(!pause)}>
                                            paused: {pause ? "yes" : "no"}
                                        </Button>
                                        {pause && (
                                            <Button variant="contained" onClick={() => setTime(time + 1)}>
                                                Step
                                            </Button>
                                        )}
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
                    <Canvas scene={scene} />
                </Grid>
            </Grid>
        </>
    );
};

export default App;
