import React, { useRef, useEffect } from "react"; 
import { useVideoChat } from "../voiceContext";   

const Video = ({ p, disconnectVoice, Mute, setVoiceConnected }) => {

    const ref = useRef();
    
    useEffect(() => {
        p.peer.on("stream", (stream) => {
            ref.current.srcObject = stream;
        })

        p.peer.on('close', () => {
            setVoiceConnected(false)
            disconnectVoice()

        });

    }, [p]);

    useEffect(() => {

        if(ref.current){
            ref.current.muted = Mute;
        }

    }, [Mute])
    
    return (
        <>
            <video 
                style={{ 
                    width: "100px",
                    height: "100px",
                }} 
                playsInline 
                autoPlay    
                ref={ref} 
            />
        </>
        
    );
}

export default Video