import React, { FC, useEffect, useState } from "react";
import { Color, Mesh } from "three";
import { Grid, Paper, makeStyles, List, ListItem, Button } from "@material-ui/core";
import { Vec3, World } from "./core";
import { newScene, newSphere, newCylinder, updateCylinder } from "./draw";
import { Canvas, SelectExample, Static } from "./gui";

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
    const [scene, setScene] = useState(newScene());
    const [botMeshes, setBotMeshes] = useState<Mesh[]>([]);
    const [groundEdgeMeshes, setGroundEdgeMeshes] = useState<Mesh[]>([]);
    const [edgeMeshes, setEdgeMeshes] = useState<Mesh[][]>([]);
    const [worldStart, setWorldStart] = useState<World.World | undefined>(undefined);
    const [worldEnd, setWorldEnd] = useState<World.World | undefined>(undefined);
    const [world, setWorld] = useState<World.World | undefined>(undefined);

    useEffect(() => {
        if (world === undefined) return;
        if (botMeshes.length !== world.bots.length) return;
        world.bots.map((bot, i) => {
            botMeshes[i].position.set(...bot.pos);
        });
        world.bots.map((bot, i) => {
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
        world.bots.map((from, i) =>
            world.bots.map((to, j) => {
                if (i >= j) return;
                scene.remove(edgeMeshes[i][j]);
                const strength = World.edgeStrength(Vec3.length(Vec3.sub(to.pos, from.pos)));
                if (strength < 0.01) return;
                scene.add(edgeMeshes[i][j]);
                updateCylinder(from.pos, to.pos, Math.sqrt(strength) * 0.3)(edgeMeshes[i][j]);
            })
        );
    }, [world, botMeshes, edgeMeshes, groundEdgeMeshes]);

    useEffect(() => {
        if (world === undefined) return;
        if (botMeshes.length === world.bots.length) return;
        setBotMeshes(
            world.bots.map(bot =>
                newSphere(bot.pos, bot.target(1) === undefined ? new Color(0, 0, 1) : new Color(0, 1, 0))
            )
        );
        setGroundEdgeMeshes(
            world.bots.map(bot => newCylinder(bot.pos, Vec3.newVec3(bot.pos[0], 0, bot.pos[2]), 1, new Color(1, 0, 0)))
        );
        setEdgeMeshes(world.bots.map(a => world.bots.map(b => newCylinder(a.pos, b.pos, 1, new Color(1, 0, 0)))));
    }, [world, botMeshes]);

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
                                    setWorldStart(ws);
                                    setWorldEnd(we);
                                    setWorld(ws);
                                }}
                            />
                        </Grid>
                        <Grid item className={classes.gridItem}>
                            <Static worldStart={worldStart} worldEnd={worldEnd} setWorld={setWorld} />
                        </Grid>
                        <Grid item className={classes.gridItem}>
                            <Paper>
                                <List>
                                    <ListItem>
                                        <b>Extra options</b>
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
