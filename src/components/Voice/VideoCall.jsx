import React, { useEffect } from "react"; 
import { useVideoChat } from "../voiceContext";
import { useVideoClient, useVideoTracks, appConfig } from "./settings";
import { useSocketClient } from "../Login/SocketClient";
import Controls from "./Controls";
import { AgoraVideoPlayer } from "agora-rtc-react";

const VideoCall = () => {
    const {
        setVideoUsers,
        start,
        setStart,
        channelName,
        Mute
    } = useVideoChat();

    const { socketClient } = useSocketClient();
    
    const { id } = socketClient;
    
    const videoClient = useVideoClient();
    const { ready, tracks } = useVideoTracks();

    useEffect(() => {
        let init = async (name) => {
            videoClient.on("user-published", async (user, mediaType) => {
                
                await videoClient.subscribe(user, mediaType);
                if(mediaType === "video") {
                        
                    setVideoUsers((prevUsers) => {
                        const check = prevUsers.find((User) => User.uid === user.uid);

                        if(check) {
                            return [...prevUsers]
                        } else {
                            return [...prevUsers, user]
                        } 

                    });
                            
                }
                    
                if(mediaType === "audio") {
                    user.audioTrack.play();
                    if(Mute) {
                        user.audioTrack.setVolume(0)
                    }
                }

            })

            videoClient.on("user-unpublished", (user, mediaType) => {
                if(mediaType === "audio") {
                    if(user.audioTrack) {
                        user.audioTrack.stop()
                    }
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
            }
            setStart(true)
        }

        if(ready && tracks) {
            init(channelName);
        }

}, [videoClient, ready, tracks])
    
    return (<>
        {start && tracks && 
        
            <AgoraVideoPlayer 
                videoTrack={tracks[1]}
                
                style={{ 
                    width: "240px",
                    height: "165px",
                }} 
            />
        }
        
        {start && tracks && 
            <Controls tracks={tracks}/>
        }
    </>)
}

export default VideoCall