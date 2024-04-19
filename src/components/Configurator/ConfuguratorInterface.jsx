import React from "react"
import { Affix, Button, Group } from "@mantine/core"
import { CameraModes, useCharacterCustomization } from "./CharacterCustomization";

const ConfiguratorInterface = ({ onLoading, setCustomMode, avatarMode, setAvatarMode, enterPlaygroud }) => {

    const { 
        isMode,
        SetIsMode,
        setCameraMode, 
    } = useCharacterCustomization();

    if(!avatarMode) {
        return (!onLoading && <>
            <Affix position={{top: 20, left:20}}>
                <img src="/assets/MetaverseLogo.png" alt="icon" width="200" height="74" style={{pointerEvents: 'none', userSelect: 'none'}}/>
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

            <Affix position={{ bottom: 20, right: '50%' }}>
                <Button onClick={() => {setCustomMode()}}>
                    Custom 
                </Button>
            </Affix>

            <Affix position={{ bottom: 20, right: 20 }}>
                <Group>
                    <Button 
                        onClick={() => {
                            enterPlaygroud("0")
                        }}
                    >
                        Go!
                    </Button>
                </Group>
            </Affix>
        </>)
    } else {
        return(<>
            <Affix position={{ bottom: 20, left: 20 }}>
                <Group>
                    <Button 
                        onClick={() => {
                            setAvatarMode(false)
                        }}
                    >
                        Back
                    </Button>
                </Group>
            </Affix>

        </>)
    }
}

export default ConfiguratorInterface