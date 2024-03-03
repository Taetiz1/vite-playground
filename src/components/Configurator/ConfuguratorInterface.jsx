import React from "react"
import { Affix, Button, Group } from "@mantine/core"
import { CameraModes, useCharacterCustomization } from "./CharacterCustomization";
import { useVideoChat } from "../voiceContext";
import { useSocketClient } from "../Login/SocketClient";

const ConfiguratorInterface = ({ socket, onLoading, setOnLoading, setCustomMode, avatarMode, setAvatarMode }) => {

    const { 
        isMode,
        SetIsMode,
        setCameraMode, 
    } = useCharacterCustomization();

    const { 
        username,
        setconfigChar,
        avatarUrl,
        socketClient,
    } = useSocketClient();

    const {
        setChannelName
    } = useVideoChat();

    function enterPlaygroud(roomID) {

        if(avatarUrl){
            const { id } = socket;
            
            setChannelName(roomID)
            socketClient.emit('joinroom', {
                id,
                name: username,
                avatarUrl: avatarUrl,
                roomID: roomID,
                atPos: 0,
            })
            setconfigChar(true)
            setOnLoading()
        } 
    }

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
                            enterPlaygroud("1")
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