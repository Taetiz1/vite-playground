import React, { createContext, useContext, useEffect, useState } from "react";
import { useSocketClient } from "./Login/SocketClient";

const VideoChatContext = createContext({});

export const VideoChatProvider = ({children}) => {
    const [MicisMute, setMicisMute] = useState(false);
    const [Mute, setMute] = useState(false)
    const [camOff, setCamOff] = useState(false)
    const [connectPeer, setConnectPeer] = useState(false)
    const [channelName, setChannelName] = useState("");
    const [start, setStart] = useState(false);
    const [onDisconnect, setOnDisconnect] = useState(false);
    const [VideoUsers, setVideoUsers] = useState([]);
    const [mutedUser, setMutedUser] = useState([])
    
    const {socketClient} = useSocketClient();

    useEffect(() => {
        if(socketClient) {
            socketClient.on("mutedUser", (mutedUser) => {
                setMutedUser(mutedUser)
            })
        }
    }, [socketClient])

    return (
        <VideoChatContext.Provider
            value={{
                MicisMute,
                setMicisMute,
                Mute,
                setMute,
                connectPeer,
                setConnectPeer,
                camOff,
                setCamOff,
                channelName,
                setChannelName,
                VideoUsers,
                setVideoUsers,
                start,
                setStart,
                onDisconnect,
                setOnDisconnect,
                mutedUser,
                setMutedUser
            }}
        >
            {children}
        </VideoChatContext.Provider>
    )
}

export const useVideoChat = () => {
    return useContext(VideoChatContext);
}