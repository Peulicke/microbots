import { Color, Mesh } from "three";
import React, { FC, useEffect, useState } from "react";
import { newScene, newSphere } from "./draw";

import Canvas from "./Canvas";
import { World } from "../core";

type Props = {
    worldStart: World.World | undefined;
    world: World.World | undefined;
};

const Scene: FC<Props> = props => {
    const [scene, setScene] = useState(newScene());
    const [botMeshes, setBotMeshes] = useState<Mesh[]>([]);

    useEffect(() => {
        const w = props.world;
        if (w === undefined) return;
        if (botMeshes.length !== w.bots.length) return;
        w.bots.forEach((bot, i) => {
            botMeshes[i].position.set(...bot.pos);
        });
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

    return <Canvas scene={scene} />;
};

export default Scene;
