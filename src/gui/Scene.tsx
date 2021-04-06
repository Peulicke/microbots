import React, { FC, useEffect, useState } from "react";
import { Color, Mesh } from "three";
import { Vec3, World } from "../core";
import { newScene, newSphere, newCylinder, updateCylinder } from "../draw";
import { Canvas } from "../gui";

type Props = { world: World.World | undefined };

const Scene: FC<Props> = props => {
    const [scene, setScene] = useState(newScene());
    const [botMeshes, setBotMeshes] = useState<Mesh[]>([]);
    const [groundEdgeMeshes, setGroundEdgeMeshes] = useState<Mesh[]>([]);
    const [edgeMeshes, setEdgeMeshes] = useState<Mesh[][]>([]);

    useEffect(() => {
        const w = props.world;
        if (w === undefined) return;
        if (botMeshes.length !== w.bots.length) return;
        w.bots.forEach((bot, i) => {
            botMeshes[i].position.set(...bot.pos);
        });
        w.bots.forEach((bot, i) => {
            scene.remove(groundEdgeMeshes[i]);
            const strength = World.edgeStrength(bot.pos[1] + 0.5);
            if (strength < 0.01) return;
            scene.add(groundEdgeMeshes[i]);
            updateCylinder(
                bot.pos,
                Vec3.newVec3(bot.pos[0], 0, bot.pos[2]),
                Math.sqrt(strength) * 0.3
            )(groundEdgeMeshes[i]);
        });
        w.bots.forEach((from, i) => {
            w.bots.forEach((to, j) => {
                if (i >= j) return;
                scene.remove(edgeMeshes[i][j]);
                const strength = World.edgeStrength(Vec3.length(Vec3.sub(to.pos, from.pos)));
                if (strength < 0.01) return;
                scene.add(edgeMeshes[i][j]);
                updateCylinder(from.pos, to.pos, Math.sqrt(strength) * 0.3)(edgeMeshes[i][j]);
            });
        });
    }, [props.world, botMeshes, edgeMeshes, groundEdgeMeshes]);

    useEffect(() => {
        const w = props.world;
        if (w === undefined) return;
        if (botMeshes.length === w.bots.length) return;
        setBotMeshes(
            w.bots.map(bot => newSphere(bot.pos, bot.target(1) === undefined ? new Color(0, 0, 1) : new Color(0, 1, 0)))
        );
        setGroundEdgeMeshes(
            w.bots.map(bot => newCylinder(bot.pos, Vec3.newVec3(bot.pos[0], 0, bot.pos[2]), 1, new Color(1, 0, 0)))
        );
        setEdgeMeshes(w.bots.map(a => w.bots.map(b => newCylinder(a.pos, b.pos, 1, new Color(1, 0, 0)))));
    }, [props.world, botMeshes]);

    useEffect(() => {
        const scn = newScene();
        botMeshes.forEach(mesh => scn.add(mesh));
        groundEdgeMeshes.forEach(mesh => scn.add(mesh));
        edgeMeshes.forEach((row, i) =>
            row.forEach((mesh, j) => {
                if (i >= j) return;
                scn.add(mesh);
            })
        );
        setScene(scn);
    }, [botMeshes, groundEdgeMeshes, edgeMeshes]);

    return <Canvas scene={scene} />;
};

export default Scene;
