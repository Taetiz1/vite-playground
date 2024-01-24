import React, { createContext, useContext, useState, useEffect } from "react";
import { useSocketClient } from "./Login/SocketClient";

const VideoChatContext = createContext({});

export const VideoChatProvider = ({children}) => {
    const [MicisToggled, setMicIsToggled] = useState(false);
    const [Peers, setPeers] = useState([]);
    const {
        socketClient
    } = useSocketClient();

    const callUser = () => {

        socketClient.emit("join voice")

        setMicIsToggled(!MicisToggled);
    }

    useEffect(() => {
        if(MicisToggled) {
            console.log('voice activated')
            socketClient.on("call users", (users) => {
                console.log(users)
            })
        } else {
            console.log('voice disactivated')
        }
    }, [MicisToggled])

    return (
        <VideoChatContext.Provider
            value={{
                MicisToggled,
                Peers,
                setPeers,
                callUser,
            }}
        >
            {children}
        </VideoChatContext.Provider>
    )
}

export const useVideoChat = () => {
    return useContext(VideoChatContext);
}