import React, { FC } from "react";
import { pipe } from "ts-pipe-compose";
import { Vector3 } from "three";
import { Bot, World } from "./core";

const bot = pipe(Bot.newBot(), Bot.setPos(new Vector3(0, 0, 0)), Bot.setWeight(1), Bot.setFixed(true));

const world = pipe(World.newWorld(), World.setBots([bot]));

World.optimize(world);

const App: FC = () => {
    return <div>test</div>;
};

export default App;
