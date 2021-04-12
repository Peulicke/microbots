import React, { FC, useEffect, useState } from "react";
import { List, ListItem, Button } from "@material-ui/core";
import update from "immutability-helper";
import Prando from "prando";
import { Vec3, World, Animation } from "../core";

const rng = new Prando(123);

const rand = () => Vec3.multiplyScalar(Vec3.newVec3(rng.next() - 0.5, rng.next() - 0.5, rng.next() - 0.5), 2);

type Props = {
    world: World.World | undefined;
    worldPrev: World.World | undefined;
    setWorld: (world: World.World) => void;
    setWorldPrev: (world: World.World) => void;
    worldEnd: World.World | undefined;
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
            setPath(Animation.createAnimation(props.worldPrev, props.world, props.worldEnd, props.worldEnd));
            return;
        }
        let p = path;
        if (p.length > 1) p = p.slice(1);
        props.setWorldPrev(props.world);
        props.setWorld(p[0]);
        setPath(p);
    };

    useEffect(() => {
        if (pause) return;
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
