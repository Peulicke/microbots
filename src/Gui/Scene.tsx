import { Color, Mesh } from "three";
import React, { FC, useEffect, useState } from "react";
import { Vec3, World } from "../core";
import { newScene, newSphere } from "./draw";

import Canvas from "./Canvas";

type Props = {
    worldStart: World.World | undefined;
    world: World.World | undefined;
    center: Vec3.Vec3;
};

const Scene: FC<Props> = props => {
    const [scene, setScene] = useState(newScene());
    const [botMeshes, setBotMeshes] = useState<Mesh[]>([]);
    const [renderedWorld, setRenderedWorld] = useState<World.World | undefined>();

    useEffect(() => {
        const w = props.world;
        if (w === undefined) return;
        if (botMeshes.length !== w.bots.length) return;
        w.bots.forEach((bot, i) => {
            botMeshes[i].position.set(...bot.pos);
        });
        setRenderedWorld(props.world);
    }, [props.world, botMeshes]);

    useEffect(() => {
        const w = props.worldStart;
        if (w === undefined) return;
        setBotMeshes(w.bots.map(bot => newSphere(bot.pos, new Color(bot.fixed ? "#808080" : "#fa8072"))));
    }, [props.worldStart]);

    useEffect(() => {
        const scn = newScene();
        botMeshes.forEach(mesh => scn.add(mesh));
        setScene(scn);
    }, [botMeshes]);

    return <Canvas scene={scene} center={props.center} world={renderedWorld} />;
};

export default Scene;
