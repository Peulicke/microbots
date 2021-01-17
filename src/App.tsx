import React, { FC } from "react";
import { pipe } from "ts-pipe-compose";
import { matrix } from "mathjs";
import { Bot, World } from "./core";

const bot1 = Bot.setFixed(true)(Bot.newBot());
const bot2 = Bot.setFixed(true)(Bot.setPos(matrix([1, 0, 0]))(Bot.newBot()));
const bot3 = Bot.setFixed(true)(Bot.setPos(matrix([0, 0, 1]))(Bot.newBot()));
const bot4 = Bot.setPos(matrix([0, 1, 0]))(Bot.newBot());
const bots = [bot1, bot2, bot3, bot4];
const world = pipe(World.newWorld(), World.setBots(bots), World.initEdges);

World.optimize(world);

const App: FC = () => {
    return <div>test</div>;
};

export default App;
