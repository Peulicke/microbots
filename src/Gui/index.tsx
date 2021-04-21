import { Button, FormControlLabel, Grid, List, ListItem, Switch, TextField, makeStyles } from "@material-ui/core";
import React, { FC, useState } from "react";

import Dynamic from "./Dynamic";
import Scene from "./Scene";
import SelectExample from "./SelectExample";
import Static from "./Static";
import { World } from "../core";
import update from "immutability-helper";

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

const App: FC = () => {
    const classes = useStyles();
    const [worldStart, setWorldStart] = useState<World.World | undefined>(undefined);
    const [worldEnd, setWorldEnd] = useState<World.World | undefined>(undefined);
    const [world, setWorld] = useState<World.World | undefined>(undefined);
    const [worldPrev, setWorldPrev] = useState<World.World | undefined>(undefined);
    const [dynamic, setDynamic] = useState(false);

    const [options, setOptions] = useState({
        subdivideIterations: 10,
        optimizeIterations: 10,
        resolveOverlapIterations: 10,
        contractIterations: 10,
        minimizeAccelerationIterations: 40,
        offset: 1.5,
        slack: 2,
        friction: 0.1,
        neighborRadius: 2,
        overlapPenalty: 1000,
        gravity: 1,
        botMass: 1,
        dt: 1
    });

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
                                    {...options}
                                />
                            ) : (
                                <Static worldStart={worldStart} worldEnd={worldEnd} setWorld={setWorld} {...options} />
                            )}
                        </Grid>
                        <Grid item className={classes.gridItem}>
                            <b>Extra options</b>
                            <List>
                                {Object.entries(options).map(([key, value]) => (
                                    <ListItem key={key}>
                                        <TextField
                                            type="number"
                                            label={key}
                                            value={value}
                                            onChange={e =>
                                                setOptions(
                                                    update(options, {
                                                        [key]: { $set: Math.max(parseFloat(e.target.value), 0) }
                                                    })
                                                )
                                            }
                                        />
                                    </ListItem>
                                ))}
                            </List>
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
