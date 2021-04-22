import { Animation, Vec3, World } from "../core";
import { Button, List, ListItem } from "@material-ui/core";
import React, { FC, useEffect, useState } from "react";

import Prando from "prando";
import update from "immutability-helper";

const rng = new Prando(123);

const rand = () => Vec3.multiplyScalar(Vec3.newVec3(rng.next() - 0.5, rng.next() - 0.5, rng.next() - 0.5), 2);

type Props = {
    world: World.World | undefined;
    worldPrev: World.World | undefined;
    setWorld: (world: World.World) => void;
    setWorldPrev: (world: World.World) => void;
    worldEnd: World.World | undefined;
    subdivideIterations: number;
    optimizeIterations: number;
    resolveOverlapIterations: number;
    contractionType: Animation.ContractionType;
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

const Dynamic: FC<Props> = props => {
    const [pause, setPause] = useState(true);
    const [path, setPath] = useState<World.World[]>([]);

    const step = () => {
        if (props.world === undefined || props.worldPrev === undefined || props.worldEnd === undefined) return;
        if (
            path.length === 0 ||
            props.world.bots
                .map((bot, i) => Vec3.sub(bot.pos, path[0].bots[i].pos))
                .map(v => Vec3.dot(v, v))
                .reduce((sum, value) => sum + value, 0) > 0.00001
        ) {
            setPath(
                Animation.createAnimation(
                    props.offset,
                    props.slack,
                    props.friction,
                    props.overlapPenalty,
                    props.neighborRadius,
                    props.gravity,
                    props.botMass,
                    props.dt,
                    props.worldPrev,
                    props.world,
                    props.worldEnd,
                    props.worldEnd,
                    props.subdivideIterations,
                    props.optimizeIterations,
                    props.resolveOverlapIterations,
                    props.contractionType,
                    props.contractIterations,
                    props.minimizeAccelerationIterations
                )
            );
            return;
        }
        let p = path;
        if (p.length > 1) p = p.slice(1);
        props.setWorldPrev(props.world);
        props.setWorld(p[0]);
        setPath(p);
    };

    useEffect(() => {
        if (pause) return undefined;
        const i = setInterval(step, 1000 / 30);
        return () => clearInterval(i);
    }, [props, pause, path]);

    return (
        <List>
            <ListItem>
                <Button
                    variant="contained"
                    onClick={() => {
                        setPause(!pause);
                    }}>
                    paused: {pause ? "yes" : "no"}
                </Button>
            </ListItem>
            <ListItem>
                <Button
                    variant="contained"
                    onClick={() => {
                        if (props.world === undefined) return;
                        props.setWorld(
                            update(props.world, {
                                bots: {
                                    $set: props.world.bots.map(bot =>
                                        update(bot, { pos: { $set: Vec3.add(bot.pos, rand()) } })
                                    )
                                }
                            })
                        );
                    }}>
                    Disturb
                </Button>
            </ListItem>
        </List>
    );
};

export default Dynamic;
