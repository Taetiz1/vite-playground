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
    const [errorEmail, setErrorEmail] = useState(null)
    const [adminLogedIn, setAdminLogedIn] = useState(false)
    const [avatarUrl, setAvatarUrl] = useState("https://models.readyplayer.me/655a5d4e9b792809cdac419d.glb")
    const [currentRoom, setCurrentRoom] = useState()
    const [onLoading, setOnLoading] = useState(true);
    const [posMinimap, setPosMinimap] = useState([0, 0, 0])
    
    const Web_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";

    useEffect(() => {
        if (socketClient) {
          socketClient.on('configSetting', (config) => {
            setAvatarUrl(config)
          })

          socketClient.on('currentRoom', (roomId) => {
            setCurrentRoom(roomId)
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
            }}
        >
            {children}
        </SocketclientContext.Provider>
    )
}

export const useSocketClient = () => {
    return useContext(SocketclientContext);
}
