import React, { FC, useState } from "react";
import { Grid, Paper, makeStyles, List, ListItem, Button } from "@material-ui/core";
import { World } from "./core";
import { SelectExample, Static, Scene } from "./gui";

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
    const [worldStart, setWorldStart] = useState<World.World | undefined>(undefined);
    const [worldEnd, setWorldEnd] = useState<World.World | undefined>(undefined);
    const [world, setWorld] = useState<World.World | undefined>(undefined);

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
                    <Scene world={world} />
                </Grid>
            </Grid>
        </>
    );
};

export default App;
