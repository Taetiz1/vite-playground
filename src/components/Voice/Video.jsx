import React, { useRef, useEffect } from "react"; 

const Video = ({ peerRef, peerIndex, Mute, disconnectVoice }) => {

    const ref = useRef();
    
    useEffect(() => {

        peerRef.peer.on("stream", (stream) => {
            ref.current.srcObject = stream;
        })

        peerRef.peer.on('close', () => {
            disconnectVoice(peerIndex)
        });

    }, []);

    useEffect(() => {

        if(ref.current){
            ref.current.muted = Mute;
        }

    }, [Mute])
    
    return (
        <>
            <video 
                style={{ 
                    width: "135px",
                    height: "101.65px",
                    border: "1px solid #ccc",
                }} 
                playsInline 
                autoPlay    
                ref={ref} 
            />
        </>
        
    );
}

export default Video