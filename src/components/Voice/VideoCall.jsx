import React, { useState, useEffect } from "react"; 
import { useVideoChat } from "../voiceContext";
import { useVideoClient, useVideoTracks, appConfig } from "./settings";
import { useSocketClient } from "../Login/SocketClient";
import Controls from "./controls";
import { AgoraVideoPlayer } from "agora-rtc-react";

const VideoCall = (props) => {
    const {
        setVideoUsers,
        channelName,
        start,
        setStart,
        connectPeer
    } = useVideoChat();

    const { socketClient } = useSocketClient();
    
    const { id } = socketClient;
    
    const videoClient = useVideoClient();
    const { ready, tracks } = useVideoTracks();
    const [userTrack, setUserTrack] = useState([]);

    useEffect(() => {
        let init = async (name) => {
            videoClient.on("user-published", async (user, mediaType) => {
                
                await videoClient.subscribe(user, mediaType);
                if(mediaType === "video") {
                        
                    setVideoUsers((prevUsers) => {
                        return [...prevUsers, user];
                    });
                            
                }
                    
                if(mediaType === "audio") {
                    user.audioTrack.play();
                }

            })

            videoClient.on("user-unpublished", (user, mediaType) => {
                if(mediaType === "audio") {
                    if(user.audioTrack) {
                        user.audioTrack.stop()
                    }
                }

                if(mediaType === "video") {
                    setVideoUsers((prevUsers) => {
                        return prevUsers.filter((User) => User.uid !== user.uid);
                    });
                }

            })

            videoClient.on("user-left", (user) => {
                setVideoUsers((prevUsers) => {
                    return prevUsers.filter((User) => User.uid !== user.uid);
                });

            })

            await videoClient.join(appConfig.appId, name, appConfig.token, id)    
            if(tracks) { 
                await videoClient.publish([tracks[0], tracks[1]]);
                setUserTrack(tracks[1])
            }
            setStart(true)
        }

        if(ready && tracks) {
            init(channelName);
        }

}, [channelName, videoClient, ready, tracks])
    
    return (<>
        {start && tracks && (

            <AgoraVideoPlayer 
                style={{
                    height: 'auto', 
                    width: '240px', 
                    borderRadius: '16px 16px 0px 0', 
                    margin: '0px',
                    zIndex: '9999999'
                }}  
                videoTrack={tracks[1]} 
            />
        ) && (
            
            <Controls tracks={tracks} />
        )
        }
    </>)
}

export default VideoCall