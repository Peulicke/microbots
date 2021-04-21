import { Button, FormControlLabel, Grid, List, ListItem, Switch, makeStyles } from "@material-ui/core";
import React, { FC, useState } from "react";

import Dynamic from "./Dynamic";
import Scene from "./Scene";
import SelectExample from "./SelectExample";
import Static from "./Static";
import { World } from "../core";

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
    a.href = image.replace(/^data:image\/[^;]/u, "data:application/octet-stream");
    a.download = "image.png";
    a.click();
};

const subdivideIterations = 10;
const optimizeIterations = 10;
const resolveOverlapIterations = 10;
const contractIterations = 10;
const minimizeAccelerationIterations = 40;

const App: FC = () => {
    const classes = useStyles();
    const [worldStart, setWorldStart] = useState<World.World | undefined>(undefined);
    const [worldEnd, setWorldEnd] = useState<World.World | undefined>(undefined);
    const [world, setWorld] = useState<World.World | undefined>(undefined);
    const [worldPrev, setWorldPrev] = useState<World.World | undefined>(undefined);
    const [dynamic, setDynamic] = useState(false);

    return (
        <>
            <Grid container item xs={11}>
                <Grid
                    item
                    xs={4}
                    style={{ height: window.innerHeight * 0.9, overflowX: "hidden", overflowY: "scroll" }}>
                    <Grid container direction="column">
                        <b style={{ fontSize: 20 }}>Microbots</b>
                        <Grid item className={classes.gridItem}>
                            <SelectExample
                                onSelect={(ws: World.World, we: World.World) => {
                                    setWorldStart(ws);
                                    setWorldEnd(we);
                                    setWorld(ws);
                                    setWorldPrev(ws);
                                }}
                            />
                        </Grid>
                        <Grid item className={classes.gridItem}>
                            <b>Animation</b>
                            <br />
                            <FormControlLabel
                                control={<Switch checked={dynamic} onChange={e => setDynamic(e.target.checked)} />}
                                label="Dynamic"
                            />
                            {dynamic ? (
                                <Dynamic
                                    worldEnd={worldEnd}
                                    world={world}
                                    worldPrev={worldPrev}
                                    setWorld={setWorld}
                                    setWorldPrev={setWorldPrev}
                                    subdivideIterations={subdivideIterations}
                                    optimizeIterations={optimizeIterations}
                                    resolveOverlapIterations={resolveOverlapIterations}
                                    contractIterations={contractIterations}
                                    minimizeAccelerationIterations={minimizeAccelerationIterations}
                                />
                            ) : (
                                <Static
                                    worldStart={worldStart}
                                    worldEnd={worldEnd}
                                    setWorld={setWorld}
                                    subdivideIterations={subdivideIterations}
                                    optimizeIterations={optimizeIterations}
                                    resolveOverlapIterations={resolveOverlapIterations}
                                    contractIterations={contractIterations}
                                    minimizeAccelerationIterations={minimizeAccelerationIterations}
                                />
                            )}
                        </Grid>
                        <Grid item className={classes.gridItem}>
                            <b>Extra options</b>
                            <List>
                                <ListItem>
                                    <Button variant="contained" onClick={() => saveImage()}>
                                        Save screenshot
                                    </Button>
                                </ListItem>
                            </List>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={5}>
                    <Scene world={world} />
                </Grid>
            </Grid>
        </>
    );
};

export default App;
