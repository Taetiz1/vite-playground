import React, { createContext, useContext, useState } from "react";
import { useGLTF } from "@react-three/drei";
import { atom, useAtom } from "jotai";
import { useEffect } from "react";
// import { io } from "socket.io-client";

// export const socket = io(
//     import.meta.env.VITE_SERVER_URL || "http://localhost:3000"
// );

// export const charactersAtom = atom([]);
// export const mapAtom = atom(null);
// export const userAtom = atom(null);
// export const roomIDAtom = atom(null);
// export const roomsAtom = atom([]);

// export const SocketManager = () => {
//     const [_characters, setCharacters] = useAtom(charactersAtom);
//     const [_map, setMap] = useAtom(mapAtom);
//     const [_user, setUser] = useAtom(userAtom);
//     const [_rooms, setRooms] = useAtom(roomsAtom);
  
//     useEffect(() => {
//       function onConnect() {
//         console.log("connected");
//       }
//       function onDisconnect() {
//         console.log("disconnected");
//       }
  
//       function onWelcome(value) {
//         setRooms(value.rooms);
//         setItems(value.items);
//       }
  
//       function onRoomJoined(value) {
//         setMap(value.map);
//         setUser(value.id);
//         setCharacters(value.characters);
//       }
  
//       function onCharacters(value) {
//         setCharacters(value);
//       }
  
//       function onRooms(value) {
//         setRooms(value);
//       }
  
//       socket.on("connect", onConnect);
//       socket.on("disconnect", onDisconnect);
//       socket.on("roomJoined", onRoomJoined);
//       socket.on("rooms", onRooms);
//       socket.on("welcome", onWelcome);
//       socket.on("characters", onCharacters);
//       return () => {
//         socket.off("connect", onConnect);
//         socket.off("disconnect", onDisconnect);
//         socket.off("roomJoined", onRoomJoined);
//         socket.off("rooms", onRooms);
//         socket.off("welcome", onWelcome);
//         socket.off("characters", onCharacters);
//       };
//     }, []);
// };

/////////////////////////////////////////////

const SocketclientContext = createContext({});

export const AddonEquipments = [ 
    { id: 'Item_1', name: 'Item 1', image: '/public/User.png', equipped: false, isNew: true },
    { id: 'Item_1', name: 'Item 2', image: '/public/User.png', equipped: false, isNew: true },
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
    
    const Web_URL = "https://metaverse-wat-suan-kaew-u8047.vm.elestio.app/" || "http://localhost:3000";

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
