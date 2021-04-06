import React, { FC, useState } from "react";
import { Paper, List, ListItem, Button } from "@material-ui/core";
import { Vec3, World } from "../core";
import Prando from "prando";
import loadExample, { examples } from "../examples";

type Props = { onSelect: (worldStart: World.World, worldEnd: World.World) => void };

const App: FC<Props> = props => {
    const [selectedExample, setSelectedExample] = useState<number | undefined>(undefined);

    return (
        <Paper>
            <List>
                <ListItem>
                    <b>Select an example</b>
                </ListItem>
            </List>
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
                    {example.title} ({example.world.bots.length} bots)
                </Button>
            ))}
            <br />
            <br />
        </Paper>
    );
};

export default App;
