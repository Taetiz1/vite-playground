import React, { createContext, useContext, useState } from "react";

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
                setOnDisconnect
            }}
        >
            {children}
        </VideoChatContext.Provider>
    )
}

export const useVideoChat = () => {
    return useContext(VideoChatContext);
}