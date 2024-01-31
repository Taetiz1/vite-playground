import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { useSocketClient } from "./Login/SocketClient";
import Peer from 'simple-peer';

const VideoChatContext = createContext({});

export const VideoChatProvider = ({children}) => {
    const [MicisToggled, setMicIsToggled] = useState(false);
    const [Peers, setPeers] = useState([]);
    // const [stream, setStream] = useState();
    // const [caller, setCaller] = useState(false);

    // const myVideo = useRef();
    const userVideo = useRef();
    // const connectionRef = useRef();
    const peersRef = useRef([]);

    const {
        socketClient
    } = useSocketClient();

    const videoConstraints = {
        height: window.innerHeight / 2,
        width: window.innerWidth / 2
    };

    // useEffect(() => {
    //     if(socketClient){
    //     if(MicisToggled) {

    //         navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    //             .then((currentStream) => {
    //                 setStream(currentStream)

    //                 myVideo.current.srcObject = currentStream;
    //             });         
                
    //             socketClient.on("call users", ({signalData, from}) => {
        
    //                 const peer = new Peer({ initiator: false, trickle: false, stream });
                
    //                 peer.on('signal', (data) => {
    //                     socketClient.emit('answer Call', { signal: data, to: from });
    //                 });
                
    //                 peer.on('stream', (currentStream) => {
    //                   userVideo.current.srcObject = currentStream;
    //                 });
                
    //                 peer.signal(signalData);
                
    //                 connectionRef.current = peer;
    //             })

    //     } 

       
    //     }

    // }, [MicisToggled])

    // const callUser = () => {

    //     setMicIsToggled(!MicisToggled);

    //     const peer = new Peer({ initiator: true, trickle: false, stream });

    //     peer.on('signal', (data) => {
    //         socketClient.emit("join voice", {signalData: data})
    //     });

    //     peer.on('stream', (currentStream) => {
    //         userVideo.current.srcObject = currentStream;
    //     });

    //     socketClient.on('call accepted', (signal) => {

    //         peer.signal(signal);
    //     });

    //     connectionRef.current = peer;
    // }

    useEffect(() => {
        if(MicisToggled) {

            const { id } = socketClient;
            
            navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
                // userVideo.current.srcObject = stream;
                socketClient.emit("join voice")

                socketClient.on("all users", (users) => {
                    const peers = []
                    users.forEach((userID) => {
                        const peer = createPeer(userID, id, stream);
                        peersRef.current.push({
                        peerID: userID,
                        peer,
                        })

                        peers.push(peer)
                    })
                    
                    setPeers(peers)
                })
    
                socketClient.on("user joined", ({signal, callerID}) => {
                    const peer = addPeer(signal, callerID, stream);
                    peersRef.current.push({
                        peerID: callerID,
                        peer: peer,
                    })        
                    
                    setPeers(users => [...users, peer]);
        
                })

                socketClient.on("receiving returned signal", ({ signal, id }) => {
                    const item = peersRef.current.find(p => p.peerID === id);
                    item.peer.signal(signal);
                });

            })

        } 
    },[MicisToggled])


    function createPeer(userToSignal, callerID, stream) {
        const peer = new Peer({
        initiator: true,
        trickle: false,
        stream,
        });

        peer.on("signal", (signal) => {
            socketClient.emit("sending signal", { userToSignal, callerID, signal })
        })

        return peer;
    }

    function addPeer(incomingSignal, callerID, stream) {
        const peer = new Peer({
        initiator: false,
        trickle: false,
        stream,
        })

        peer.on("signal", (signal) => {
            socketClient.emit("returning signal", { signal, callerID })
        })

        peer.signal(incomingSignal);

        return peer;
    }

    return (
        <VideoChatContext.Provider
            value={{
                MicisToggled,
                setMicIsToggled,
                Peers,
                setPeers,
                userVideo,
            }}
        >
            {children}
        </VideoChatContext.Provider>
    )
}

export const useVideoChat = () => {
    return useContext(VideoChatContext);
}