import React, { useEffect } from "react";
import { useVideoChat } from "../voiceContext";
import { useVideoClient } from "./settings";
import { useSocketClient } from "../Login/SocketClient";

import mute from '/assets/mute.png'
import unmute from '/assets/unmute.png'
import micMute from '/assets/micMute.png'
import micUnmute from '/assets/micUnmute.png'
import cam from '/assets/cam.png'
import CamOff from '/assets/camOff.png'
import disconnectBT from '/assets/disconnect.png'

const Controls = ({tracks}) => {

    const {
        MicisMute,
        setMicisMute,
        Mute,
        setMute,
        camOff,
        setCamOff,
        setStart,
        setConnectPeer,
        setVideoUsers,
        onDisconnect,
        setOnDisconnect,
        VideoUsers
        
    } = useVideoChat();

    const videoClient = useVideoClient();
    const { socketClient } = useSocketClient();

    useEffect(() => {
        
        if(MicisMute) {
            console.log(tracks)
            tracks[0].setEnabled(false);
            
        } else {
            tracks[0].setEnabled(true);
        }

    }, [MicisMute])

    useEffect(() => {
        if(camOff) {  
            tracks[1].setEnabled(false);
        } else {
            tracks[1].setEnabled(true);
        }

    }, [camOff])

    useEffect(() => {
        if(Mute) {
            
            setMicisMute(true)
            VideoUsers.forEach((user) => {
                if(user.audioTrack) {
                    user.audioTrack.setVolume(0)
                }
            })
            
        } else {

            setMicisMute(false)
            VideoUsers.forEach((user) => {
                if(user.audioTrack) {
                    user.audioTrack.setVolume(100)
                }
            })
        }

    }, [Mute, VideoUsers])

    useEffect(() => {
        if(onDisconnect) {
            leaveChannel()
        }
    }, [onDisconnect])

    const leaveChannel = async () => {
        socketClient.emit("exit voice", {id: socketClient.id})
        await videoClient.leave();
        videoClient.removeAllListeners();
        tracks[0].close();
        tracks[1].close();
        setVideoUsers([])
        setOnDisconnect(false)
        setStart(false)
        setConnectPeer(false)
        setMicisMute(false)
        setMute(false)
        setCamOff(false)
    };

    return(
        <div 
            style={{
                display: "grid",
                gridAutoFlow: "column",
                gridColumnGap: "8px",
                columnFap: "8px",
                alignItems: "center",
                justifyItems: "center",
                borderColor: "#eee",
                padding: "0px 16px",
                height: "48px",
                width: "100%",
                marginTop: "-1px"
            }}
        >

            <button
                onClick={() => {
                    if(!Mute) {
                        setMicisMute(!MicisMute)
                    } else {
                        setMute(false)
                        setMicisMute(false)
                    }
                }}
                style={{
                    width: '30px',
                    height: '30px',
                    display: 'inline-block',
                    outline: 'none',
                    border: 'none',
                    borderRadius: '24px',
                    color: '#fff',
                    cursor: 'pointer',
                    backgroundColor: 'rgb(225, 225, 225)',
                }}
            >
                {MicisMute ? <img src={micMute} style={{pointerEvents: 'none', userSelect: 'none', width: '18px', height: 'auto',}} />
                    : <img src={micUnmute} style={{pointerEvents: 'none', userSelect: 'none', width: '18px', height: 'auto',}} />}
            </button>

            <button
                onClick={() => { 
                    setMute(!Mute)
                }}
                style={{
                    width: '30px',
                    height: '30px',
                    display: 'inline-block',
                    outline: 'none',
                    border: 'none',
                    borderRadius: '24px',
                    color: '#fff',
                    cursor: 'pointer',
                    backgroundColor: 'rgb(225, 225, 225)' 
                }}
            >
                {Mute ? <img src={mute} style={{pointerEvents: 'none', userSelect: 'none', width: '18px', height: 'auto',}} />
                    : <img src={unmute} style={{pointerEvents: 'none', userSelect: 'none', width: '18px', height: 'auto',}} />}
            </button>

            <button
                onClick={() => {setCamOff(!camOff)}}
                style={{
                    width: '30px',
                    height: '30px',
                    display: 'inline-block',
                    outline: 'none',
                    border: 'none',
                    borderRadius: '24px',
                    color: '#fff',
                    cursor: 'pointer',
                    backgroundColor: 'rgb(225, 225, 225)' 
                    }}
            >
                { camOff ? <img src={CamOff} style={{pointerEvents: 'none', userSelect: 'none', width: 'auto', height: '20px',}} />
                    : <img src={cam} style={{pointerEvents: 'none', userSelect: 'none', width: '20px', height: 'auto',}} />}
            </button>

            <button
                onClick={() => {
                    setOnDisconnect(true)
                }}
                style={{
                    width: '30px',
                    height: '30px',
                    display: 'inline-block',
                    outline: 'none',
                    border: 'none',
                    borderRadius: '24px',
                    color: '#fff',
                    cursor: 'pointer',
                    backgroundColor: 'rgb(220, 20, 60)' 
                }}
            >
                <img src={disconnectBT} style={{pointerEvents: 'none', userSelect: 'none', width: '18px', height: 'auto',}}/>
            </button>

        </div>
    )
}

export default Controls