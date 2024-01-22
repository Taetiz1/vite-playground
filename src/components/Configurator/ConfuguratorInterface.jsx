import { Affix, Button, Group } from "@mantine/core"
import React, { useState } from "react"
import { useCharacterAnimations } from "./CharacterAnimations"
import { CameraModes, useCharacterCustomization } from "./CharacterCustomization";
import { HeadConfigurator } from "./HeadConfigurator";
import { BodyConfigurator } from "./BodyConfigurator";
import { useSocketClient } from "../Login/SocketClient";

const ConfiguratorInterface = ({ socket, onLoading, setOnLoading, setCustomMode}) => {

    const { 
        animations, 
        animationIndex, 
        setAnimationIndex 
    } = useCharacterAnimations();

    const { 
        isMode,
        SetIsMode,
        setCameraMode, 
        Skin,
        Pupil,
        Iris,
        Sclera, 
        Hair,
        HairColor,
    } = useCharacterCustomization();

    const { 
        username,
        setconfigChar,
        avatarUrl,
        email,
    } = useSocketClient();

    function enterPlaygroud() {

        // if(Pupil && Iris && Sclera && Skin && Hair && HairColor){
        //     const { id } = socket;
        //     socket.emit('config', {
        //         id,
        //         Skin: Skin,
        //         Pupil: Pupil,
        //         Iris: Iris,
        //         Sclera: Sclera,
        //         Hair: Hair,
        //         HairColor: HairColor,
        //     })
        //     setconfigChar(true)
        //     setOnLoading()
        // } 

        if(avatarUrl){
            const { id } = socket;
            socket.emit('joinroom', {
                id,
                name: username,
                avatarUrl: avatarUrl,
                email: email,
                roomID: 0,
            })
            setconfigChar(true)
            setOnLoading()
        } 
    }

    return (
        !onLoading && <>
            <Affix position={{top: 20, left:20}}>
                <img src="/src/assets/MetaverseLogo.png" alt="icon" width="200" height="74" style={{pointerEvents: 'none', userSelect: 'none'}}/>
            </Affix>

            <Affix position={{ top: 20, right: 20}}>
                <Group>
                    {
                        Object.keys(CameraModes).map((mode) => (
                            <Button 
                                key={mode} 
                                variant={mode === isMode ? "filled" : "light"}
                                onClick={() => {
                                    setCameraMode(mode)
                                    SetIsMode(mode)
                                }}
                            >
                                {mode}
                            </Button>
                        ))
                    }
                </Group>
            </Affix>

            {/* <Affix position={{top: 60, right: 20}}>
                    {isMode === CameraModes.Head && <HeadConfigurator /> }
                    {isMode === CameraModes.Body && <BodyConfigurator /> }
            </Affix> */}

            <Affix position={{ bottom: 20, right: '50%' }}>
                <Button onClick={() => {setCustomMode()}}>
                    Custom 
                </Button>
            </Affix>

            <Affix position={{ bottom: 20, right: 20 }}>
                <Group>
                    {
                        animations.map((animation, index) => (
                            index === 3 || index === 4 || index === 7   ? (
                                <Button 
                                    variant={index === animationIndex ? "filled" : "light"}
                                    onClick={() => setAnimationIndex(index) }
                                >
                                    {animation}
                                </Button>
                            ) : null
                        ))
                    }
                    <Button onClick={enterPlaygroud}>
                        Go!
                    </Button>
                </Group>
            </Affix>
        </>
    )
}

export default ConfiguratorInterface