import React, { FC, useState } from "react";
import { Vec3, World } from "../core";
import loadExample, { examples } from "../examples";

import { Button } from "@material-ui/core";
import Prando from "prando";

type Props = { onSelect: (worldStart: World.World, worldEnd: World.World) => void };

const SelectExample: FC<Props> = props => {
    const [selectedExample, setSelectedExample] = useState<number | undefined>(undefined);

    return (
        <>
            <b>Select an example</b>
            <br />
            <br />
            {examples.map((example, i) => (
                <Button
                    key={i}
                    variant="contained"
                    color={selectedExample === i ? "primary" : "default"}
                    onClick={() => {
                        const rng = new Prando(123);
                        const [ws, we] = loadExample(i);
                        console.log(ws, we);
                        const rand = () =>
                            Vec3.multiplyScalar(
                                Vec3.newVec3(rng.next() - 0.5, rng.next() - 0.5, rng.next() - 0.5),
                                0.1
                            );
                        ws.bots.map(bot => (bot.pos = Vec3.add(bot.pos, rand())));
                        we.bots.map(bot => (bot.pos = Vec3.add(bot.pos, rand())));
                        props.onSelect(ws, we);
                        setSelectedExample(i);
                    }}>
                    {example.title} ({example.start.bots.length} bots)
                </Button>
            ))}
        </>
    );
};

export default SelectExample;
