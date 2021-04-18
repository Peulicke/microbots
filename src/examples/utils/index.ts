import { Vec3, Bot, World } from "../../core";

export const coordsToWorld = (coords: Vec3.Vec3[]): World.World => ({
    bots: coords.map(
        (pos): Bot.Bot => ({
            pos: pos
        })
    )
});
