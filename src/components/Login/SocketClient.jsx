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
    const [doEmote, setDoEmote] = useState(false)
    const [emote, setEmote] = useState('')
    const [onInteractive, setOnInteractive] = useState(false)
    const [interractivePosition, setInterractivePosition] = useState({
        pos: [0, 0, 0],
        rot: [0, 0, 0]
    })
    const [avatarAnimation, setAvatarAnimation] = useState([])
    const [showInformation, setShowInformation] = useState(false)
    const [information, setInformation] = useState({})
    const [questions, setQuestions] = useState([])
    const [showQuestion, setshowQuestion] = useState(false);
    const [leaderBoard, setLeaderBoard] = useState([])
    
    const Web_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";

    useEffect(() => {
        if(socketClient) {
            socketClient.on('configSetting', ({avatarUrl, animations}) => {
                setAvatarUrl(avatarUrl)
                setAvatarAnimation(animations)
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
                clients,
                setClients,
                connectServer,
                setConnectServer,
                onConnectionFailed,
                setOnConnectionFailed,
                startPoint,
                doEmote, 
                setDoEmote,
                emote,
                setEmote,
                onInteractive, 
                setOnInteractive,
                interractivePosition, 
                setInterractivePosition,
                avatarAnimation,
                showInformation,
                setShowInformation,
                information,
                setInformation,
                questions, 
                setQuestions,
                showQuestion, 
                setshowQuestion,
                leaderBoard, 
                setLeaderBoard
            }}
        >
            {children}
        </SocketclientContext.Provider>
    )
}

export const useSocketClient = () => {
    return useContext(SocketclientContext);
}
