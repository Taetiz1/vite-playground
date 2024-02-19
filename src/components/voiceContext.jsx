import React, { createContext, useContext, useState, useEffect, useRef } from "react";
// import { createClient, createMicrophoneAndCameraTracks } from "agora-rtc-react"
import { useSocketClient } from "./Login/SocketClient";
import { useVideoClient } from "./Voice/settings";
import Peer from 'simple-peer';

const VideoChatContext = createContext({});

export const VideoChatProvider = ({children}) => {
    const [MicisMute, setMicisMute] = useState(false);
    const [Mute, setMute] = useState(false)
    const [camOff, setCamOff] = useState(false)
    const [connectPeer, setConnectPeer] = useState(false)
    const [Peers, setPeers] = useState([]);
    const [Stream, setStream] = useState();
    const [channelName, setChannelName] = useState("main");
    const [start, setStart] = useState(false);
    
    const [VideoUsers, setVideoUsers] = useState([]);
    const videoClient = useVideoClient();

    const userVideo = useRef();
    const peersRef = useRef([]);

    const {
        socketClient
    } = useSocketClient();

    const leaveChannel = async (tracks) => {
        await videoClient.leave();
        videoClient.removeAllListeners();
        tracks[0].close();
        tracks[1].close();
        setStart(false);
        setConnectPeer(false)
    };

    // const agoraClient = createClient({ mode: 'rtc', codec: 'vp8' });

    // agoraClient.init('324c17f38cca462fa7916683da05fb3a')
    // agoraClient.join('324c17f38cca462fa7916683da05fb3a', "name", null, )

    // useEffect(() => {
    //     if(socketClient) {
    //         const { id } = socketClient;

    //         if(connectPeer) {

    //             if(agoraClient) {

    //                 const start = async () => {
    //                     try {
    //                         const stream =  createStream({
    //                             audio: true,
    //                             video: true,
    //                         });
    //                         userVideo.current.srcObject = stream;
    //                         setStream(stream);
    //                         // Publish local stream to the channel
    //                         await agoraClient.publish(stream);
    //                     } catch (error) {
    //                         console.error('Error creating or publishing stream:', error);
    //                     }
    //                 }
                    
    //             }
    //         } else {
    //             if(agoraClient) {
    //                 // Unpublish local stream
    //                 agoraClient.unpublish(Stream);
    //                 // Leave channel
    //                 agoraClient.leave();
    //             }
    //         }
    //     }
    // }, [connectPeer, agoraClient])
    
    // const leaveChannel = async () => {
    //     await videoClient.leave();
    //     videoClient.removeAllListeners();
    //     tracks[0].close();
    //     tracks[1].close();
    //     setStart(false);
    // };

    // const mute = async (type) => {
    //     if(type === "audio") {
    //       await tracks[0].setEnabled(!MicisMute);

    //     } else if (type === "video") {
    //       await tracks[1].setEnabled(!camOff);
    //     }
    // };

    // useEffect(() => {
    //     if(socketClient){

    //         const { id } = socketClient;

    //         if(connectPeer) {
                
    //      

    //             // navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
    //             //     userVideo.current.srcObject = stream;
    //             //     setStream(stream);
    //             //     stream.getVideoTracks().forEach((track) => {
    //             //         track.enabled = false
    //             //     })

    //             //     socketClient.emit("join voice")

    //             //     socketClient.on("all users", (users) => {

    //             //         const peers = []
    //             //         users.forEach((user) => {
    //             //             const peer = createPeer(user.ID, id, stream);

    //             //             peersRef.current.push({
    //             //                 peerID: user.ID,
    //             //                 name: user.name,
    //             //                 peer: peer,
    //             //             })

    //             //             peers.push(peer)
    //             //         })

    //             //         setPeers(peers);
    //             //     })
        
    //             //     socketClient.on("user joined", ({signal, callerID, name}) => {

    //             //         const peer = addPeer(signal, callerID, stream);

    //             //         peersRef.current.push({
    //             //             peerID: callerID,
    //             //             name: name,
    //             //             peer: peer,
    //             //         })   

    //             //         setPeers(users => [...users, peer]);
            
    //             //     })

    //             //     socketClient.on("receiving returned signal", ({ signal, id }) => {
    //             //         const item = peersRef.current.find(p => p.peerID === id);
    //             //         item.peer.signal(signal);
    //             //     });

    //             // })

    //         }
    //         // else {     

    //         //     if(Stream) {
                    
    //         //         setMicisMute(false)
    //         //         setMute(false)
    //         //         setCamOff(true)

    //         //         socketClient.off("all users")
    //         //         socketClient.off("user joined")
    //         //         socketClient.off("receiving returned signal")  

    //         //         Peers.forEach((peer) => {
    //         //             peer.destroy();
    //         //         });
                    
    //         //         peersRef.current = []
    
    //         //         setPeers([])
    
    //         //         socketClient.emit('exit voice', id)

    //         //         Stream.getTracks().forEach((track) => {
    //         //             track.stop();
    //         //         })
    //         //     }
                
    //         // }

    //     }
    // }, [connectPeer])

    // useEffect(() => {
    //     if(start) {
    //         try {
    //             mute("audio")
    //         } catch (error) {
    //             console.log(error)
    //         }
    //     }
    // }, [MicisMute])

    // useEffect(() => {
    //     if(start) {
    //         try {
    //             mute("video")
    //         } catch (error) {
    //             console.log(error)
    //         }
    //     }
    // }, [camOff])

    // function createPeer(userToSignal, callerID, stream) {
    //     const peer = new Peer({
    //         initiator: true,
    //         trickle: false,
    //         stream,
    //     });

    //     peer.on("signal", (signal) => {
    //         socketClient.emit("sending signal", { userToSignal, callerID, signal })
    //     })

    //     return peer;
    // }

    // function addPeer(incomingSignal, callerID, stream) {
    //     const peer = new Peer({
    //         initiator: false,
    //         trickle: false,
    //         stream,
    //     })

    //     peer.on("signal", (signal) => {
    //         socketClient.emit("returning signal", { signal, callerID })
    //     })

    //     peer.signal(incomingSignal);

    //     return peer;
    // }

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
                VideoUsers,
                setVideoUsers,
                leaveChannel,
                start,
                setStart
            }}
        >
            {children}
        </VideoChatContext.Provider>
    )
}

export const useVideoChat = () => {
    return useContext(VideoChatContext);
}