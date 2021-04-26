import React, { FC, useState } from "react";
import { Vec3, World } from "../core";
import loadExample, { Example, examples } from "../examples";

import { Button } from "@material-ui/core";
import Prando from "prando";

type Props = { onSelect: (worldStart: World.World, worldEnd: World.World) => void };

const SelectExample: FC<Props> = props => {
    const [selectedExample, setSelectedExample] = useState<number | undefined>(undefined);

    const exampleButton = (example: Example, i: number) => (
        <Button
            key={i}
            variant="contained"
            color={selectedExample === i ? "primary" : "default"}
            onClick={() => {
                const rng = new Prando(123);
                const [ws, we] = loadExample(example);
                console.log(ws, we);
                const rand = () =>
                    Vec3.multiplyScalar(Vec3.newVec3(rng.next() - 0.5, rng.next() - 0.5, rng.next() - 0.5), 0.1);
                ws.bots.map(bot => (bot.pos = Vec3.add(bot.pos, rand())));
                we.bots.map(bot => (bot.pos = Vec3.add(bot.pos, rand())));
                props.onSelect(ws, we);
                setSelectedExample(i);
            }}>
            {example.title} ({example.start.bots.length} bots)
        </Button>
    );

    const examplesNoFixed = examples.filter(e => !e.start.bots.some(bot => bot.fixed));

    const examplesFixed = examples.filter(e => e.start.bots.some(bot => bot.fixed));

    return (
        <>
            <b>Select an example</b>
            <br />
            <br />
            No obstacles
            <br />
            <br />
            {examplesNoFixed.map(exampleButton)}
            <br />
            <br />
            Obstacles
            <br />
            <br />
            {examplesFixed.map((e, i) => exampleButton(e, i + examplesNoFixed.length))}
        </>
    );
};

export default SelectExample;
