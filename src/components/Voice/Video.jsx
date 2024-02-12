import React, { useRef, useEffect } from "react"; 

const Video = ({ peer, peerIndex, Mute, disconnectVoice }) => {

    const ref = useRef();
    
    useEffect(() => {

        peer.on("stream", stream => {
            ref.current.srcObject = stream;

        })

        peer.on('close', () => {
            disconnectVoice(peerIndex)
        });

        return(() => {
            peer.removeAllListeners('close')
        })

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
                    objectFit: "cover",
                }} 
                playsInline 
                autoPlay    
                ref={ref} 
            />
        </>
        
    );
}

export default Video