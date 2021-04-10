import React, { FC, useEffect, useState } from "react";
import { List, ListItem, Button } from "@material-ui/core";
import { World, Animation } from "../core";

type Props = {
    worldStart: World.World | undefined;
    worldEnd: World.World | undefined;
    setWorld: (world: World.World) => void;
};

const Static: FC<Props> = props => {
    const [time, setTime] = useState(0);
    const [pause, setPause] = useState(true);
    const [animation, setAnimation] = useState<World.World[]>([]);

    useEffect(() => {
        if (animation.length === 0) return;
        const pauseFrac = 0.1;
        const pauseFrames = Math.round(pauseFrac * animation.length);
        let t = time % (2 * (animation.length + pauseFrames));
        if (t < pauseFrames) {
            props.setWorld(animation[0]);
            return;
        }
        t -= pauseFrames;
        if (t < animation.length) {
            props.setWorld(animation[t]);
            return;
        }
        t -= animation.length;
        if (t < pauseFrames) {
            props.setWorld(animation[animation.length - 1]);
            return;
        }
        t -= pauseFrames;
        props.setWorld(animation[animation.length - 1 - t]);
    }, [animation, time]);

    useEffect(() => {
        if (pause) return;
        const i = setInterval(() => setTime(time => time + 1), 1000 / 30);
        return () => clearInterval(i);
    }, [pause]);

    return (
        <List>
            <ListItem>
                <Button
                    variant="contained"
                    onClick={() => {
                        if (props.worldStart === undefined || props.worldEnd === undefined) return;
                        const t = Date.now();
                        setAnimation(
                            Animation.createAnimation(
                                props.worldStart,
                                props.worldStart,
                                props.worldEnd,
                                props.worldEnd,
                                2
                            )
                        );
                        console.log((Date.now() - t) / 1000);
                        setPause(false);
                    }}>
                    Generate animation
                </Button>
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
        </List>
    );
};

export default Static;
