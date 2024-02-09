import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { useSocketClient } from "./Login/SocketClient";
import Peer from 'simple-peer';

const VideoChatContext = createContext({});

export const VideoChatProvider = ({children}) => {
    const [MicisMute, setMicisMute] = useState(false);
    const [Mute, setMute] = useState(false)
    const [camOff, setCamOff] = useState(false)
    const [connectPeer, setConnectPeer] = useState(false)
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

                    socketClient.emit("join voice")

                    socketClient.on("all users", (users) => {

                        const peers = []
                        users.forEach((userID) => {
                            const peer = createPeer(userID, id, stream);
                            peersRef.current.push({
                            peerID: userID,
                            peer: peer,
                            })

                            peers.push(peer)
                        })
                    })
        
                    socketClient.on("user joined", ({signal, callerID}) => {

                        const peer = addPeer(signal, callerID, stream);
                        peersRef.current.push({
                            peerID: callerID,
                            peer: peer,
                        })   
            
                    })

                    socketClient.on("receiving returned signal", ({ signal, id }) => {
                        const item = peersRef.current.find(p => p.peerID === id);
                        item.peer.signal(signal);
                    });

                })

            } else {

                
                socketClient.off("all users")
                socketClient.off("user joined")
                socketClient.off("receiving returned signal")

                if(Stream) {

                    peersRef.current.forEach((p) => {
                        p.peer.destroy()
                    })

                    peersRef.current = []
                    
                    Stream.getTracks().forEach((track) => {
                        track.stop();
                    })

                    socketClient.emit('exit voice', id)
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
            }}
        >
            {children}
        </VideoChatContext.Provider>
    )
}

export const useVideoChat = () => {
    return useContext(VideoChatContext);
}