import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { useSocketClient } from "./Login/SocketClient";
import Peer from 'simple-peer';

const VideoChatContext = createContext({});

export const VideoChatProvider = ({children}) => {
    const [MicisMute, setMicisMute] = useState(false);
    const [Mute, setMute] = useState(false)
    const [camOff, setCamOff] = useState(true)
    const [connectPeer, setConnectPeer] = useState(false)
    const [Peers, setPeers] = useState([]);
    const [Stream, setStream] = useState();

    const userVideo = useRef();
    const peersRef = useRef([]);

    const {
        socketClient
    } = useSocketClient();

    useEffect(() => {
        if(socketClient){

            const { id } = socketClient;

            if(connectPeer) {
                navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
                    userVideo.current.srcObject = stream;
                    setStream(stream);
                    stream.getVideoTracks().forEach((track) => {
                        track.enabled = false
                    })

                    socketClient.emit("join voice")

                    socketClient.on("all users", (users) => {

                        const peers = []
                        users.forEach((user) => {
                            const peer = createPeer(user.ID, id, stream);

                            peersRef.current.push({
                                peerID: user.ID,
                                name: user.name,
                                peer: peer,
                            })

                            peers.push(peer)
                        })

                        setPeers(peers);
                    })
        
                    socketClient.on("user joined", ({signal, callerID, name}) => {

                        const peer = addPeer(signal, callerID, stream);

                        peersRef.current.push({
                            peerID: callerID,
                            name: name,
                            peer: peer,
                        })   

                        setPeers(users => [...users, peer]);
            
                    })

                    socketClient.on("receiving returned signal", ({ signal, id }) => {
                        const item = peersRef.current.find(p => p.peerID === id);
                        item.peer.signal(signal);
                    });

                })

            } else {     

                if(Stream) {
                    
                    setMicisMute(false)
                    setMute(false)
                    setCamOff(true)

                    socketClient.off("all users")
                    socketClient.off("user joined")
                    socketClient.off("receiving returned signal")  

                    Peers.forEach((peer) => {
                        peer.destroy();
                    });
                    
                    peersRef.current = []
    
                    setPeers([])
    
                    socketClient.emit('exit voice', id)

                    Stream.getTracks().forEach((track) => {
                        track.stop();
                    })
                }
                
            }

        }
    }, [connectPeer])

    useEffect(() => {
        if(Stream) {
            Stream.getAudioTracks().forEach((track) => {
                track.enabled = !MicisMute
            })
        }
    }, [MicisMute])

    useEffect(() => {
        if(Stream) {
            Stream.getVideoTracks().forEach((track) => {
                track.enabled = !camOff
            })
        }
    }, [camOff])


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
            }}
        >
            {children}
        </VideoChatContext.Provider>
    )
}

export const useVideoChat = () => {
    return useContext(VideoChatContext);
}