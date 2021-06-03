import { Animation, BoundingBox, Vec3, World } from "../core";
import {
    FormControlLabel,
    Grid,
    List,
    ListItem,
    MenuItem,
    Select,
    Switch,
    TextField,
    makeStyles
} from "@material-ui/core";
import React, { FC, useState } from "react";

import Dynamic from "./Dynamic";
import Scene from "./Scene";
import SelectExample from "./SelectExample";
import Static from "./Static";
import update from "immutability-helper";

const useStyles = makeStyles(theme => ({
    gridItem: {
        padding: theme.spacing(2),
        textAlign: "center"
    }
}));

const worldCenter = (worldStart: World.World, worldEnd: World.World): Vec3.Vec3 => {
    const boundingBox = BoundingBox.merge(World.boundingBox(worldStart), World.boundingBox(worldEnd));
    return Vec3.multiplyScalar(Vec3.add(boundingBox.min, boundingBox.max), 0.5);
};

const App: FC = () => {
    const classes = useStyles();
    const [worldStart, setWorldStart] = useState<World.World | undefined>(undefined);
    const [worldEnd, setWorldEnd] = useState<World.World | undefined>(undefined);
    const [world, setWorld] = useState<World.World | undefined>(undefined);
    const [worldPrev, setWorldPrev] = useState<World.World | undefined>(undefined);
    const [dynamic, setDynamic] = useState(false);

    const [config, setConfig] = useState<Animation.Config>({
        subdivideIterations: 10,
        optimizeIterations: 10,
        contractionType: Animation.ContractionType.Fibers,
        contractIterations: 10,
        minimizeAccelerationIterations: 100,
        offset: 1.5,
        slack: 2,
        friction: 0.1,
        overlapPenalty: 1000,
        gravity: 1,
        botMass: 1,
        dt: 1
    });

    const center: Vec3.Vec3 =
        worldStart === undefined || worldEnd === undefined ? [0, 0, 0] : worldCenter(worldStart, worldEnd);

    return (
        <>
            <Grid container item xs={11}>
                <Grid item xs={4} style={{ height: "97vh", overflowX: "hidden", overflowY: "scroll" }}>
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
                                    worldStart={worldStart}
                                    worldEnd={worldEnd}
                                    world={world}
                                    worldPrev={worldPrev}
                                    setWorld={setWorld}
                                    setWorldPrev={setWorldPrev}
                                    config={config}
                                />
                            ) : (
                                <Static
                                    worldStart={worldStart}
                                    worldEnd={worldEnd}
                                    setWorld={setWorld}
                                    config={config}
                                />
                            )}
                        </Grid>
                        <Grid item className={classes.gridItem}>
                            <b>Extra options</b>
                            <List>
                                {Object.entries(config).map(([key, value]) => (
                                    <ListItem key={key}>
                                        {key === "contractionType" ? (
                                            <Select
                                                value={value}
                                                onChange={e => {
                                                    setConfig(
                                                        update(config, {
                                                            [key]: { $set: e.target.value as Animation.ContractionType }
                                                        })
                                                    );
                                                }}>
                                                {Object.entries(Animation.ContractionType)
                                                    .filter(([k]) => isNaN(Number(k)))
                                                    .map(([k, v]) => (
                                                        <MenuItem key={k} value={v}>
                                                            {k}
                                                        </MenuItem>
                                                    ))}
                                            </Select>
                                        ) : (
                                            <TextField
                                                type="number"
                                                label={key}
                                                value={value}
                                                onChange={e =>
                                                    setConfig(
                                                        update(config, {
                                                            [key]: { $set: Math.max(parseFloat(e.target.value), 0) }
                                                        })
                                                    )
                                                }
                                            />
                                        )}
                                    </ListItem>
                                ))}
                            </List>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={5}>
                    <Scene worldStart={worldStart} world={world} center={center} />
                </Grid>
            </Grid>
        </>
    );
};

export default App;
