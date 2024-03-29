import React, { createContext, useContext, useState, useEffect } from "react";

const SocketclientContext = createContext({});

export const SocketclientProvider = ({children}) => {
    const [socketClient, setSocketClient] = useState(null)
    const [clients, setClients] = useState({})
    const [username, setUsername] = useState('')
    const [logedIn, setLogedIn] = useState(false)
    const [connectServer, setConnectServer] = useState(false)
    const [configChar, setconfigChar] = useState(false)
    const [email, setEmail] = useState(null)
    const [errorEmail, setErrorEmail] = useState(false)
    const [adminLogedIn, setAdminLogedIn] = useState(false)
    const [avatarUrl, setAvatarUrl] = useState("https://models.readyplayer.me/655a5d4e9b792809cdac419d.glb")
    const [startPoint, setStartPoint] = useState()
    const [currentRoom, setCurrentRoom] = useState()
    const [onLoading, setOnLoading] = useState(true);
    const [onConnectionFailed, setOnConnectionFailed] = useState(false)
    const [posMinimap, setPosMinimap] = useState([0, 0, 0])
    
    const Web_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";

    useEffect(() => {
        if(socketClient) {
            socketClient.on('configSetting', (config) => {
                setAvatarUrl(config)
            })

            socketClient.on('starting point', (spawn) => {
                setStartPoint(spawn)
            })

            socketClient.on('currentRoom', (settings) => {
                setCurrentRoom(settings)  
            })
        }
        
    }, [socketClient])

    return (
        <SocketclientContext.Provider
            value={{
                errorEmail,
                setErrorEmail,
                email, 
                setEmail,
                configChar, 
                setconfigChar,
                logedIn,
                setLogedIn,
                username,
                setUsername,
                socketClient,
                setSocketClient,
                Web_URL,
                adminLogedIn,
                setAdminLogedIn,
                avatarUrl,
                setAvatarUrl,
                currentRoom,
                onLoading,
                setOnLoading,
                posMinimap,
                setPosMinimap,
                clients,
                setClients,
                connectServer,
                setConnectServer,
                onConnectionFailed,
                setOnConnectionFailed,
                startPoint
            }}
        >
            {children}
        </SocketclientContext.Provider>
    )
}

export const useSocketClient = () => {
    return useContext(SocketclientContext);
}
