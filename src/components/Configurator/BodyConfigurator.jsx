import React from "react";
import { Stack, ColorInput, Container, } from "@mantine/core"
import { SwatchesColors, useCharacterCustomization, shirts } from "./CharacterCustomization"

export const BodyConfigurator = () => {
    const { 
        Skin,
        setSkin,
    } = useCharacterCustomization();


    return (
        <>
            <h3>Skin</h3>
            <Container size="xs">
                <Stack spacing={"sm"} py={"sm"}>
                    <ColorInput
                        label="Skin Color"
                        format="hex"
                        swatches={SwatchesColors}
                        onChange={setSkin}
                        value={Skin}
                    />
                </Stack>
            </Container>
        </>
    )
}