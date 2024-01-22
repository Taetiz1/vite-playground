import React, { createContext, useContext, useState } from "react";
import { useGLTF } from "@react-three/drei";
import { useEffect } from "react";

const SocketclientContext = createContext({});

export const AddonEquipments = [ 
    { id: 'Item_1', name: 'Item 1', image: '/User.png', equipped: false, isNew: true },
    { id: 'Item_1', name: 'Item 2', image: '/User.png', equipped: false, isNew: true },
]

export const SocketclientProvider = ({children}) => {
    const [socketClient, setSocketClient] = useState(null)
    const [username, setUsername] = useState('')
    const [logedIn, setLogedIn] = useState(false)
    const [configChar, setconfigChar] = useState(false)
    const [email, setEmail] = useState(null)
    const [errorEmail, setErrorEmail] = useState(null)
    const [adminLogedIn, setAdminLogedIn] = useState(false)
    const [avatarUrl, setAvatarUrl] = useState("https://models.readyplayer.me/655a5d4e9b792809cdac419d.glb")
    const [currentRoom, setCurrentRoom] = useState()
    const [onLoading, setOnLoading] = useState(true);
    
    const Web_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";

    useEffect(() => {
        if (socketClient) {
          socketClient.on('configSetting', (config) => {
            // setSkin(config.Skin)
            // setPupil(config.Pupil)
            // setIris(config.Iris)
            // setScelera(config.Sclera)
            // setHair(config.Hair)
            // setHairColor(config.HairColor)
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
                setOnLoading
            }}
        >
            {children}
        </SocketclientContext.Provider>
    )
}

export const useSocketClient = () => {
    return useContext(SocketclientContext);
}
