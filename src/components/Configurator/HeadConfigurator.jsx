import React from "react";
import { Stack, ColorInput, Grid, Button, Container, } from "@mantine/core"
import { SwatchesColors, useCharacterCustomization, Hairstyles } from "./CharacterCustomization"

export const HeadConfigurator = () => {
    const { 
        Pupil,
        setPupil,
        Iris,
        setIris,
        Sclera,
        setScelera,
        Hair,
        setHair,
        HairColor,
        setHairColor,
    } = useCharacterCustomization();


    return (
        <>
            <h3>Eyes</h3>
            <Container size="xs">
                <Stack spacing={"sm"} py={"sm"}>
                    <ColorInput
                        label="Pupil"
                        format="hex"
                        swatches={SwatchesColors}
                        onChange={setPupil}
                        value={Pupil}
                    />
                    <ColorInput
                        label="Iris"
                        format="hex"
                        swatches={SwatchesColors}
                        onChange={setIris}
                        value={Iris}
                    />
                    <ColorInput
                        label="Sclera"
                        format="hex"
                        swatches={SwatchesColors}
                        onChange={setScelera}
                        value={Sclera}
                    />
                </Stack>
            </Container>

            <h3>Hairstyles</h3>
            <Container  p={10} size="20rem">
                <Stack spacing={"sm"} py={"sm"} justify="center">
                        <Grid>
                            {
                                Hairstyles.map((hair) => (
                                    <Grid.Col key={hair} span='content' >
                                        <Button 
                                            variant={hair === Hair ? "filled" : "light"}
                                            onClick={() => setHair(hair)}
                                        >
                                            {hair}
                                        </Button>
                                    </Grid.Col>
                                ))
                            }
                                    
                        </Grid>
                            
                        <ColorInput
                            format="hex"
                            swatches={SwatchesColors}
                            onChange={setHairColor}
                            value={HairColor}
                        />
                </Stack>
            </Container>
        </>
    )
}