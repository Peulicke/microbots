import { Animation, World } from "../core";
import { Button, List, ListItem } from "@material-ui/core";
import React, { FC, useEffect, useState } from "react";

type Props = {
    worldStart: World.World | undefined;
    worldEnd: World.World | undefined;
    setWorld: (world: World.World) => void;
    subdivideIterations: number;
    optimizeIterations: number;
    resolveOverlapIterations: number;
    contractIterations: number;
    minimizeAccelerationIterations: number;
    offset: number;
    slack: number;
    friction: number;
    neighborRadius: number;
    overlapPenalty: number;
    gravity: number;
    botMass: number;
    dt: number;
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
        if (pause) return undefined;
        const i = setInterval(() => setTime(t => t + 1), 1000 / 30);
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
                                props.offset,
                                props.slack,
                                props.friction,
                                props.overlapPenalty,
                                props.neighborRadius,
                                props.gravity,
                                props.botMass,
                                props.dt,
                                props.worldStart,
                                props.worldStart,
                                props.worldEnd,
                                props.worldEnd,
                                props.subdivideIterations,
                                props.optimizeIterations,
                                props.resolveOverlapIterations,
                                props.contractIterations,
                                props.minimizeAccelerationIterations
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
