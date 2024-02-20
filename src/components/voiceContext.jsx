import React, { createContext, useContext, useState, useEffect, useRef } from "react";
// import { createClient, createMicrophoneAndCameraTracks } from "agora-rtc-react"
import { useSocketClient } from "./Login/SocketClient";
import { useVideoClient } from "./Voice/settings";
import { useVideoTracks } from "./Voice/settings";
import Peer from 'simple-peer';

const VideoChatContext = createContext({});

export const VideoChatProvider = ({children}) => {
    const [MicisMute, setMicisMute] = useState(false);
    const [Mute, setMute] = useState(false)
    const [camOff, setCamOff] = useState(false)
    const [connectPeer, setConnectPeer] = useState(false)
    const [Peers, setPeers] = useState([]);
    const [Stream, setStream] = useState();
    const [channelName, setChannelName] = useState("");
    const [start, setStart] = useState(false);
    const [onDisconnect, setOnDisconnect] = useState(false);

    const [VideoUsers, setVideoUsers] = useState([]);

    const userVideo = useRef();
    const peersRef = useRef([]);

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
                userVideo,
                peersRef,
                Peers,
                setPeers,
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