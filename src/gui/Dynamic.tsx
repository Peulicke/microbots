import React, { FC, useEffect, useState } from "react";
import { List, ListItem, Button } from "@material-ui/core";
import { World } from "../core";

type Props = {
    world: World.World | undefined;
    setWorld: (world: World.World) => void;
    worldEnd: World.World | undefined;
};

const Dynamic: FC<Props> = props => {
    const [time, setTime] = useState(0);
    const [pause, setPause] = useState(true);

    useEffect(() => {
        console.log("step");
    }, [time]);

    useEffect(() => {
        if (pause) return;
        const i = setInterval(() => setTime(time => time + 1), 1000 / 30);
        return () => clearInterval(i);
    }, [pause]);

    return (
        <List>
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
        </List>
    );
};

export default Dynamic;
