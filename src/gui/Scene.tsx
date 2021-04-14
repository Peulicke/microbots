import React, { FC, useEffect, useState } from "react";
import { Color, Mesh, PlaneBufferGeometry, MeshBasicMaterial } from "three";
import { World } from "../core";
import { newScene, newSphere } from "../draw";
import { Canvas } from "../gui";

type Props = { world: World.World | undefined };

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
        const w = props.world;
        if (w === undefined) return;
        if (botMeshes.length === w.bots.length) return;
        setBotMeshes(
            w.bots.map(bot =>
                newSphere(bot.pos, bot.target === undefined ? new Color("#0000ff") : new Color("#fa8072"))
            )
        );
    }, [props.world, botMeshes]);

    useEffect(() => {
        const scn = newScene();
        const geo = new PlaneBufferGeometry(2000, 2000, 8, 8);
        const mat = new MeshBasicMaterial({ color: "#41980a" });
        const plane = new Mesh(geo, mat);
        plane.rotateX(-Math.PI / 2);
        scn.add(plane);

        botMeshes.forEach(mesh => scn.add(mesh));
        setScene(scn);
    }, [botMeshes]);

    return <Canvas scene={scene} />;
};

export default Scene;
